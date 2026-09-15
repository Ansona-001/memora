import { logAiError } from "./imagePreprocessing";
import type {
  AiWorkerRequest,
  AiWorkerResponse,
  ClipTagResult,
} from "../workers/ai.worker";

export interface ClipAnalysisResult {
  tags: ClipTagResult[];
  embedding: number[];
}

export interface AiClient {
  analyzeImage(image: Blob, signal?: AbortSignal): Promise<ClipAnalysisResult>;
  embedQuery(text: string, signal?: AbortSignal): Promise<number[]>;
  warmup(signal?: AbortSignal): Promise<void>;
  dispose(): void;
}

type PendingEntry = {
  resolve: (msg: AiWorkerResponse) => void;
  reject: (e: Error) => void;
};

export function createAiClient(): AiClient {
  let worker: Worker | null = null;
  let ready: Promise<void> | null = null;
  const pending = new Map<string, PendingEntry>();
  let counter = 0;

  const ensure = () => {
    if (!worker) {
      worker = new Worker(new URL("../workers/ai.worker.ts", import.meta.url), {
        type: "module",
      });
      worker.onmessage = (e: MessageEvent<AiWorkerResponse>) => {
        const msg = e.data;
        if (msg.type === "ready") return;
        const id = msg.id;
        const entry = pending.get(id);
        if (!entry) return;
        pending.delete(id);
        if (msg.type === "caption-error") {
          entry.reject(new Error(msg.message));
        } else {
          entry.resolve(msg);
        }
      };
      worker.onerror = (e) => {
        const err =
          e.error instanceof Error ? e.error : new Error("AI worker failed");
        logAiError("worker error", err);
        for (const [id, entry] of pending) {
          pending.delete(id);
          entry.reject(err);
        }
      };
    }
    return worker;
  };

  const waitReady = (signal?: AbortSignal): Promise<void> => {
    if (!ready) {
      const w = ensure();
      ready = new Promise<void>((resolve, reject) => {
        // The one-time model download for CLIP is far smaller than the old
        // captioning model's ~960MB (roughly 50-90MB), but keep a generous
        // window anyway — this must not be shorter than the caller's own
        // give-up window (useAiEnrichment's timeout), or that timeout
        // becomes unreachable dead code, same bug as before with vit-gpt2.
        const timer = window.setTimeout(() => {
          cleanup();
          reject(new Error("Timed out loading AI model."));
        }, 600_000);
        const cleanup = () => {
          window.clearTimeout(timer);
          w.removeEventListener("message", onReady);
        };
        const onReady = (e: MessageEvent<AiWorkerResponse>) => {
          if (e.data.type === "ready") {
            cleanup();
            resolve();
          }
        };
        w.addEventListener("message", onReady);
        w.postMessage({ type: "warmup" } satisfies AiWorkerRequest);
        signal?.addEventListener("abort", () => {
          cleanup();
          ready = null;
          reject(new DOMException("Aborted", "AbortError"));
        });
      }).catch((err: unknown) => {
        ready = null;
        throw err;
      });
    }
    return ready;
  };

  // CLIP's forward pass has no shared decode state to corrupt the way the
  // old captioning model's autoregressive decoder did, but pipeline()
  // instances aren't guaranteed re-entrant, and it costs nothing to keep
  // memory usage predictable under a burst of uploads. Chain every request
  // onto this promise so only one runs at a time; queued callers just wait.
  let queueTail: Promise<unknown> = Promise.resolve();

  const send = (
    request: Extract<AiWorkerRequest, { id: string }>,
    signal?: AbortSignal,
  ): Promise<AiWorkerResponse> =>
    waitReady(signal).then(() => {
      const w = ensure();
      if (signal?.aborted) {
        throw new DOMException("Aborted", "AbortError");
      }
      return new Promise<AiWorkerResponse>((resolve, reject) => {
        pending.set(request.id, { resolve, reject });
        signal?.addEventListener("abort", () => {
          pending.delete(request.id);
          reject(new DOMException("Aborted", "AbortError"));
        });
        w.postMessage(request);
      });
    });

  const enqueue = <T>(task: () => Promise<T>): Promise<T> => {
    const result = queueTail.then(task, task);
    queueTail = result.then(
      () => undefined,
      () => undefined,
    );
    return result;
  };

  return {
    warmup: (signal) => waitReady(signal),
    analyzeImage(image, signal) {
      return enqueue(async () => {
        const id = `analyze-${Date.now()}-${counter++}`;
        const msg = await send({ type: "caption", id, image }, signal);
        if (msg.type !== "caption-success") {
          throw new Error(`unexpected worker response: ${msg.type}`);
        }
        return { tags: msg.tags, embedding: msg.embedding };
      });
    },
    embedQuery(text, signal) {
      return enqueue(async () => {
        const id = `embed-${Date.now()}-${counter++}`;
        const msg = await send({ type: "embed-text", id, text }, signal);
        if (msg.type !== "embed-text-result") {
          throw new Error(`unexpected worker response: ${msg.type}`);
        }
        return msg.embedding;
      });
    },
    dispose() {
      pending.clear();
      ready = null;
      worker?.terminate();
      worker = null;
    },
  };
}

let shared: AiClient | null = null;

export function getSharedAiClient(): AiClient {
  if (!shared) shared = createAiClient();
  return shared;
}
