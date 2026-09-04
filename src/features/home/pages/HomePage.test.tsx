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

const { memory, album } = vi.hoisted(() => ({
  memory: {
    id: "memory-1",
    couple_space_id: "space-123",
    created_by: "user-1",
    media_type: "photo",
    storage_path: "space-123/2026/01/memory-1.jpg",
    thumbnail_path: "space-123/memory-1.webp",
    file_size_bytes: 1000,
    width: 800,
    height: 600,
    duration_seconds: null,
    title: null,
    is_favorite: false,
    captured_at: "2026-01-01T00:00:00.000Z",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
    album_id: null,
  },
  album: {
    id: "album-1",
    couple_space_id: "space-123",
    created_by: "user-1",
    title: "Our Trip",
    description: null,
    cover_path: null,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
    memoryCount: 3,
  },
}));

vi.mock("@/features/home/api/getHomeFeed", () => ({
  getHomeFeed: vi.fn().mockResolvedValue({
    featured: memory,
    recentMemories: [memory],
    favoriteMemories: [],
    albums: [album],
    videoMemories: [],
    historicalMemories: [],
  }),
}));

describe("HomePage", () => {
  it("greets the current user and shows partner details", async () => {
    renderWithProviders(<HomePage />);

    expect(screen.getByText("Welcome back, Alex A")).toBeInTheDocument();
    expect(screen.getByText(/Shared with Sam B/)).toBeInTheDocument();
  });

  it("eventually renders the populated feed rows from real data", async () => {
    renderWithProviders(<HomePage />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Recently Added" }),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole("heading", { name: "Your Albums" }),
    ).toBeInTheDocument();
  });
});
