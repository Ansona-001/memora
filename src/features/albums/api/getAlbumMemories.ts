import { supabase } from "@/lib/supabase";
import type { Memory } from "@/types/media";

export async function getAlbumMemories(albumId: string): Promise<Memory[]> {
  const { data, error } = await supabase
    .from("memories")
    .select("*")
    .eq("album_id", albumId)
    .order("captured_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}
