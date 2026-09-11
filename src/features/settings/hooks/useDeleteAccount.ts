import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteOwnAccount } from "@/services/authService";

export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteOwnAccount,
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
