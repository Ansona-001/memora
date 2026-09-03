import { useMutation } from "@tanstack/react-query";

import { requestPasswordReset } from "@/services/authService";

export function useForgotPassword() {
  return useMutation({
    mutationFn: requestPasswordReset,
  });
}
