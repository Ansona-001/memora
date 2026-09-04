import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/config/queryKeys";

import { getAlbum } from "../api/getAlbum";

export function useAlbum(albumId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.albums.details(albumId ?? ""),
    queryFn: () => getAlbum(albumId!),
    enabled: Boolean(albumId),
  });
}
