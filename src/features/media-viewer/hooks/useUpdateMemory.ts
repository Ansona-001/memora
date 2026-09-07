import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/config/queryKeys";
import type { MemoryUpdate } from "@/types/media";

import { updateMemory } from "../api/updateMemory";

export function useUpdateMemory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      memoryId,
      updates,
    }: {
      memoryId: string;
      updates: MemoryUpdate;
    }) => updateMemory(memoryId, updates),
    onSuccess: (memory) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.memories.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.home.feed(memory.couple_space_id),
      });
      if (memory.album_id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.albums.memories(memory.album_id),
        });
      }
    },
  });
}
