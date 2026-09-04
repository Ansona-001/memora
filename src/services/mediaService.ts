import { supabase } from "@/lib/supabase";
import type { Memory, MemoryInsert } from "@/types/media";

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

  if (error) {
    throw error;
  }

  return data;
}
