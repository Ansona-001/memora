import { supabase } from "@/lib/supabase";
import type { AlbumComment } from "@/types/albumComment";

export async function postAlbumComment(
  albumId: string,
  authorName: string,
  body: string,
): Promise<AlbumComment> {
  const { data, error } = await supabase
    .from("album_comments")
    .insert({ album_id: albumId, author_name: authorName, body })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
