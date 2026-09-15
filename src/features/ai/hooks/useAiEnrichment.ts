// Free on-device AI tagging for Memora uploads.
//
// Cost: $0 — CLIP runs in a Web Worker via Transformers.js, photos never
// leave the device.
//
// AI runs AFTER the memory row is saved. Uploads never wait on the model:
// a slow download or blocked CDN only affects the suggestion row, via a
// bounded timeout and graceful error state.

import { useCallback, useEffect, useRef } from "react";

import {
  MAX_TAGS_PER_MEMORY,
  TAG_SIMILARITY_THRESHOLD,
} from "@/features/ai/config/aiConfig";
import { getSharedAiClient } from "@/features/ai/services/aiClient";
import { logAiError } from "@/features/ai/services/imagePreprocessing";
import { useUploadStore } from "@/stores/uploadStore";
import type { UploadQueueItem } from "@/types/media";
import { isPhotoFile } from "@/utils/fileUtils";

export function useAiEnrichment(enabled: boolean) {
  const updateItem = useUploadStore((state) => state.updateItem);
  const abortControllers = useRef(new Map<string, AbortController>());
  const enabledRef = useRef(enabled);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      for (const [, controller] of abortControllers.current) {
        controller.abort();
      }
      abortControllers.current.clear();
      return;
    }

    // Best-effort warmup so the first photo feels instant. Failures are
    // ignored — analyzeImage() retries the load on demand.
    const warmupController = new AbortController();
    void getSharedAiClient()
      .warmup(warmupController.signal)
      .catch((error: unknown) => logAiError("warmup failed", error));

    return () => {
      warmupController.abort();
    };
  }, [enabled]);

  useEffect(() => {
    const controllers = abortControllers.current;
    return () => {
      for (const [, controller] of controllers) {
        controller.abort();
      }
      controllers.clear();
    };
  }, []);

  const cancelForItem = (id: string) => {
    abortControllers.current.get(id)?.abort();
    abortControllers.current.delete(id);
  };

  const enrichItem = useCallback(
    async (item: UploadQueueItem): Promise<void> => {
      if (
        !enabledRef.current ||
        item.mediaType !== "photo" ||
        !isPhotoFile(item.file)
      ) {
        updateItem(item.id, { aiStatus: "skipped" });
        return;
      }

      abortControllers.current.get(item.id)?.abort();
      const controller = new AbortController();
      abortControllers.current.set(item.id, controller);
      // Bounded wait: the model download can take a while on first run.
      // Upload already succeeded, so cap the suggestion and fall back.
      const timeout = window.setTimeout(() => controller.abort(), 630_000);

      updateItem(item.id, {
        aiStatus: "processing",
        aiErrorMessage: null,
      });

      try {
        const { tags, embedding } = await getSharedAiClient().analyzeImage(
          item.file,
          controller.signal,
        );

        if (controller.signal.aborted) {
          return;
        }

        const selectedTags = tags
          .filter((t) => t.score >= TAG_SIMILARITY_THRESHOLD)
          .slice(0, MAX_TAGS_PER_MEMORY)
          .map((t) => t.tag);

        if (selectedTags.length === 0) {
          updateItem(item.id, { aiStatus: "skipped" });
          return;
        }

        updateItem(item.id, {
          aiStatus: "success",
          aiTags: selectedTags,
          aiEmbedding: embedding,
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          updateItem(item.id, { aiStatus: "skipped" });
          return;
        }

        logAiError(`enrichment failed for ${item.file.name}`, error);
        updateItem(item.id, {
          aiStatus: "error",
          aiErrorMessage:
            "AI suggestion unavailable — your photo still uploads normally.",
        });
      } finally {
        window.clearTimeout(timeout);
        if (abortControllers.current.get(item.id) === controller) {
          abortControllers.current.delete(item.id);
        }
      }
    },
    [updateItem],
  );

  return { enrichItem, cancelForItem };
}
