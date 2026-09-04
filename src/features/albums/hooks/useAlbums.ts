import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/config/queryKeys";

import { getAlbums } from "../api/getAlbums";

export function useAlbums(coupleSpaceId?: string) {
  return useQuery({
    queryKey: queryKeys.albums.list(coupleSpaceId ?? ""),
    queryFn: () => getAlbums(coupleSpaceId!),
    enabled: Boolean(coupleSpaceId),
  });
}
