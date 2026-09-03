import { useMutation } from "@tanstack/react-query";

import { signOut } from "@/services/authService";

export function useLogout() {
  return useMutation({
    mutationFn: signOut,
  });
}
