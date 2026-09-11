import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/config/queryKeys";
import {
  updateCoupleSpace,
  uploadCoupleCover,
} from "@/services/coupleSpaceService";
import { compressProfileImage } from "@/utils/mediaUtils";

export function useUploadCoupleCover(coupleSpaceId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const image = await compressProfileImage(file);
      const path = await uploadCoupleCover(coupleSpaceId!, image);
      return updateCoupleSpace(coupleSpaceId!, { cover_path: path });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.coupleSpace.all });
      queryClient.invalidateQueries({
        queryKey: ["signed-url", "couple-covers"],
      });
    },
  });
}
