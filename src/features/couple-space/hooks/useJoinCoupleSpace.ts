import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/config/queryKeys";
import { joinCoupleSpace } from "@/services/coupleSpaceService";

export function useJoinCoupleSpace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => joinCoupleSpace(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.coupleSpace.all });
    },
  });
}
