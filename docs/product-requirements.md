# Memora React Application Structure

## 1. Technology Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- TanStack Query
- Zustand
- React Hook Form
- Zod
- Material UI
- Supabase JavaScript SDK
- Axios, only when external APIs are added
- Day.js
- React Player or native HTML video
- Swiper for media carousels
- Framer Motion
- vite-plugin-pwa
- Vitest
- React Testing Library
- Playwright

### Backend and Infrastructure

Use Supabase for the initial version:

- Supabase Authentication
- PostgreSQL
- Supabase Storage
- Supabase Realtime
- Row Level Security
- Supabase Edge Functions only when required

A separate Node.js or Python backend is not required for the MVP.

---

# 2. Project Creation

```bash
pnpm create vite memora --template react-ts

cd memora

pnpm install
```

Install the main packages:

```bash
pnpm add \
  @supabase/supabase-js \
  @tanstack/react-query \
  @tanstack/react-query-devtools \
  react-router-dom \
  zustand \
  react-hook-form \
  @hookform/resolvers \
  zod \
  @mui/material \
  @mui/icons-material \
  @emotion/react \
  @emotion/styled \
  framer-motion \
  dayjs \
  swiper \
  react-player
```

Install development packages:

```bash
pnpm add -D \
  vitest \
  jsdom \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  vite-plugin-pwa \
  eslint \
  prettier \
  playwright \
  @playwright/test
```

---

# 3. Repository Structure

```text
memora/
├── public/
│   ├── favicon.ico
│   ├── manifest-icons/
│   ├── placeholders/
│   │   ├── album-placeholder.webp
│   │   ├── avatar-placeholder.webp
│   │   └── memory-placeholder.webp
│   └── robots.txt
│
├── src/
│   ├── main.tsx
│   ├── vite-env.d.ts
│   │
│   ├── app/
│   │   ├── App.tsx
│   │   ├── AppProviders.tsx
│   │   ├── router.tsx
│   │   ├── routes.ts
│   │   ├── queryClient.ts
│   │   └── ErrorBoundary.tsx
│   │
│   ├── assets/
│   │   ├── icons/
│   │   ├── images/
│   │   └── logos/
│   │
│   ├── components/
│   │   ├── buttons/
│   │   │   ├── PrimaryButton.tsx
│   │   │   ├── SecondaryButton.tsx
│   │   │   └── IconActionButton.tsx
│   │   │
│   │   ├── cards/
│   │   │   ├── AlbumCard.tsx
│   │   │   ├── FeaturedMemoryCard.tsx
│   │   │   ├── MediaCard.tsx
│   │   │   └── MemoryPosterCard.tsx
│   │   │
│   │   ├── feedback/
│   │   │   ├── AppAlert.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorState.tsx
│   │   │   ├── LoadingScreen.tsx
│   │   │   └── UploadProgress.tsx
│   │   │
│   │   ├── forms/
│   │   │   ├── FormTextField.tsx
│   │   │   ├── PasswordField.tsx
│   │   │   └── SearchField.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── AppHeader.tsx
│   │   │   ├── AppLayout.tsx
│   │   │   ├── AuthLayout.tsx
│   │   │   ├── BottomNavigation.tsx
│   │   │   ├── DesktopSidebar.tsx
│   │   │   ├── PageContainer.tsx
│   │   │   └── SectionHeader.tsx
│   │   │
│   │   └── media/
│   │       ├── ImageViewer.tsx
│   │       ├── MediaGrid.tsx
│   │       ├── MediaThumbnail.tsx
│   │       ├── VideoPlayer.tsx
│   │       └── HorizontalMediaRow.tsx
│   │
│   ├── config/
│   │   ├── environment.ts
│   │   ├── navigation.ts
│   │   ├── queryKeys.ts
│   │   ├── storage.ts
│   │   └── uploadLimits.ts
│   │
│   ├── constants/
│   │   ├── appConstants.ts
│   │   ├── errorMessages.ts
│   │   ├── mediaTypes.ts
│   │   └── routes.ts
│   │
│   ├── features/
│   │   ├── authentication/
│   │   ├── onboarding/
│   │   ├── couple-space/
│   │   ├── home/
│   │   ├── albums/
│   │   ├── memories/
│   │   ├── uploads/
│   │   ├── media-viewer/
│   │   ├── timeline/
│   │   ├── favorites/
│   │   ├── search/
│   │   ├── notifications/
│   │   ├── profile/
│   │   └── settings/
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useDebounce.ts
│   │   ├── useIntersectionObserver.ts
│   │   ├── useMediaQuery.ts
│   │   ├── useOnlineStatus.ts
│   │   └── useSignedUrl.ts
│   │
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── logger.ts
│   │   └── storageClient.ts
│   │
│   ├── services/
│   │   ├── authService.ts
│   │   ├── albumService.ts
│   │   ├── coupleSpaceService.ts
│   │   ├── mediaService.ts
│   │   ├── notificationService.ts
│   │   ├── profileService.ts
│   │   └── uploadService.ts
│   │
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── playerStore.ts
│   │   ├── uiStore.ts
│   │   └── uploadStore.ts
│   │
│   ├── theme/
│   │   ├── colors.ts
│   │   ├── components.ts
│   │   ├── shadows.ts
│   │   ├── spacing.ts
│   │   ├── theme.ts
│   │   └── typography.ts
│   │
│   ├── types/
│   │   ├── album.ts
│   │   ├── auth.ts
│   │   ├── coupleSpace.ts
│   │   ├── database.ts
│   │   ├── media.ts
│   │   ├── notification.ts
│   │   └── profile.ts
│   │
│   ├── utils/
│   │   ├── dateUtils.ts
│   │   ├── errorUtils.ts
│   │   ├── fileUtils.ts
│   │   ├── mediaUtils.ts
│   │   ├── validation.ts
│   │   └── storagePaths.ts
│   │
│   └── test/
│       ├── fixtures/
│       ├── mocks/
│       ├── setup.ts
│       └── testUtils.tsx
│
├── e2e/
│   ├── auth.spec.ts
│   ├── couple-space.spec.ts
│   ├── album.spec.ts
│   └── upload.spec.ts
│
├── supabase/
│   ├── config.toml
│   ├── migrations/
│   ├── functions/
│   ├── policies/
│   ├── seed.sql
│   └── tests/
│
├── docs/
│   ├── architecture.md
│   ├── database-schema.md
│   ├── design-system.md
│   ├── product-requirements.md
│   ├── security.md
│   └── setup.md
│
├── .env.example
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── playwright.config.ts
├── prettier.config.js
├── tsconfig.json
├── tsconfig.app.json
├── vite.config.ts
└── README.md
```

---

# 4. Feature Folder Structure

Each feature should own its components, hooks, queries, schemas, and pages.

Example:

```text
src/features/albums/
├── api/
│   ├── createAlbum.ts
│   ├── deleteAlbum.ts
│   ├── getAlbum.ts
│   ├── getAlbums.ts
│   └── updateAlbum.ts
│
├── components/
│   ├── AlbumForm.tsx
│   ├── AlbumHeader.tsx
│   ├── AlbumMediaGrid.tsx
│   └── AlbumSkeleton.tsx
│
├── hooks/
│   ├── useAlbum.ts
│   ├── useAlbums.ts
│   ├── useCreateAlbum.ts
│   └── useUpdateAlbum.ts
│
├── pages/
│   ├── AlbumDetailsPage.tsx
│   ├── AlbumsPage.tsx
│   ├── CreateAlbumPage.tsx
│   └── EditAlbumPage.tsx
│
├── schemas/
│   └── albumSchema.ts
│
├── types/
│   └── albumForm.ts
│
└── utils/
    └── albumUtils.ts
```

Do not create barrel `index.ts` files everywhere. They can produce circular dependencies and make navigation harder.

---

# 5. State Management Responsibilities

Use each library for a clear purpose.

## TanStack Query

Use for server state:

- Current profile
- Couple space
- Albums
- Memories
- Favorites
- Timeline data
- Notifications
- Playback progress

## Zustand

Use for client-only state:

- Current video player
- Upload queue
- Modal state
- Sidebar state
- Temporary filters
- Selected media
- Theme preference

## React Hook Form

Use for:

- Login
- Registration
- Couple-space creation
- Joining by invitation
- Album creation
- Album editing
- Profile editing
- Memory metadata

## Zod

Use for:

- Form validation
- Environment validation
- Upload validation
- Supabase response parsing where required

Do not duplicate server data inside Zustand.

---

# 6. Main Routes

```text
/
├── /splash
├── /onboarding
├── /login
├── /register
├── /forgot-password
├── /reset-password
│
├── /couple
│   ├── /setup
│   ├── /create
│   ├── /join
│   └── /invite
│
└── /app
    ├── /home
    ├── /albums
    ├── /albums/new
    ├── /albums/:albumId
    ├── /albums/:albumId/edit
    ├── /timeline
    ├── /favorites
    ├── /search
    ├── /upload
    ├── /memories/:memoryId
    ├── /profile
    └── /settings
```

Required route wrappers:

```text
PublicRoute
GuestRoute
ProtectedRoute
CoupleSpaceRoute
OnboardingRoute
```

## Route Rules

- Unauthenticated users should go to `/login`.
- Authenticated users without completed onboarding should go to `/onboarding`.
- Authenticated users without a couple space should go to `/couple/setup`.
- Users with a valid couple space should enter `/app/home`.
- Logged-in users should not access login or registration pages.

---

# 7. Application Layout

## Desktop

```text
┌──────────────┬─────────────────────────────┐
│ Sidebar      │ Main Content                │
│              │                             │
│ Home         │ Featured Memory             │
│ Albums       │ Horizontal Memory Rows      │
│ Timeline     │                             │
│ Favorites   │                             │
│ Profile      │                             │
└──────────────┴─────────────────────────────┘
```

## Mobile

```text
┌────────────────────────────┐
│ Header                     │
│                            │
│ Main Content               │
│                            │
├────────────────────────────┤
│ Home Albums + Timeline Me  │
└────────────────────────────┘
```

Use responsive breakpoints.

The upload action should appear as a prominent center button on mobile.

---

# 8. Main Pages

## Authentication

- Login
- Registration
- Forgot password
- Reset password
- Email verification

## Couple Space

- Create couple space
- Join using invitation
- Invite partner
- Partner pending
- Couple-space settings

## Home

- Featured memory
- Continue watching
- Recently added
- Favorites
- Trips
- Date nights
- Videos
- This time last year
- Albums

## Albums

- Album listing
- Album details
- Create album
- Edit album
- Delete album
- Add and remove memories

## Upload

- Drag and drop
- File browser
- Multiple file selection
- Preview
- Compression
- Metadata
- Album selection
- Upload progress
- Retry

## Timeline

- Memories grouped by year
- Memories grouped by month
- Sticky date headers
- Media filters
- Jump to year

## Media Viewer

- Full-screen image
- Video playback
- Previous and next navigation
- Zoom
- Favorite
- Edit
- Delete
- Metadata

## Settings

- Account
- Couple space
- Privacy
- Media preferences
- Cache
- Appearance
- Delete account

---

# 9. Upload Architecture

Browser uploads need careful handling.

```text
User selects files
        ↓
Validate type, size and duration
        ↓
Generate previews
        ↓
Compress images in browser
        ↓
Create video thumbnail
        ↓
Add items to upload queue
        ↓
Upload to Supabase Storage
        ↓
Insert memory record
        ↓
Invalidate TanStack Query cache
```

## Recommended Free Browser Libraries

For images:

```bash
pnpm add browser-image-compression
```

For video metadata and thumbnails:

- Use native HTML video and canvas APIs.
- Avoid browser-based FFmpeg during the first phase because it is large and resource intensive.
- Apply strict video upload size and duration limits.

Suggested initial limits:

```ts
export const UPLOAD_LIMITS = {
  maxPhotoSizeBytes: 15 * 1024 * 1024,
  maxVideoSizeBytes: 100 * 1024 * 1024,
  maxVideoDurationSeconds: 300,
  maxFilesPerUpload: 20,
  acceptedPhotoTypes: ["image/jpeg", "image/png", "image/webp"],
  acceptedVideoTypes: ["video/mp4", "video/webm"],
} as const;
```

These limits should be configurable and not duplicated.

---

# 10. Supabase Client

```ts
// src/lib/supabase.ts

import { createClient } from "@supabase/supabase-js";

import { env } from "@/config/environment";
import type { Database } from "@/types/database";

export const supabase = createClient<Database>(
  env.supabaseUrl,
  env.supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);
```

Environment validation:

```ts
// src/config/environment.ts

import { z } from "zod";

const environmentSchema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
});

const parsedEnvironment = environmentSchema.safeParse(import.meta.env);

if (!parsedEnvironment.success) {
  throw new Error("Invalid application environment configuration.");
}

export const env = {
  supabaseUrl: parsedEnvironment.data.VITE_SUPABASE_URL,
  supabaseAnonKey: parsedEnvironment.data.VITE_SUPABASE_ANON_KEY,
};
```

`.env.example`:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

The Supabase anonymous key is intended for frontend use, but database security must still be enforced using Row Level Security.

Never expose the Supabase service-role key in React.

---

# 11. Query Keys

```ts
// src/config/queryKeys.ts

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
  },

  memories: {
    all: ["memories"] as const,
    recent: (coupleSpaceId: string) =>
      [...queryKeys.memories.all, "recent", coupleSpaceId] as const,
    favorite: (coupleSpaceId: string) =>
      [...queryKeys.memories.all, "favorite", coupleSpaceId] as const,
    details: (memoryId: string) =>
      [...queryKeys.memories.all, "details", memoryId] as const,
  },
} as const;
```

---

# 12. Service Layer Example

```ts
// src/features/albums/api/getAlbums.ts

import { supabase } from "@/lib/supabase";
import type { Album } from "@/types/album";

export async function getAlbums(coupleSpaceId: string): Promise<Album[]> {
  const { data, error } = await supabase
    .from("albums")
    .select("*")
    .eq("couple_space_id", coupleSpaceId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}
```

Query hook:

```ts
// src/features/albums/hooks/useAlbums.ts

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/config/queryKeys";
import { getAlbums } from "../api/getAlbums";

export function useAlbums(coupleSpaceId?: string) {
  return useQuery({
    queryKey: queryKeys.albums.list(coupleSpaceId ?? ""),
    queryFn: () => getAlbums(coupleSpaceId!),
    enabled: Boolean(coupleSpaceId),
  });
}
```

Components must not call Supabase directly.

---

# 13. Database Tables

Use the same main database entities:

```text
profiles
couple_spaces
couple_members
couple_invitations
albums
memories
memory_reactions
memory_comments
playback_progress
notifications
```

Important relationships:

```text
auth.users
    ↓
profiles
    ↓
couple_members
    ↓
couple_spaces
    ├── albums
    ├── memories
    └── invitations
```

Every album and memory must contain `couple_space_id`.

This makes security rules and filtering clearer.

---

# 14. Private Storage Structure

Use private Supabase Storage buckets:

```text
avatars
couple-covers
memory-media
memory-thumbnails
album-covers
```

Paths:

```text
avatars/{userId}/avatar.webp

couple-covers/{coupleSpaceId}/cover.webp

memory-media/{coupleSpaceId}/{year}/{month}/{memoryId}.{extension}

memory-thumbnails/{coupleSpaceId}/{memoryId}.webp

album-covers/{coupleSpaceId}/{albumId}/cover.webp
```

Private media must use temporary signed URLs.

Do not store signed URLs in the database because they expire.

Store only the storage object path.

---

# 15. Security Requirements

Row Level Security must be enabled for every user-owned table.

Users can access data only when:

```text
auth.uid() is an active member of the record's couple_space_id
```

A user must not be able to:

- Read another couple's memories
- Guess storage URLs
- Add themselves to a couple space directly
- Join more than one active couple space
- Add a third active member
- Change another user's profile
- Delete media belonging to another couple
- Access revoked invitation codes

The frontend must never be treated as the security boundary.

Hiding a button in React is not authorization.

Supabase policies must enforce every permission.

---

# 16. Design System

Use a dark cinematic visual system.

```ts
export const colors = {
  background: {
    primary: "#09090B",
    secondary: "#111115",
    elevated: "#19191F",
  },

  brand: {
    primary: "#C92A54",
    secondary: "#F06585",
  },

  text: {
    primary: "#FAFAFA",
    secondary: "#A1A1AA",
    disabled: "#71717A",
  },

  border: {
    subtle: "rgba(255, 255, 255, 0.08)",
    strong: "rgba(255, 255, 255, 0.16)",
  },

  state: {
    success: "#51CF66",
    warning: "#FCC419",
    error: "#FF6B6B",
  },
} as const;
```

Avoid directly copying Netflix red, typography, logos, icons, or exact visual composition.

---

# 17. Home Page Structure

```tsx
<AppLayout>
  <FeaturedMemory />

  <HorizontalMediaRow title="Continue Watching" items={continueWatching} />

  <HorizontalMediaRow title="Recently Added" items={recentMemories} />

  <HorizontalMediaRow title="Our Favorites" items={favoriteMemories} />

  <HorizontalAlbumRow title="Trips Together" albums={tripAlbums} />

  <HorizontalAlbumRow title="Date Nights" albums={dateNightAlbums} />

  <HorizontalMediaRow title="Videos of Us" items={videoMemories} />

  <HorizontalMediaRow title="This Time Last Year" items={historicalMemories} />
</AppLayout>
```

Use CSS scroll snapping or Swiper for horizontal rows.

Do not autoplay videos with sound.

---

# 18. PWA Requirements

Configure the React application as a Progressive Web App.

Features:

- Installable on Android and desktop
- App manifest
- Application icons
- Offline shell
- Cached static assets
- Update notification
- Responsive full-screen layout

Do not cache private Supabase media in the service worker indefinitely.

Cache only:

- Application shell
- Icons
- Fonts
- Public placeholders
- Static assets

Private media caching must be carefully controlled.

---

# 19. Testing

## Vitest and React Testing Library

Test:

- Form validation
- Route guards
- Empty states
- Loading states
- Error states
- Album cards
- Memory cards
- Upload validation
- Home collection logic
- Couple invitation rules

## Playwright

Test:

- Registration
- Login
- Couple-space creation
- Partner invitation
- Album creation
- Photo upload
- Video upload
- Favorite action
- Logout

## Security Testing

Verify that:

- Couple A cannot access Couple B records.
- Couple A cannot fetch Couple B storage objects.
- An unauthenticated user cannot fetch private data.
- A third member cannot join a couple space.
- A former member loses access immediately.

---

# 20. Code Rules for Codex

1. Use TypeScript strict mode.
2. Do not use `any`.
3. Do not call Supabase from UI components.
4. Use TanStack Query for server state.
5. Use Zustand only for client state.
6. Use React Hook Form and Zod for forms.
7. Create reusable components.
8. Avoid large page components.
9. Implement loading, empty, error, and success states.
10. Do not commit secrets.
11. Do not expose service-role credentials.
12. Avoid deprecated React APIs.
13. Use semantic HTML.
14. Support keyboard navigation.
15. Add accessible labels.
16. Lazy-load feature routes.
17. Lazy-load large media components.
18. Avoid unnecessary rerenders.
19. Add tests for important business rules.
20. Do not change unrelated files.
21. Run formatting, linting, tests, and build validation.
22. Report failures honestly.

---

# 21. Development Phases

## Phase 1: Project Foundation

- React and TypeScript setup
- Vite
- ESLint and Prettier
- Path aliases
- Material UI theme
- React Router
- TanStack Query
- Zustand
- Supabase client
- Environment validation
- Shared layout
- Route guards
- Placeholder pages
- Unit test setup

## Phase 2: Authentication

- Registration
- Login
- Forgot password
- Reset password
- Session restoration
- Profile creation
- Protected routes
- Logout

## Phase 3: Couple Space

- Create couple space
- Generate invitation
- Join couple space
- Invitation expiry
- Partner details
- Two-member database validation
- Row Level Security

## Phase 4: Home Interface

- Cinematic hero
- Horizontal rows
- Responsive navigation
- Loading skeletons
- Empty home state
- Mock data
- Supabase integration

## Phase 5: Uploads

- Drag and drop
- File picker
- Image compression
- Video metadata
- Thumbnail generation
- Upload queue
- Progress
- Retry
- Supabase Storage

## Phase 6: Albums

- Album listing
- Album details
- Create album
- Edit album
- Delete album
- Add and remove media
- Album cover

## Phase 7: Media Viewer

- Image viewer
- Video player
- Full-screen mode
- Previous and next navigation
- Playback progress
- Favorites
- Metadata

## Phase 8: Timeline and Search

- Date grouping
- Timeline
- Search
- Filters
- Favorites page
- On-this-day memories

## Phase 9: Profile and Settings

- Profile editing
- Avatar upload
- Couple settings
- Theme settings
- Cache settings
- Leave couple space
- Delete account

## Phase 10: PWA and Quality

- PWA setup
- Accessibility
- Responsive testing
- Unit tests
- Playwright tests
- Security verification
- Performance improvements
- Production build

---

# 22. First Codex Prompt

```text
Build Phase 1 of the Memora React application.

Memora is a private, Netflix-inspired photo and video memory application for couples. Do not copy Netflix branding, logos, typography, assets, or exact interface designs.

Technology requirements:

- React
- TypeScript
- Vite
- pnpm
- Material UI
- React Router
- TanStack Query
- Zustand
- React Hook Form
- Zod
- Supabase JavaScript SDK
- Vitest
- React Testing Library

Implementation requirements:

1. Inspect the existing repository before modifying anything.
2. Use a feature-first folder structure.
3. Enable strict TypeScript.
4. Configure the `@/` path alias for the `src` directory.
5. Configure ESLint and Prettier.
6. Create AppProviders with:
   - Material UI ThemeProvider
   - TanStack QueryClientProvider
   - React Router provider
   - Global error boundary
7. Add environment validation for:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
8. Create the typed Supabase client.
9. Create a dark cinematic Material UI theme containing:
   - Colors
   - Typography
   - Spacing
   - Radius
   - Shadows
   - Component overrides
10. Configure routes for:
   - Splash
   - Onboarding
   - Login
   - Registration
   - Couple setup
   - Home
11. Create reusable route wrappers:
   - GuestRoute
   - ProtectedRoute
   - CoupleSpaceRoute
12. Keep authentication and couple-space checks behind repository or hook abstractions.
13. Create responsive layouts:
   - AuthLayout
   - AppLayout
   - DesktopSidebar
   - MobileBottomNavigation
14. Create reusable components:
   - PrimaryButton
   - SecondaryButton
   - FormTextField
   - LoadingScreen
   - ErrorState
   - EmptyState
   - SectionHeader
15. Create polished placeholder pages for all configured routes.
16. Add tests for:
   - Environment validation
   - Router redirects
   - PrimaryButton
   - FormTextField
   - EmptyState
17. Add `.env.example`.
18. Add setup instructions to README.md.
19. Do not implement authentication, uploads, albums, or database migrations yet.
20. Do not add paid packages or services.
21. Do not use `any`.
22. Do not place business logic directly inside components.
23. Preserve any existing code that already meets the requirements.

Before making changes, report the files that will be created or modified.

After implementation, run:

pnpm format
pnpm lint
pnpm test
pnpm build

Resolve all errors before marking Phase 1 complete.
```

---

# 23. Validation Scripts

Add scripts similar to:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "e2e": "playwright test",
    "typecheck": "tsc --noEmit",
    "validate": "pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm build"
  }
}
```

Codex should run:

```bash
pnpm validate
```

before considering a task complete.
