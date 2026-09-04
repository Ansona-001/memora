import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/config/queryKeys";

import { addMemoriesToAlbum } from "../api/addMemoriesToAlbum";

export function useAddMemoriesToAlbum(
  albumId: string,
  coupleSpaceId: string | undefined,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memoryIds: string[]) => addMemoriesToAlbum(albumId, memoryIds),
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
