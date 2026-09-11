import { supabase } from "@/lib/supabase";

export async function getTimelineYears(
  coupleSpaceId: string,
): Promise<number[]> {
  const { data, error } = await supabase.rpc("get_couple_space_years", {
    p_couple_space_id: coupleSpaceId,
  });

  if (error) {
    throw error;
  }

  return data.map((row) => row.year);
}
