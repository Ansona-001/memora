import { useMutation } from "@tanstack/react-query";

import { signOutAllDevices } from "@/services/authService";

export function useLogoutAllDevices() {
  return useMutation({
    mutationFn: signOutAllDevices,
  });
}
