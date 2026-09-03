import { ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import { theme } from "@/theme/theme";

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

interface TestProvidersProps {
  children: ReactNode;
  initialRoute?: string;
}

function TestProviders({ children, initialRoute = "/" }: TestProvidersProps) {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={createTestQueryClient()}>
        <MemoryRouter initialEntries={[initialRoute]}>{children}</MemoryRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export function renderWithProviders(
  ui: ReactElement,
  options?: RenderOptions & { initialRoute?: string },
) {
  const { initialRoute, ...renderOptions } = options ?? {};

  return render(ui, {
    wrapper: ({ children }) => (
      <TestProviders initialRoute={initialRoute}>{children}</TestProviders>
    ),
    ...renderOptions,
  });
}

export * from "@testing-library/react";
