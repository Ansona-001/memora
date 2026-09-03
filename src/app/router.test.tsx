import { ThemeProvider } from "@mui/material/styles";
import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

import { useAuthStore } from "@/stores/authStore";
import { theme } from "@/theme/theme";

import { routes } from "./routes";

function renderRouterAt(initialPath: string) {
  const router = createMemoryRouter(routes, { initialEntries: [initialPath] });

  return render(
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>,
  );
}

describe("router redirects", () => {
  afterEach(() => {
    useAuthStore.setState({ session: null, status: "loading" });
  });

  it("redirects an unauthenticated user away from a protected route to /login", async () => {
    useAuthStore.setState({ session: null, status: "unauthenticated" });

    renderRouterAt("/app/home");

    await waitFor(() => {
      expect(screen.getByText("Log in")).toBeInTheDocument();
    });
  });

  it("redirects an authenticated user away from /login to the home route", async () => {
    useAuthStore.setState({
      // A minimal session shape is sufficient for the guard's checks.
      session: { user: { id: "user-1" } } as never,
      status: "authenticated",
    });

    renderRouterAt("/login");

    await waitFor(() => {
      expect(
        screen.getByText("Your memories will live here"),
      ).toBeInTheDocument();
    });
  });
});
