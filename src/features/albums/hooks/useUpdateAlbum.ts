import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/config/queryKeys";
import type { AlbumUpdate } from "@/types/album";

import { updateAlbum } from "../api/updateAlbum";

export function useUpdateAlbum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      albumId,
      updates,
    }: {
      albumId: string;
      updates: AlbumUpdate;
    }) => updateAlbum(albumId, updates),
    onSuccess: (album) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.albums.details(album.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.albums.list(album.couple_space_id),
      });
    },
  });
}
