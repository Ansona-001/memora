import { supabase } from "@/lib/supabase";
import type { PlaybackProgress } from "@/types/media";

export async function getPlaybackProgress(
  memoryId: string,
  userId: string,
): Promise<PlaybackProgress | null> {
  const { data, error } = await supabase
    .from("playback_progress")
    .select("*")
    .eq("memory_id", memoryId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}
