import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/config/queryKeys";

import { createAlbum, type CreateAlbumInput } from "../api/createAlbum";

export function useCreateAlbum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAlbumInput) => createAlbum(input),
    onSuccess: (album) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.albums.list(album.couple_space_id),
      });
    },
  });
}
