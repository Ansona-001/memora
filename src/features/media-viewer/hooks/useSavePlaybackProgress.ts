import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/config/queryKeys";

import {
  savePlaybackProgress,
  type SavePlaybackProgressInput,
} from "../api/savePlaybackProgress";

export function useSavePlaybackProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SavePlaybackProgressInput) =>
      savePlaybackProgress(input),
    onSuccess: (_data, input) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.playbackProgress.memory(
          input.memoryId,
          input.userId,
        ),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.home.feed(input.coupleSpaceId),
      });
    },
  });
}
