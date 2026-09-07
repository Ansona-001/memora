import { supabase } from "@/lib/supabase";

const CONTEXT_LIMIT = 200;

/**
 * Fallback ordered list of memory ids for previous/next navigation, used
 * when the viewer is opened directly (e.g. a refreshed or shared link)
 * rather than from a row that already has an ordered list in hand.
 */
export async function getMemoryContext(
  coupleSpaceId: string,
): Promise<string[]> {
  const { data, error } = await supabase
    .from("memories")
    .select("id")
    .eq("couple_space_id", coupleSpaceId)
    .order("captured_at", { ascending: false })
    .limit(CONTEXT_LIMIT);

  if (error) {
    throw error;
  }

  return data.map((row) => row.id);
}
