import { useMutation } from "@tanstack/react-query";

import { signUp } from "@/services/authService";

export function useRegister() {
  return useMutation({
    mutationFn: signUp,
  });
}
