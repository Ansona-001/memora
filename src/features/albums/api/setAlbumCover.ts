import { supabase } from "@/lib/supabase";
import type { Album } from "@/types/album";

export async function setAlbumCover(
  albumId: string,
  coverPath: string,
): Promise<Album> {
  const { data, error } = await supabase
    .from("albums")
    .update({ cover_path: coverPath })
    .eq("id", albumId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
