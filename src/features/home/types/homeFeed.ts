export interface HomeMediaItem {
  id: string;
  title: string;
  mediaType: "photo" | "video";
  takenAt: string;
  isFavorite: boolean;
  accentIndex: number;
}

export interface HomeAlbum {
  id: string;
  title: string;
  memoryCount: number;
  accentIndex: number;
}

export interface HomeFeaturedMemory {
  id: string;
  title: string;
  caption: string;
  takenAt: string;
  accentIndex: number;
}

export interface HomeFeed {
  featured: HomeFeaturedMemory | null;
  continueWatching: HomeMediaItem[];
  recentMemories: HomeMediaItem[];
  favoriteMemories: HomeMediaItem[];
  tripAlbums: HomeAlbum[];
  dateNightAlbums: HomeAlbum[];
  videoMemories: HomeMediaItem[];
  historicalMemories: HomeMediaItem[];
}
