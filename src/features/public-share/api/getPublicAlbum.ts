import { supabase } from "@/lib/supabase";
import type { Album } from "@/types/album";
import type { Memory } from "@/types/media";

export interface PublicAlbum {
  album: Album;
  coupleSpaceName: string;
  coupleSpaceSlug: string;
  memories: Memory[];
}

// No auth required — RLS only returns this album (and its memories) when
// is_public = true; toggling that off makes this start returning nothing.
// Looked up by (coupleSlug, albumSlug) rather than the album's raw id, so
// the public URL reads as /{couple-handle}/{album-title}.
export async function getPublicAlbum(
  coupleSlug: string,
  albumSlug: string,
): Promise<PublicAlbum | null> {
  const { data: coupleSpace, error: coupleSpaceError } = await supabase
    .from("couple_spaces")
    .select("id, name, public_slug")
    .eq("public_slug", coupleSlug)
    .maybeSingle();

  if (coupleSpaceError) {
    throw coupleSpaceError;
  }

  if (!coupleSpace) {
    return null;
  }

  const { data: album, error: albumError } = await supabase
    .from("albums")
    .select("*")
    .eq("couple_space_id", coupleSpace.id)
    .eq("slug", albumSlug)
    .maybeSingle();

  if (albumError) {
    throw albumError;
  }

  if (!album) {
    return null;
  }

  const { data: memories, error: memoriesError } = await supabase
    .from("memories")
    .select("*")
    .eq("album_id", album.id)
    .order("captured_at", { ascending: false });

  if (memoriesError) {
    throw memoriesError;
  }

  return {
    album,
    coupleSpaceName: coupleSpace.name,
    coupleSpaceSlug: coupleSpace.public_slug,
    memories: memories ?? [],
  };
}
