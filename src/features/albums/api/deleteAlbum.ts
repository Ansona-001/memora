import { supabase } from "@/lib/supabase";

export async function deleteAlbum(albumId: string): Promise<void> {
  const { error } = await supabase.from("albums").delete().eq("id", albumId);

  if (error) {
    throw error;
  }
}
