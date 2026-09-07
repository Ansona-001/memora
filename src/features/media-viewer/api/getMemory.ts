import { supabase } from "@/lib/supabase";
import type { Memory } from "@/types/media";

export async function getMemory(memoryId: string): Promise<Memory> {
  const { data, error } = await supabase
    .from("memories")
    .select("*")
    .eq("id", memoryId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}
