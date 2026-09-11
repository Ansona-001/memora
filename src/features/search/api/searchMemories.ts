import { supabase } from "@/lib/supabase";
import type { Memory } from "@/types/media";

const RESULT_LIMIT = 60;

export async function searchMemories(
  coupleSpaceId: string,
  query: string,
): Promise<Memory[]> {
  const { data, error } = await supabase
    .from("memories")
    .select("*")
    .eq("couple_space_id", coupleSpaceId)
    .ilike("title", `%${query}%`)
    .order("captured_at", { ascending: false })
    .limit(RESULT_LIMIT);

  if (error) {
    throw error;
  }

  return data;
}
