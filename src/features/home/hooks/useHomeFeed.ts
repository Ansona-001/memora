import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/config/queryKeys";

import { getHomeFeed } from "../api/getHomeFeed";

export function useHomeFeed(coupleSpaceId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.home.feed(coupleSpaceId ?? ""),
    queryFn: () => getHomeFeed(coupleSpaceId!),
    enabled: Boolean(coupleSpaceId),
  });
}
