import { supabase } from "@/lib/supabase";
import type { Memory } from "@/types/media";

export type TimelineMediaFilter = "all" | "photo" | "video" | "favorite";

const PAGE_SIZE = 60;

export interface TimelinePage {
  memories: Memory[];
  nextOffset: number | null;
}

export async function getTimelineMemories(
  coupleSpaceId: string,
  filter: TimelineMediaFilter,
  offset: number,
): Promise<TimelinePage> {
  let query = supabase
    .from("memories")
    .select("*")
    .eq("couple_space_id", coupleSpaceId)
    .order("captured_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (filter === "photo" || filter === "video") {
    query = query.eq("media_type", filter);
  } else if (filter === "favorite") {
    query = query.eq("is_favorite", true);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return {
    memories: data,
    nextOffset: data.length === PAGE_SIZE ? offset + PAGE_SIZE : null,
  };
}
