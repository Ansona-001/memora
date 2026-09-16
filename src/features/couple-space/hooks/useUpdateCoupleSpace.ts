import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/config/queryKeys";
import { updateCoupleSpace } from "@/services/coupleSpaceService";

export function useUpdateCoupleSpace(coupleSpaceId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      updates: { name?: string; cover_path?: string | null; public_slug?: string },
    ) => updateCoupleSpace(coupleSpaceId!, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.coupleSpace.all });
    },
  });
}
