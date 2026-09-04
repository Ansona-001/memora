import { supabase } from "@/lib/supabase";
import type { Memory } from "@/types/media";

export async function getUnassignedMemories(
  coupleSpaceId: string,
): Promise<Memory[]> {
  const { data, error } = await supabase
    .from("memories")
    .select("*")
    .eq("couple_space_id", coupleSpaceId)
    .is("album_id", null)
    .order("captured_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}
