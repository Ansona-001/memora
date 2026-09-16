import { supabase } from "@/lib/supabase";
import type { Album } from "@/types/album";

export interface PublicCoupleSpace {
  id: string;
  name: string;
  coverPath: string | null;
  publicSlug: string;
  albums: Album[];
}

// No auth required — relies entirely on RLS: couple_spaces are only
// selectable here once they have at least one public album, and albums are
// only selectable when is_public = true.
export async function getPublicCoupleSpace(
  slug: string,
): Promise<PublicCoupleSpace | null> {
  const { data: space, error: spaceError } = await supabase
    .from("couple_spaces")
    .select("*")
    .eq("public_slug", slug)
    .maybeSingle();

  if (spaceError) {
    throw spaceError;
  }

  if (!space) {
    return null;
  }

  const { data: albums, error: albumsError } = await supabase
    .from("albums")
    .select("*")
    .eq("couple_space_id", space.id)
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (albumsError) {
    throw albumsError;
  }

  return {
    id: space.id,
    name: space.name,
    coverPath: space.cover_path,
    publicSlug: space.public_slug,
    albums: albums ?? [],
  };
}
