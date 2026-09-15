import { describe, expect, it } from "vitest";

import type { Memory } from "@/types/media";

import { groupMemoriesByDate } from "./groupMemoriesByDate";

function makeMemory(id: string, capturedAt: string): Memory {
  return {
    id,
    couple_space_id: "space-1",
    created_by: "user-1",
    media_type: "photo",
    storage_path: `space-1/${id}.jpg`,
    thumbnail_path: `space-1/${id}.webp`,
    file_size_bytes: 1000,
    width: 800,
    height: 600,
    duration_seconds: null,
    title: null,
    ai_caption: null,
    ai_embedding: null,
    ai_model_version: null,
    ai_tags: [],
    is_favorite: false,
    captured_at: capturedAt,
    created_at: capturedAt,
    updated_at: capturedAt,
    album_id: null,
  };
}

describe("groupMemoriesByDate", () => {
  it("groups memories into years ordered newest first", () => {
    const memories = [
      makeMemory("a", "2026-03-01T00:00:00Z"),
      makeMemory("b", "2024-06-15T00:00:00Z"),
      makeMemory("c", "2025-01-10T00:00:00Z"),
    ];

    const groups = groupMemoriesByDate(memories);

    expect(groups.map((g) => g.year)).toEqual([2026, 2025, 2024]);
  });

  it("groups memories within a year into month buckets", () => {
    const memories = [
      makeMemory("a", "2026-03-01T00:00:00Z"),
      makeMemory("b", "2026-03-15T00:00:00Z"),
      makeMemory("c", "2026-01-10T00:00:00Z"),
    ];

    const groups = groupMemoriesByDate(memories);

    expect(groups).toHaveLength(1);
    expect(groups[0]?.months).toHaveLength(2);
    expect(groups[0]?.months[0]?.memories).toHaveLength(2);
    expect(groups[0]?.months[1]?.memories).toHaveLength(1);
  });

  it("returns an empty array for no memories", () => {
    expect(groupMemoriesByDate([])).toEqual([]);
  });
});
