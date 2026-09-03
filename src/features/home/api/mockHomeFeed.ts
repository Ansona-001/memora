import type { HomeAlbum, HomeFeed, HomeMediaItem } from "../types/homeFeed";

function buildMediaItems(
  count: number,
  namePrefix: string,
  mediaType: HomeMediaItem["mediaType"] = "photo",
): HomeMediaItem[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `${namePrefix}-${index}`,
    title: `${namePrefix} ${index + 1}`,
    mediaType,
    takenAt: new Date(
      Date.now() - index * 1000 * 60 * 60 * 24 * 7,
    ).toISOString(),
    isFavorite: index % 3 === 0,
    accentIndex: index,
  }));
}

function buildAlbums(count: number, namePrefix: string): HomeAlbum[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `${namePrefix}-${index}`,
    title: `${namePrefix} ${index + 1}`,
    memoryCount: 8 + index * 3,
    accentIndex: index,
  }));
}

const mockFeed: HomeFeed = {
  featured: {
    id: "featured-1",
    title: "Our Weekend in the Mountains",
    caption: "42 photos and 3 videos · Last spring",
    takenAt: new Date().toISOString(),
    accentIndex: 0,
  },
  continueWatching: buildMediaItems(4, "Continue Watching", "video"),
  recentMemories: buildMediaItems(10, "Recently Added"),
  favoriteMemories: buildMediaItems(6, "Favorite"),
  tripAlbums: buildAlbums(5, "Trip"),
  dateNightAlbums: buildAlbums(4, "Date Night"),
  videoMemories: buildMediaItems(6, "Video", "video"),
  historicalMemories: buildMediaItems(5, "This Time Last Year"),
};

const emptyFeed: HomeFeed = {
  featured: null,
  continueWatching: [],
  recentMemories: [],
  favoriteMemories: [],
  tripAlbums: [],
  dateNightAlbums: [],
  videoMemories: [],
  historicalMemories: [],
};

export async function getMockHomeFeed(
  coupleSpaceId: string,
): Promise<HomeFeed> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  // A couple space id ending in "0" simulates a brand-new space with no
  // memories yet, exercising the empty state without needing real data.
  return coupleSpaceId.endsWith("0") ? emptyFeed : mockFeed;
}
