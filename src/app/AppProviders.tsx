import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, type ReactNode } from "react";

import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";
import { theme } from "@/theme/theme";

import { ErrorBoundary } from "./ErrorBoundary";
import { queryClient } from "./queryClient";
import { UpdatePrompt } from "./UpdatePrompt";

function AuthSessionListener() {
  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      },
    );

    return () => subscription.subscription.unsubscribe();
  }, [setSession]);

  return null;
}

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme} defaultMode="dark">
        <CssBaseline />
        <UpdatePrompt />
        <QueryClientProvider client={queryClient}>
          <AuthSessionListener />
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
