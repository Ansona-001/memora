import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/config/queryKeys";

import { searchMemories } from "../api/searchMemories";

export function useSearchMemories(
  coupleSpaceId: string | undefined,
  query: string,
  aiEnabled: boolean,
) {
  return useQuery({
    queryKey: queryKeys.memories.search(coupleSpaceId ?? "", query),
    queryFn: () => searchMemories(coupleSpaceId!, query, aiEnabled),
    enabled: Boolean(coupleSpaceId) && query.trim().length > 0,
  });
}
