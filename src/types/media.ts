import type { Tables, TablesInsert } from "@/types/database";

export type Memory = Tables<"memories">;
export type MemoryInsert = TablesInsert<"memories">;

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
}
