import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/config/queryKeys";

import { setAlbumCover } from "../api/setAlbumCover";

export function useSetAlbumCover(albumId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (coverPath: string) => setAlbumCover(albumId, coverPath),
    onSuccess: (album) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.albums.details(albumId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.albums.list(album.couple_space_id),
      });
    },
  });
}
