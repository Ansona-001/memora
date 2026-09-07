import { supabase } from "@/lib/supabase";
import type { Memory } from "@/types/media";

export async function deleteMemory(memory: Memory): Promise<void> {
  await supabase.storage.from("memory-media").remove([memory.storage_path]);
  await supabase.storage
    .from("memory-thumbnails")
    .remove([memory.thumbnail_path]);

  const { error } = await supabase
    .from("memories")
    .delete()
    .eq("id", memory.id);

  if (error) {
    throw error;
  }
}
