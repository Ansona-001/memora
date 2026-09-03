import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { queryKeys } from "@/config/queryKeys";
import * as coupleSpaceService from "@/services/coupleSpaceService";
import type { CoupleSpaceWithMembers } from "@/services/coupleSpaceService";

import { CoupleSpaceRoute } from "./CoupleSpaceRoute";

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: { id: "user-1" } }),
}));

vi.mock("@/services/coupleSpaceService", () => ({
  getCurrentCoupleSpace: vi.fn(),
}));

function renderGuard(queryClient: QueryClient) {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/app/home"]}>
        <Routes>
          <Route element={<CoupleSpaceRoute />}>
            <Route path="/app/home" element={<div>Home content</div>} />
          </Route>
          <Route path="/couple/setup" element={<div>Setup page</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("CoupleSpaceRoute", () => {
  it("does not redirect on a stale cached null while a fresh fetch is in flight", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    // Seed the cache with a stale "no couple space" result, as would be
    // left over from before the user created or joined a space.
    queryClient.setQueryData(queryKeys.coupleSpace.current(), null);

    let resolveFetch!: (value: CoupleSpaceWithMembers | null) => void;
    vi.mocked(coupleSpaceService.getCurrentCoupleSpace).mockReturnValueOnce(
      new Promise((resolve) => {
        resolveFetch = resolve;
      }),
    );
    // Mark the cached entry stale so mounting triggers a refetch.
    queryClient.invalidateQueries({ queryKey: queryKeys.coupleSpace.all });

    renderGuard(queryClient);

    // While the fetch is in flight, it must not have redirected to setup.
    expect(screen.queryByText("Setup page")).not.toBeInTheDocument();

    resolveFetch({
      id: "space-1",
      name: "Our Space",
      coverPath: null,
      members: [],
    });

    await waitFor(() => {
      expect(screen.getByText("Home content")).toBeInTheDocument();
    });
  });

  it("redirects to /couple/setup once a fetch settles with no couple space", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    vi.mocked(coupleSpaceService.getCurrentCoupleSpace).mockResolvedValueOnce(
      null,
    );

    renderGuard(queryClient);

    await waitFor(() => {
      expect(screen.getByText("Setup page")).toBeInTheDocument();
    });
  });
});
