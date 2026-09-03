import { ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

import { useAuthStore } from "@/stores/authStore";
import { theme } from "@/theme/theme";

import { routes } from "./routes";

function renderRouterAt(initialPath: string) {
  const router = createMemoryRouter(routes, {
    initialEntries: [initialPath],
  });
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  render(
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>,
  );

  return router;
}

describe("router redirects", () => {
  afterEach(() => {
    useAuthStore.setState({ session: null, status: "loading" });
  });

  it("redirects an unauthenticated user away from a protected route to /login", async () => {
    useAuthStore.setState({ session: null, status: "unauthenticated" });

    const router = renderRouterAt("/app/home");

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/login");
    });
  });

  it("redirects an authenticated user away from /login to the home route", async () => {
    useAuthStore.setState({
      // A minimal session shape is sufficient for the guard's checks.
      session: { user: { id: "user-1" } } as never,
      status: "authenticated",
    });

    const router = renderRouterAt("/login");

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/app/home");
    });
  });
});
