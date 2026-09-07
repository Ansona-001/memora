import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/config/queryKeys";

import { getMemoryContext } from "../api/getMemoryContext";

/**
 * Ordered memory ids for previous/next navigation. Prefer the
 * `contextIds` passed via router state from whichever row/grid the viewer
 * was opened from; this hook only runs as a fallback for direct links.
 */
export function useMemoryContext(coupleSpaceId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.memories.context(coupleSpaceId ?? ""),
    queryFn: () => getMemoryContext(coupleSpaceId!),
    enabled: Boolean(coupleSpaceId),
  });
}
