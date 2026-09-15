import type { Tables, TablesInsert, TablesUpdate } from "@/types/database";

export type Memory = Tables<"memories">;
export type MemoryInsert = TablesInsert<"memories">;
export type MemoryUpdate = TablesUpdate<"memories">;

export type PlaybackProgress = Tables<"playback_progress">;

export type UploadStatus =
  "queued" | "processing" | "uploading" | "success" | "error";

export interface UploadQueueItem {
  id: string;
  file: File;
  mediaType: "photo" | "video";
  previewUrl: string;
  title: string;
  status: UploadStatus;
  progress: number;
  errorMessage: string | null;
  aiTags?: string[];
  aiEmbedding?: number[];
  aiStatus?: AiEnrichmentStatus;
  aiErrorMessage?: string | null;
}

export type AiEnrichmentStatus =
  "idle" | "pending" | "processing" | "success" | "skipped" | "error";
