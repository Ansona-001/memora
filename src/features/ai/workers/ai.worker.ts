// CLIP-based zero-shot tagging + embeddings — replaces the vit-gpt2
// captioning worker.
//
// Model: Xenova/clip-vit-base-patch32 (~50-90MB total for both towers, vs
// ~960MB for the captioning model). Single forward pass per image, no
// autoregressive decode loop, so there is no shared decode state to corrupt
// under concurrent requests the way the captioning worker had. Requests are
// still serialized through a queue below anyway, since these model
// instances aren't guaranteed re-entrant and it costs nothing when each
// call is this fast.
//
// Deliberately NOT using the generic pipeline("feature-extraction", ...) /
// pipeline("image-feature-extraction", ...) helpers here: verified via a
// live Playwright probe (not just code review) that the text-tower task
// resolution for this model falls back to loading the full joint CLIPModel
// (model_quantized.onnx, ~150MB, requires pixel_values AND input_ids)
// instead of the text-only export (text_model_quantized.onnx, ~64MB) — the
// generic pipeline has no "clip" -> text-only-class mapping for a plain
// "feature-extraction" task, only for "image-feature-extraction". Calling
// CLIPTextModelWithProjection/CLIPVisionModelWithProjection directly (the
// officially documented low-level API for exactly this use case) avoids
// that task-resolution ambiguity entirely.
import {
  AutoProcessor,
  AutoTokenizer,
  CLIPTextModelWithProjection,
  CLIPVisionModelWithProjection,
  RawImage,
  type PreTrainedTokenizer,
  type Processor,
} from "@huggingface/transformers";

import { TAG_VOCABULARY, tagToPrompt } from "@/features/ai/config/aiConfig";

const MODEL_ID = "Xenova/clip-vit-base-patch32";
// The captioning model's decoder graph broke on both "q8" and "fp16" in
// this pinned onnxruntime-web build. CLIP's graph is simpler (no KV-cache /
// incremental decode), so "q8" is worth the download-size win here — but if
// the same MatMulNBits/DequantizeLinear failures show up, fall back to
// "fp32" exactly as with vit-gpt2. Verified via a live Playwright probe
// driving a real upload, not just code review, before shipping this value.
const DTYPE: "q8" | "fp32" = "q8";

export interface ClipTagResult {
  tag: string;
  score: number; // cosine similarity, 0..1 range in practice (can be slightly negative)
}

export type AiWorkerRequest =
  | { type: "warmup" }
  | { type: "caption"; id: string; image: Blob }
  | { type: "embed-text"; id: string; text: string };

export type AiWorkerResponse =
  | { type: "ready" }
  | {
      type: "caption-success";
      id: string;
      tags: ClipTagResult[];
      embedding: number[];
    }
  | { type: "embed-text-result"; id: string; embedding: number[] }
  | { type: "caption-error"; id: string; message: string };

let tokenizer: PreTrainedTokenizer | null = null;
let textModel: InstanceType<typeof CLIPTextModelWithProjection> | null = null;
let processor: Processor | null = null;
let visionModel: InstanceType<typeof CLIPVisionModelWithProjection> | null =
  null;

// Precomputed embeddings for the fixed tag vocabulary. Computed once at
// worker init and reused for every image — this is the whole reason
// zero-shot tagging is cheap: only the image needs a fresh forward pass.
let vocabEmbeddings: Float32Array[] | null = null;
let readySent = false;

function cosineSimilarity(a: Float32Array, b: Float32Array): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
}

async function embedText(text: string): Promise<Float32Array> {
  if (!tokenizer || !textModel) throw new Error("text tower not initialized");
  const inputs = tokenizer([text], { padding: true, truncation: true });
  const { text_embeds } = await textModel(inputs);
  return Float32Array.from(text_embeds.data as Float32Array);
}

async function embedImage(blob: Blob): Promise<Float32Array> {
  if (!processor || !visionModel) throw new Error("vision tower not initialized");
  // RawImage.fromBlob() is the documented input type, but drawing through
  // an OffscreenCanvas is the same proven-working path already used to fix
  // the vit-gpt2 worker's ImageBitmap-input bug, so reuse it here too.
  const bitmap = await createImageBitmap(blob);
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get 2D context for AI image conversion.");
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

  const image = RawImage.fromCanvas(canvas);
  const imageInputs = await processor(image);
  const { image_embeds } = await visionModel(imageInputs);
  return Float32Array.from(image_embeds.data as Float32Array);
}

let pipelinePromise: Promise<void> | null = null;

async function loadPipeline(): Promise<void> {
  if (!pipelinePromise) {
    pipelinePromise = (async () => {
      tokenizer = await AutoTokenizer.from_pretrained(MODEL_ID);
      textModel = await CLIPTextModelWithProjection.from_pretrained(MODEL_ID, {
        dtype: DTYPE,
      });
      processor = await AutoProcessor.from_pretrained(MODEL_ID);
      visionModel = await CLIPVisionModelWithProjection.from_pretrained(
        MODEL_ID,
        { dtype: DTYPE },
      );

      const embeddings: Float32Array[] = [];
      for (const tag of TAG_VOCABULARY) {
        embeddings.push(await embedText(tagToPrompt(tag)));
      }
      vocabEmbeddings = embeddings;
    })().catch((error: unknown) => {
      pipelinePromise = null;
      throw error;
    });
  }
  return pipelinePromise;
}

function notifyReady(port: { postMessage: (msg: AiWorkerResponse) => void }) {
  if (!readySent) {
    readySent = true;
    port.postMessage({ type: "ready" });
  }
}

self.onmessage = async (event: MessageEvent<AiWorkerRequest>) => {
  const msg = event.data;
  const port = self as unknown as {
    postMessage: (msg: AiWorkerResponse) => void;
  };

  if (msg.type === "warmup") {
    try {
      await loadPipeline();
    } catch {
      // Warmup is best-effort: the real request surfaces the actual error
      // and the main thread falls back gracefully.
    }
    notifyReady(port);
    return;
  }

  if (msg.type === "caption") {
    try {
      await loadPipeline();
      notifyReady(port);
      if (!vocabEmbeddings) throw new Error("vocabulary not ready");

      const imageEmb = await embedImage(msg.image);
      const tags = TAG_VOCABULARY.map((tag, i) => ({
        tag,
        score: cosineSimilarity(imageEmb, vocabEmbeddings![i]),
      })).sort((a, b) => b.score - a.score);

      port.postMessage({
        type: "caption-success",
        id: msg.id,
        tags,
        embedding: Array.from(imageEmb),
      });
    } catch (error) {
      port.postMessage({
        type: "caption-error",
        id: msg.id,
        message: error instanceof Error ? error.message : "Tagging failed.",
      });
    }
    return;
  }

  if (msg.type === "embed-text") {
    try {
      await loadPipeline();
      notifyReady(port);
      const emb = await embedText(msg.text);
      port.postMessage({
        type: "embed-text-result",
        id: msg.id,
        embedding: Array.from(emb),
      });
    } catch (error) {
      port.postMessage({
        type: "caption-error",
        id: msg.id,
        message: error instanceof Error ? error.message : "Embedding failed.",
      });
    }
  }
};
