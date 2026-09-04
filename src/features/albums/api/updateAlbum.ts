import { supabase } from "@/lib/supabase";
import type { Album, AlbumUpdate } from "@/types/album";

export async function updateAlbum(
  albumId: string,
  updates: AlbumUpdate,
): Promise<Album> {
  const { data, error } = await supabase
    .from("albums")
    .update(updates)
    .eq("id", albumId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
