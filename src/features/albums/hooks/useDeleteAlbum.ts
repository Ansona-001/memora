import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/config/queryKeys";

import { deleteAlbum } from "../api/deleteAlbum";

export function useDeleteAlbum(coupleSpaceId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (albumId: string) => deleteAlbum(albumId),
    onSuccess: () => {
      if (coupleSpaceId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.albums.list(coupleSpaceId),
        });
      }
    },
  });
}
