import { describe, expect, it, vi } from "vitest";

import { renderWithProviders, screen, waitFor } from "@/test/testUtils";

import { HomePage } from "./HomePage";

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: { id: "user-1" } }),
}));

vi.mock("@/features/profile/hooks/useProfile", () => ({
  useProfile: () => ({
    data: { id: "user-1", display_name: "Alex A" },
  }),
}));

vi.mock("@/features/couple-space/hooks/useCoupleSpace", () => ({
  useCoupleSpace: () => ({
    data: {
      id: "space-123",
      name: "Alex & Sam",
      coverPath: null,
      members: [
        {
          userId: "user-1",
          joinedAt: "2026-01-01T00:00:00.000Z",
          profile: { id: "user-1", display_name: "Alex A" },
        },
        {
          userId: "user-2",
          joinedAt: "2026-01-01T00:00:00.000Z",
          profile: { id: "user-2", display_name: "Sam B" },
        },
      ],
    },
  }),
}));

describe("HomePage", () => {
  it("greets the current user and shows partner details", async () => {
    renderWithProviders(<HomePage />);

    expect(screen.getByText("Welcome back, Alex A")).toBeInTheDocument();
    expect(screen.getByText(/Shared with Sam B/)).toBeInTheDocument();
  });

  it("eventually renders the populated feed rows", async () => {
    renderWithProviders(<HomePage />);

    await waitFor(
      () => {
        expect(
          screen.getByRole("heading", { name: "Recently Added" }),
        ).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    expect(
      screen.getByRole("heading", { name: "Trips Together" }),
    ).toBeInTheDocument();
  });
});
