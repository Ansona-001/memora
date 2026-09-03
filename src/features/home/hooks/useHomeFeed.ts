import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/config/queryKeys";

import { getMockHomeFeed } from "../api/mockHomeFeed";

export function useHomeFeed(coupleSpaceId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.home.feed(coupleSpaceId ?? ""),
    queryFn: () => getMockHomeFeed(coupleSpaceId!),
    enabled: Boolean(coupleSpaceId),
  });
}
