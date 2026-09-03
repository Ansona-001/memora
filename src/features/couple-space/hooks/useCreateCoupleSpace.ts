import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/config/queryKeys";
import { createCoupleSpace } from "@/services/coupleSpaceService";

export function useCreateCoupleSpace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createCoupleSpace(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.coupleSpace.all });
    },
  });
}
