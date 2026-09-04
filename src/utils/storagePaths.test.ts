import { describe, expect, it } from "vitest";

import { buildMemoryMediaPath, buildMemoryThumbnailPath } from "./storagePaths";

describe("buildMemoryMediaPath", () => {
  it("builds a path scoped by couple space, year and month", () => {
    const path = buildMemoryMediaPath(
      "space-1",
      "memory-1",
      "jpg",
      new Date("2026-03-15T00:00:00Z"),
    );

    expect(path).toBe("space-1/2026/03/memory-1.jpg");
  });
});

describe("buildMemoryThumbnailPath", () => {
  it("builds a path scoped by couple space", () => {
    expect(buildMemoryThumbnailPath("space-1", "memory-1")).toBe(
      "space-1/memory-1.webp",
    );
  });
});
