import { useMutation } from "@tanstack/react-query";

import { signIn } from "@/services/authService";

export function useLogin() {
  return useMutation({
    mutationFn: signIn,
  });
}
