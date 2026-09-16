import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/config/queryKeys";

import { deleteAlbumComment } from "../api/deleteAlbumComment";

export function useDeleteAlbumComment(albumId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => deleteAlbumComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.albums.comments(albumId),
      });
    },
  });
}
