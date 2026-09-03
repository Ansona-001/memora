import { useMutation } from "@tanstack/react-query";

import { createCoupleInvitation } from "@/services/coupleSpaceService";

export function useCreateInvitation() {
  return useMutation({
    mutationFn: (coupleSpaceId: string) =>
      createCoupleInvitation(coupleSpaceId),
  });
}
