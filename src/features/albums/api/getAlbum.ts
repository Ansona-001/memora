import { supabase } from "@/lib/supabase";
import type { Album } from "@/types/album";

export async function getAlbum(albumId: string): Promise<Album> {
  const { data, error } = await supabase
    .from("albums")
    .select("*")
    .eq("id", albumId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}
