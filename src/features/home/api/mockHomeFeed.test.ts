import { describe, expect, it } from "vitest";

import { getMockHomeFeed } from "./mockHomeFeed";

describe("getMockHomeFeed", () => {
  it("returns a populated feed for a normal couple space id", async () => {
    const feed = await getMockHomeFeed("space-123");

    expect(feed.featured).not.toBeNull();
    expect(feed.recentMemories.length).toBeGreaterThan(0);
    expect(feed.tripAlbums.length).toBeGreaterThan(0);
  });

  it("returns an empty feed for a couple space id ending in 0", async () => {
    const feed = await getMockHomeFeed("space-000000000");

    expect(feed.featured).toBeNull();
    expect(feed.recentMemories).toHaveLength(0);
    expect(feed.tripAlbums).toHaveLength(0);
  });
});
