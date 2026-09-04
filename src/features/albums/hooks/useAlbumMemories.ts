import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/config/queryKeys";

import { getAlbumMemories } from "../api/getAlbumMemories";

export function useAlbumMemories(albumId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.albums.memories(albumId ?? ""),
    queryFn: () => getAlbumMemories(albumId!),
    enabled: Boolean(albumId),
  });
}
