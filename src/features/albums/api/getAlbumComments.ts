import { supabase } from "@/lib/supabase";
import type { AlbumComment } from "@/types/albumComment";

export async function getAlbumComments(albumId: string): Promise<AlbumComment[]> {
  const { data, error } = await supabase
    .from("album_comments")
    .select("*")
    .eq("album_id", albumId)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}
