export const queryKeys = {
  profile: {
    all: ["profile"] as const,
    current: () => [...queryKeys.profile.all, "current"] as const,
  },

  coupleSpace: {
    all: ["couple-space"] as const,
    current: () => [...queryKeys.coupleSpace.all, "current"] as const,
  },

  albums: {
    all: ["albums"] as const,
    list: (coupleSpaceId: string) =>
      [...queryKeys.albums.all, "list", coupleSpaceId] as const,
    details: (albumId: string) =>
      [...queryKeys.albums.all, "details", albumId] as const,
    memories: (albumId: string) =>
      [...queryKeys.albums.all, "memories", albumId] as const,
  },

  memories: {
    all: ["memories"] as const,
    recent: (coupleSpaceId: string) =>
      [...queryKeys.memories.all, "recent", coupleSpaceId] as const,
    favorite: (coupleSpaceId: string) =>
      [...queryKeys.memories.all, "favorite", coupleSpaceId] as const,
    details: (memoryId: string) =>
      [...queryKeys.memories.all, "details", memoryId] as const,
    unassigned: (coupleSpaceId: string) =>
      [...queryKeys.memories.all, "unassigned", coupleSpaceId] as const,
    context: (coupleSpaceId: string) =>
      [...queryKeys.memories.all, "context", coupleSpaceId] as const,
  },

  playbackProgress: {
    all: ["playback-progress"] as const,
    memory: (memoryId: string, userId: string) =>
      [...queryKeys.playbackProgress.all, memoryId, userId] as const,
  },

  home: {
    all: ["home"] as const,
    feed: (coupleSpaceId: string) =>
      [...queryKeys.home.all, "feed", coupleSpaceId] as const,
  },
} as const;
