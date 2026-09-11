import { useInfiniteQuery } from "@tanstack/react-query";

import { queryKeys } from "@/config/queryKeys";

import {
  getTimelineMemories,
  type TimelineMediaFilter,
} from "../api/getTimelineMemories";

export function useTimelineMemories(
  coupleSpaceId: string | undefined,
  filter: TimelineMediaFilter,
) {
  return useInfiniteQuery({
    queryKey: queryKeys.memories.timeline(coupleSpaceId ?? "", filter),
    queryFn: ({ pageParam }) =>
      getTimelineMemories(coupleSpaceId!, filter, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    enabled: Boolean(coupleSpaceId),
  });
}
