import type { Session } from "@supabase/supabase-js";
import { create } from "zustand";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthState {
  session: Session | null;
  status: AuthStatus;
  setSession: (session: Session | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  status: "loading",
  setSession: (session) =>
    set({ session, status: session ? "authenticated" : "unauthenticated" }),
}));
