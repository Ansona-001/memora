import { supabase } from "@/lib/supabase";
import type { Album } from "@/types/album";

export interface CreateAlbumInput {
  coupleSpaceId: string;
  createdBy: string;
  title: string;
  description?: string;
}

export async function createAlbum({
  coupleSpaceId,
  createdBy,
  title,
  description,
}: CreateAlbumInput): Promise<Album> {
  const { data, error } = await supabase
    .from("albums")
    .insert({
      couple_space_id: coupleSpaceId,
      created_by: createdBy,
      title,
      description: description || null,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
