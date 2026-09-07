import { supabase } from "@/lib/supabase";

export interface SavePlaybackProgressInput {
  coupleSpaceId: string;
  memoryId: string;
  userId: string;
  positionSeconds: number;
  durationSeconds: number;
}

export async function savePlaybackProgress({
  coupleSpaceId,
  memoryId,
  userId,
  positionSeconds,
  durationSeconds,
}: SavePlaybackProgressInput): Promise<void> {
  const { error } = await supabase.from("playback_progress").upsert(
    {
      couple_space_id: coupleSpaceId,
      memory_id: memoryId,
      user_id: userId,
      position_seconds: positionSeconds,
      duration_seconds: durationSeconds,
    },
    { onConflict: "memory_id,user_id" },
  );

  if (error) {
    throw error;
  }
}
