import { supabase } from "@/lib/supabase";

export async function deleteAlbumComment(commentId: string): Promise<void> {
  const { error } = await supabase
    .from("album_comments")
    .delete()
    .eq("id", commentId);

  if (error) {
    throw error;
  }
}
