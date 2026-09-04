import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/config/queryKeys";

import { removeMemoryFromAlbum } from "../api/removeMemoryFromAlbum";

export function useRemoveMemoryFromAlbum(
  albumId: string,
  coupleSpaceId: string | undefined,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memoryId: string) => removeMemoryFromAlbum(memoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.albums.memories(albumId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.albums.list(coupleSpaceId ?? ""),
      });
      if (coupleSpaceId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.memories.unassigned(coupleSpaceId),
        });
      }
    },
  });
}
