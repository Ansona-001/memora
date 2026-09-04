import { supabase } from "@/lib/supabase";

export async function removeMemoryFromAlbum(memoryId: string): Promise<void> {
  const { error } = await supabase
    .from("memories")
    .update({ album_id: null })
    .eq("id", memoryId);

  if (error) {
    throw error;
  }
}
