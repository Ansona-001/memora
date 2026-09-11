import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/config/queryKeys";
import { leaveCoupleSpace } from "@/services/coupleSpaceService";

export function useLeaveCoupleSpace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leaveCoupleSpace,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: queryKeys.home.all });
      queryClient.removeQueries({ queryKey: queryKeys.albums.all });
      queryClient.removeQueries({ queryKey: queryKeys.memories.all });
      queryClient.removeQueries({ queryKey: queryKeys.playbackProgress.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.coupleSpace.all });
    },
  });
}
