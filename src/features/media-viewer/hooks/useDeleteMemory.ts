import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/config/queryKeys";
import type { Memory } from "@/types/media";

import { deleteMemory } from "../api/deleteMemory";

export function useDeleteMemory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memory: Memory) => deleteMemory(memory),
    onSuccess: (_data, memory) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.memories.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.home.feed(memory.couple_space_id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.albums.list(memory.couple_space_id),
      });
      if (memory.album_id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.albums.memories(memory.album_id),
        });
      }
    },
  });
}
