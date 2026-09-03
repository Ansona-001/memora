import { useMutation } from "@tanstack/react-query";

import { updatePassword } from "@/services/authService";

export function useResetPassword() {
  return useMutation({
    mutationFn: updatePassword,
  });
}
