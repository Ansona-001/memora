import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { queryKeys } from "@/config/queryKeys";
import { UPLOAD_LIMITS } from "@/config/uploadLimits";
import { useAiEnrichment } from "@/features/ai/hooks/useAiEnrichment";
import { useAiPreference } from "@/features/ai/hooks/useAiSuggestion";
import { logAiError } from "@/features/ai/services/imagePreprocessing";
import { useCoupleSpace } from "@/features/couple-space/hooks/useCoupleSpace";
import { useAuth } from "@/hooks/useAuth";
import {
  insertMemory,
  updateMemoryAiFields,
  uploadMemoryMedia,
  uploadMemoryThumbnail,
} from "@/services/mediaService";
import { useUploadStore } from "@/stores/uploadStore";
import type { UploadQueueItem } from "@/types/media";
import { getFileExtension, isVideoFile } from "@/utils/fileUtils";
import {
  compressImageFile,
  generatePhotoThumbnail,
  generateVideoThumbnail,
  getImageDimensions,
  getPhotoCapturedAt,
  getVideoMetadata,
} from "@/utils/mediaUtils";
import {
  buildMemoryMediaPath,
  buildMemoryThumbnailPath,
} from "@/utils/storagePaths";
import { getErrorMessage } from "@/utils/errorUtils";
import { validateUploadFile, validateVideoDuration } from "@/utils/validation";

export function useUploadQueue() {
  const items = useUploadStore((state) => state.items);
  const addItems = useUploadStore((state) => state.addItems);
  const setStatus = useUploadStore((state) => state.setStatus);
  const removeItem = useUploadStore((state) => state.removeItem);
  const clearCompleted = useUploadStore((state) => state.clearCompleted);
  const updateItem = useUploadStore((state) => state.updateItem);

  const { user } = useAuth();
  const { data: coupleSpace } = useCoupleSpace();
  const queryClient = useQueryClient();

  const { aiEnabled } = useAiPreference();
  const { enrichItem } = useAiEnrichment(aiEnabled);

  const processItem = useCallback(
    async (item: UploadQueueItem) => {
      if (!coupleSpace || !user) {
        setStatus(item.id, "error", {
          errorMessage: "Your couple space isn't ready yet.",
        });
        return;
      }

      try {
        setStatus(item.id, "processing", { progress: 10 });

        const memoryId = crypto.randomUUID();
        let mediaFile: File;
        let thumbnailBlob: Blob;
        let width: number | null = null;
        let height: number | null = null;
        let durationSeconds: number | null = null;
        let capturedAt: Date | null = null;
        const latest = () =>
          useUploadStore.getState().items.find((entry) => entry.id === item.id);

        if (item.mediaType === "video") {
          updateItem(item.id, { aiStatus: "skipped" });
          const metadata = await getVideoMetadata(item.file);
          const durationError = validateVideoDuration(metadata.durationSeconds);
          if (durationError) {
            setStatus(item.id, "error", { errorMessage: durationError });
            return;
          }

          width = metadata.width;
          height = metadata.height;
          durationSeconds = metadata.durationSeconds;
          mediaFile = item.file;
          thumbnailBlob = await generateVideoThumbnail(item.file);
        } else {
          // Free on-device AI runs AFTER the upload completes, never before.
          // Photos upload instantly; the tags/embedding backfill when ready.
          // A bounded timeout + missing-column-tolerant update keep uploads safe.
          const dimensions = await getImageDimensions(item.file);
          width = dimensions.width;
          height = dimensions.height;
          // Read EXIF before compression, which strips it.
          capturedAt = await getPhotoCapturedAt(item.file);
          mediaFile = await compressImageFile(item.file);
          thumbnailBlob = await generatePhotoThumbnail(item.file);
        }

        setStatus(item.id, "uploading", { progress: 40 });

        // Photos are always re-encoded to WEBP by compressImageFile, so the
        // stored extension must reflect that rather than the source file's
        // original format. Videos pass through untouched.
        const extension =
          item.mediaType === "video"
            ? getFileExtension(item.file)
            : "webp";
        const mediaPath = buildMemoryMediaPath(
          coupleSpace.id,
          memoryId,
          extension,
          capturedAt ?? undefined,
        );
        const thumbnailPath = buildMemoryThumbnailPath(
          coupleSpace.id,
          memoryId,
        );

        await uploadMemoryMedia(mediaPath, mediaFile);
        setStatus(item.id, "uploading", { progress: 70 });

        await uploadMemoryThumbnail(thumbnailPath, thumbnailBlob);
        setStatus(item.id, "uploading", { progress: 90 });

        const title = latest()?.title ?? item.title;
        // AI backfills after insert; upload itself carries no AI dependency.
        await insertMemory({
          id: memoryId,
          couple_space_id: coupleSpace.id,
          created_by: user.id,
          media_type: item.mediaType,
          storage_path: mediaPath,
          thumbnail_path: thumbnailPath,
          file_size_bytes: mediaFile.size,
          width,
          height,
          duration_seconds: durationSeconds,
          title: title.trim() || null,
          ai_tags: [],
          ...(capturedAt ? { captured_at: capturedAt.toISOString() } : {}),
        });

        setStatus(item.id, "success", { progress: 100 });
        queryClient.invalidateQueries({ queryKey: queryKeys.memories.all });
        queryClient.invalidateQueries({
          queryKey: queryKeys.home.feed(coupleSpace.id),
        });

        // Post-upload AI backfill: never blocks or fails the upload itself.
        if (item.mediaType === "photo") {
          void (async () => {
            const queueItem = useUploadStore
              .getState()
              .items.find((entry) => entry.id === item.id);
            if (!queueItem || queueItem.mediaType === "video") {
              return;
            }

            updateItem(item.id, { aiStatus: "pending" });

            try {
              await enrichItem(queueItem);
              const aiTags = latest()?.aiTags ?? [];
              const aiEmbedding = latest()?.aiEmbedding ?? null;

              if (aiTags.length > 0) {
                try {
                  await updateMemoryAiFields(memoryId, {
                    ai_tags: aiTags,
                    ai_embedding: aiEmbedding,
                    ai_model_version: "Xenova/clip-vit-base-patch32",
                  });
                  queryClient.invalidateQueries({
                    queryKey: queryKeys.memories.all,
                  });
                } catch (error) {
                  // Distinct from enrichItem failures: the caption/tags were
                  // generated fine but the DB write failed, so don't leave
                  // aiStatus at "success" — that would hide a real save failure.
                  logAiError("failed to save ai fields", error);
                  updateItem(item.id, {
                    aiStatus: "error",
                    aiErrorMessage:
                      "AI suggestion couldn't be saved — your photo still uploads normally.",
                  });
                }
              } else {
                updateItem(item.id, { aiStatus: "skipped" });
              }
            } catch (error) {
              // enrichItem already recorded aiStatus: error on the queue item.
              // The memory row itself is saved, so there is nothing to undo.
              logAiError("ai enrichment pipeline failed", error);
            }
          })();
        }
      } catch (error) {
        setStatus(item.id, "error", { errorMessage: getErrorMessage(error) });
      }
    },
    [coupleSpace, user, setStatus, updateItem, enrichItem, queryClient],
  );

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const availableSlots = Math.max(
        0,
        UPLOAD_LIMITS.maxFilesPerUpload - items.length,
      );
      const incoming = Array.from(files).slice(0, availableSlots);

      const newItems: UploadQueueItem[] = incoming.map((file) => {
        const validationError = validateUploadFile(file);

        return {
          id: crypto.randomUUID(),
          file,
          mediaType: isVideoFile(file) ? "video" : "photo",
          previewUrl: URL.createObjectURL(file),
          title: "",
          status: validationError ? "error" : "queued",
          progress: 0,
          errorMessage: validationError,
          aiTags: [],
          aiStatus: "idle",
          aiErrorMessage: null,
        };
      });

      addItems(newItems);

      for (const item of newItems) {
        if (item.status === "queued") {
          void processItem(item);
        }
      }
    },
    [items.length, addItems, processItem],
  );

  const retryItem = useCallback(
    (id: string) => {
      const item = items.find((entry) => entry.id === id);
      if (item) {
        void processItem({ ...item, status: "queued", errorMessage: null });
      }
    },
    [items, processItem],
  );

  return { items, addFiles, retryItem, removeItem, clearCompleted };
}
