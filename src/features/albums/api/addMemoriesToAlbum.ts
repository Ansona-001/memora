import { supabase } from "@/lib/supabase";

export async function addMemoriesToAlbum(
  albumId: string,
  memoryIds: string[],
): Promise<void> {
  const { error } = await supabase
    .from("memories")
    .update({ album_id: albumId })
    .in("id", memoryIds);

  if (error) {
    throw error;
  }
}
