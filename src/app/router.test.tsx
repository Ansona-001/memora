import { ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import * as coupleSpaceService from "@/services/coupleSpaceService";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

import { useAuthStore } from "@/stores/authStore";
import { theme } from "@/theme/theme";

import { routes } from "./routes";

vi.mock("@/services/coupleSpaceService", () => ({
  getCurrentCoupleSpace: vi.fn().mockResolvedValue({
    id: "space-1",
    name: "Our Space",
    coverPath: null,
    members: [
      {
        userId: "user-1",
        joinedAt: "2026-01-01T00:00:00.000Z",
        profile: {
          id: "user-1",
          display_name: "Jamie",
          avatar_path: null,
          created_at: "2026-01-01T00:00:00.000Z",
          updated_at: "2026-01-01T00:00:00.000Z",
        },
      },
      {
        userId: "user-2",
        joinedAt: "2026-01-01T00:00:00.000Z",
        profile: {
          id: "user-2",
          display_name: "Robin",
          avatar_path: null,
          created_at: "2026-01-01T00:00:00.000Z",
          updated_at: "2026-01-01T00:00:00.000Z",
        },
      },
    ],
  }),
}));

vi.mock("@/services/profileService", () => ({
  getCurrentProfile: vi.fn().mockResolvedValue({
    id: "user-1",
    display_name: "Jamie",
    avatar_path: null,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  }),
}));

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

  it("redirects an authenticated user with a couple space away from /login to home", async () => {
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

  it("sends an authenticated user without a couple space to /couple/setup", async () => {
    vi.mocked(coupleSpaceService.getCurrentCoupleSpace).mockResolvedValueOnce(
      null,
    );
    useAuthStore.setState({
      session: { user: { id: "user-1" } } as never,
      status: "authenticated",
    });

    const router = renderRouterAt("/app/home");

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/couple/setup");
    });
  });
});
