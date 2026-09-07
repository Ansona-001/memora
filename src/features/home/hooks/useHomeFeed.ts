import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/config/queryKeys";
import { useAuth } from "@/hooks/useAuth";

import { getHomeFeed } from "../api/getHomeFeed";

export function useHomeFeed(coupleSpaceId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.home.feed(coupleSpaceId ?? ""),
    queryFn: () => getHomeFeed(coupleSpaceId!, user!.id),
    enabled: Boolean(coupleSpaceId) && Boolean(user),
  });
}
