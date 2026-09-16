import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/config/queryKeys";

import { getPublicAlbum } from "../api/getPublicAlbum";

export function usePublicAlbum(
  coupleSlug: string | undefined,
  albumSlug: string | undefined,
) {
  return useQuery({
    queryKey: queryKeys.publicShare.album(coupleSlug ?? "", albumSlug ?? ""),
    queryFn: () => getPublicAlbum(coupleSlug!, albumSlug!),
    enabled: Boolean(coupleSlug) && Boolean(albumSlug),
  });
}
