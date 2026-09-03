import { useAuthStore } from "@/stores/authStore";

export function useAuth() {
  const session = useAuthStore((state) => state.session);
  const status = useAuthStore((state) => state.status);

  return {
    session,
    status,
    user: session?.user ?? null,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
  };
}
