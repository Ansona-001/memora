export const ROUTES = {
  splash: "/splash",
  onboarding: "/onboarding",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",

  coupleSetup: "/couple/setup",
  coupleCreate: "/couple/create",
  coupleJoin: "/couple/join",
  coupleInvite: "/couple/invite",

  home: "/app/home",
  albums: "/app/albums",
  newAlbum: "/app/albums/new",
  albumDetails: (albumId: string) => `/app/albums/${albumId}`,
  editAlbum: (albumId: string) => `/app/albums/${albumId}/edit`,
  timeline: "/app/timeline",
  favorites: "/app/favorites",
  search: "/app/search",
  upload: "/app/upload",
  memoryDetails: (memoryId: string) => `/app/memories/${memoryId}`,
  profile: "/app/profile",
  settings: "/app/settings",

  // Public, no-login routes for albums a couple has explicitly shared.
  publicCouple: (coupleSlug: string) => `/${coupleSlug}`,
  publicAlbum: (coupleSlug: string, albumSlug: string) =>
    `/${coupleSlug}/${albumSlug}`,
} as const;
