import { supabase } from "@/lib/supabase";
import type { Memory, MemoryInsert } from "@/types/media";

interface PostgrestErrorLike {
  message?: string;
  code?: string;
}

function isMissingAiColumnError(error: PostgrestErrorLike): boolean {
  // PostgREST PGRST204: "Could not find the 'ai_caption' column of
  // 'memories' in the schema cache" — the migration hasn't been applied
  // (or PostgREST hasn't reloaded its cache) for this project.
  const message =
    typeof error.message === "string" ? error.message.toLowerCase() : "";
  return (
    error.code === "PGRST204" ||
    message.includes("ai_caption") ||
    message.includes("ai_tags") ||
    message.includes("ai_embedding") ||
    message.includes("ai_model_version")
  );
}

export async function uploadMemoryMedia(
  path: string,
  file: File,
): Promise<void> {
  const { error } = await supabase.storage
    .from("memory-media")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) {
    throw error;
  }
}

export async function uploadMemoryThumbnail(
  path: string,
  thumbnail: Blob,
): Promise<void> {
  const { error } = await supabase.storage
    .from("memory-thumbnails")
    .upload(path, thumbnail, { contentType: "image/webp", upsert: false });

  if (error) {
    throw error;
  }
}

export async function insertMemory(memory: MemoryInsert): Promise<Memory> {
  const { data, error } = await supabase
    .from("memories")
    .insert(memory)
    .select()
    .single();

  if (!error) {
    return data;
  }

  // The ai_* migration may not be applied to this Supabase project yet
  // (PGRST204 schema-cache error). Never fail the whole upload for that —
  // retry without AI columns so the memory still saves.
  if (isMissingAiColumnError(error)) {
    const withoutAi: MemoryInsert = { ...memory };
    delete withoutAi.ai_caption;
    delete withoutAi.ai_tags;
    delete withoutAi.ai_embedding;
    delete withoutAi.ai_model_version;
    const { data: retryData, error: retryError } = await supabase
      .from("memories")
      .insert(withoutAi)
      .select()
      .single();

    if (retryError) {
      throw retryError;
    }

    return retryData as Memory;
  }

  throw error;
}

export async function updateMemoryAiFields(
  memoryId: string,
  fields: {
    ai_tags: string[];
    ai_embedding: number[] | null;
    ai_model_version: string | null;
  },
): Promise<void> {
  const { error } = await supabase
    .from("memories")
    .update(fields)
    .eq("id", memoryId);

  if (error) {
    // Missing-column environments (migration not applied, or PostgREST
    // schema cache not yet reloaded) must not surface as AI failures —
    // the photo itself already uploaded successfully.
    if (isMissingAiColumnError(error)) {
      return;
    }

    throw error;
  }
}
