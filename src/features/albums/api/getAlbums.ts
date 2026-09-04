import { supabase } from "@/lib/supabase";
import type { Album } from "@/types/album";

export interface AlbumWithCount extends Album {
  memoryCount: number;
}

export async function getAlbums(
  coupleSpaceId: string,
): Promise<AlbumWithCount[]> {
  const { data, error } = await supabase
    .from("albums")
    .select("*, memories(count)")
    .eq("couple_space_id", coupleSpaceId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data.map(({ memories, ...album }) => ({
    ...album,
    memoryCount: memories[0]?.count ?? 0,
  }));
}
