import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/config/queryKeys";

import { getUnassignedMemories } from "../api/getUnassignedMemories";

export function useUnassignedMemories(coupleSpaceId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.memories.unassigned(coupleSpaceId ?? ""),
    queryFn: () => getUnassignedMemories(coupleSpaceId!),
    enabled: Boolean(coupleSpaceId),
  });
}
