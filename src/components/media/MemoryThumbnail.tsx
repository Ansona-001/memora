import { useSignedUrl } from "@/hooks/useSignedUrl";
import type { Memory } from "@/types/media";
import { accentIndexFromId } from "@/utils/accentUtils";

import { MediaThumbnail } from "./MediaThumbnail";

interface MemoryThumbnailProps {
  memory: Pick<Memory, "id" | "thumbnail_path" | "media_type" | "storage_path">;
  aspectRatio?: string;
  /**
   * Use the full-resolution photo instead of the small (480px) thumbnail.
   * The thumbnail is generated for compact grid cards; large displays like
   * the home page's featured hero need the real image or it looks
   * pixelated when stretched. Videos always use the thumbnail since the
   * full file isn't a still image.
   */
  highRes?: boolean;
}

export function MemoryThumbnail({
  memory,
  aspectRatio,
  highRes = false,
}: MemoryThumbnailProps) {
  const useFullImage = highRes && memory.media_type === "photo";
  const { data: signedUrl } = useSignedUrl(
    useFullImage ? "memory-media" : "memory-thumbnails",
    useFullImage ? memory.storage_path : memory.thumbnail_path,
  );

  return (
    <MediaThumbnail
      accentIndex={accentIndexFromId(memory.id)}
      mediaType={memory.media_type as "photo" | "video"}
      imageUrl={signedUrl}
      aspectRatio={aspectRatio}
    />
  );
}
