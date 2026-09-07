import { supabase } from "@/lib/supabase";
import type { Memory, MemoryUpdate } from "@/types/media";

export async function updateMemory(
  memoryId: string,
  updates: MemoryUpdate,
): Promise<Memory> {
  const { data, error } = await supabase
    .from("memories")
    .update(updates)
    .eq("id", memoryId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
