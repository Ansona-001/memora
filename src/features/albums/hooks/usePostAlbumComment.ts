import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/config/queryKeys";

import { postAlbumComment } from "../api/postAlbumComment";

export function usePostAlbumComment(albumId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      authorName,
      body,
    }: {
      authorName: string;
      body: string;
    }) => postAlbumComment(albumId, authorName, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.albums.comments(albumId),
      });
    },
  });
}
