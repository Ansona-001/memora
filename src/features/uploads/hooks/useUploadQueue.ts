import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { queryKeys } from "@/config/queryKeys";
import { UPLOAD_LIMITS } from "@/config/uploadLimits";
import { useCoupleSpace } from "@/features/couple-space/hooks/useCoupleSpace";
import { useAuth } from "@/hooks/useAuth";
import {
  insertMemory,
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

  const { user } = useAuth();
  const { data: coupleSpace } = useCoupleSpace();
  const queryClient = useQueryClient();

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

        if (item.mediaType === "video") {
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
          const dimensions = await getImageDimensions(item.file);
          width = dimensions.width;
          height = dimensions.height;
          mediaFile = await compressImageFile(item.file);
          thumbnailBlob = await generatePhotoThumbnail(item.file);
        }

        setStatus(item.id, "uploading", { progress: 40 });

        const extension = getFileExtension(item.file);
        const mediaPath = buildMemoryMediaPath(
          coupleSpace.id,
          memoryId,
          extension,
        );
        const thumbnailPath = buildMemoryThumbnailPath(
          coupleSpace.id,
          memoryId,
        );

        await uploadMemoryMedia(mediaPath, mediaFile);
        setStatus(item.id, "uploading", { progress: 70 });

        await uploadMemoryThumbnail(thumbnailPath, thumbnailBlob);
        setStatus(item.id, "uploading", { progress: 90 });

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
          title: item.title.trim() || null,
        });

        setStatus(item.id, "success", { progress: 100 });
        queryClient.invalidateQueries({ queryKey: queryKeys.memories.all });
        queryClient.invalidateQueries({
          queryKey: queryKeys.home.feed(coupleSpace.id),
        });
      } catch (error) {
        setStatus(item.id, "error", { errorMessage: getErrorMessage(error) });
      }
    },
    [coupleSpace, user, setStatus, queryClient],
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
