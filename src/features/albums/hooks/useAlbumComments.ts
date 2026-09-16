import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/config/queryKeys";

import { getAlbumComments } from "../api/getAlbumComments";

export function useAlbumComments(albumId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.albums.comments(albumId ?? ""),
    queryFn: () => getAlbumComments(albumId!),
    enabled: Boolean(albumId),
  });
}
