import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/config/queryKeys";

import { getMemory } from "../api/getMemory";

export function useMemory(memoryId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.memories.details(memoryId ?? ""),
    queryFn: () => getMemory(memoryId!),
    enabled: Boolean(memoryId),
  });
}
