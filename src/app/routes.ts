import { createElement, lazy, Suspense, type JSX } from "react";
import { Navigate, type RouteObject } from "react-router-dom";

import { LoadingScreen } from "@/components/feedback/LoadingScreen";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { ROUTES } from "@/constants/routes";

import { CoupleSpaceRoute } from "./guards/CoupleSpaceRoute";
import { GuestRoute } from "./guards/GuestRoute";
import { OnboardingRoute } from "./guards/OnboardingRoute";
import { ProtectedRoute } from "./guards/ProtectedRoute";
import { PublicRoute } from "./guards/PublicRoute";

function withSuspense(
  importPage: () => Promise<{ default: () => JSX.Element | null }>,
) {
  const LazyPage = lazy(importPage);
  return createElement(
    Suspense,
    { fallback: createElement(LoadingScreen) },
    createElement(LazyPage),
  );
}

export const routes: RouteObject[] = [
  {
    element: createElement(PublicRoute),
    children: [
      {
        path: ROUTES.splash,
        element: withSuspense(() =>
          import("@/features/onboarding/pages/SplashPage").then((m) => ({
            default: m.SplashPage,
          })),
        ),
      },
    ],
  },
  {
    element: createElement(GuestRoute),
    children: [
      {
        element: createElement(AuthLayout),
        children: [
          {
            path: ROUTES.login,
            element: withSuspense(() =>
              import("@/features/authentication/pages/LoginPage").then((m) => ({
                default: m.LoginPage,
              })),
            ),
          },
          {
            path: ROUTES.register,
            element: withSuspense(() =>
              import("@/features/authentication/pages/RegisterPage").then(
                (m) => ({ default: m.RegisterPage }),
              ),
            ),
          },
          {
            path: ROUTES.forgotPassword,
            element: withSuspense(() =>
              import("@/features/authentication/pages/ForgotPasswordPage").then(
                (m) => ({ default: m.ForgotPasswordPage }),
              ),
            ),
          },
          {
            path: ROUTES.resetPassword,
            element: withSuspense(() =>
              import("@/features/authentication/pages/ResetPasswordPage").then(
                (m) => ({ default: m.ResetPasswordPage }),
              ),
            ),
          },
        ],
      },
    ],
  },
  {
    // Every route below requires an authenticated session.
    element: createElement(ProtectedRoute),
    children: [
      {
        element: createElement(OnboardingRoute),
        children: [
          {
            path: ROUTES.onboarding,
            element: withSuspense(() =>
              import("@/features/onboarding/pages/OnboardingPage").then(
                (m) => ({ default: m.OnboardingPage }),
              ),
            ),
          },
        ],
      },
      {
        // Couple setup/create/join/invite: authenticated, but couple space
        // is not yet established, so CoupleSpaceRoute does not apply here.
        element: createElement(AuthLayout),
        children: [
          {
            path: ROUTES.coupleSetup,
            element: withSuspense(() =>
              import("@/features/couple-space/pages/CoupleSetupPage").then(
                (m) => ({ default: m.CoupleSetupPage }),
              ),
            ),
          },
          {
            path: ROUTES.coupleCreate,
            element: withSuspense(() =>
              import("@/features/couple-space/pages/CoupleCreatePage").then(
                (m) => ({ default: m.CoupleCreatePage }),
              ),
            ),
          },
          {
            path: ROUTES.coupleJoin,
            element: withSuspense(() =>
              import("@/features/couple-space/pages/CoupleJoinPage").then(
                (m) => ({ default: m.CoupleJoinPage }),
              ),
            ),
          },
          {
            path: ROUTES.coupleInvite,
            element: withSuspense(() =>
              import("@/features/couple-space/pages/CoupleInvitePage").then(
                (m) => ({ default: m.CoupleInvitePage }),
              ),
            ),
          },
        ],
      },
      {
        element: createElement(CoupleSpaceRoute),
        children: [
          {
            element: createElement(AppLayout),
            children: [
              {
                path: ROUTES.home,
                element: withSuspense(() =>
                  import("@/features/home/pages/HomePage").then((m) => ({
                    default: m.HomePage,
                  })),
                ),
              },
              {
                path: ROUTES.albums,
                element: withSuspense(() =>
                  import("@/features/albums/pages/AlbumsPage").then((m) => ({
                    default: m.AlbumsPage,
                  })),
                ),
              },
              {
                path: ROUTES.newAlbum,
                element: withSuspense(() =>
                  import("@/features/albums/pages/CreateAlbumPage").then(
                    (m) => ({ default: m.CreateAlbumPage }),
                  ),
                ),
              },
              {
                path: "/app/albums/:albumId",
                element: withSuspense(() =>
                  import("@/features/albums/pages/AlbumDetailsPage").then(
                    (m) => ({ default: m.AlbumDetailsPage }),
                  ),
                ),
              },
              {
                path: "/app/albums/:albumId/edit",
                element: withSuspense(() =>
                  import("@/features/albums/pages/EditAlbumPage").then((m) => ({
                    default: m.EditAlbumPage,
                  })),
                ),
              },
              {
                path: ROUTES.timeline,
                element: withSuspense(() =>
                  import("@/features/timeline/pages/TimelinePage").then(
                    (m) => ({ default: m.TimelinePage }),
                  ),
                ),
              },
              {
                path: ROUTES.favorites,
                element: withSuspense(() =>
                  import("@/features/favorites/pages/FavoritesPage").then(
                    (m) => ({ default: m.FavoritesPage }),
                  ),
                ),
              },
              {
                path: ROUTES.search,
                element: withSuspense(() =>
                  import("@/features/search/pages/SearchPage").then((m) => ({
                    default: m.SearchPage,
                  })),
                ),
              },
              {
                path: ROUTES.upload,
                element: withSuspense(() =>
                  import("@/features/uploads/pages/UploadPage").then((m) => ({
                    default: m.UploadPage,
                  })),
                ),
              },
              {
                path: "/app/memories/:memoryId",
                element: withSuspense(() =>
                  import("@/features/media-viewer/pages/MemoryDetailsPage").then(
                    (m) => ({ default: m.MemoryDetailsPage }),
                  ),
                ),
              },
            ],
          },
        ],
      },
      {
        // Profile and settings manage the account itself (password, avatar,
        // delete account), so they must stay reachable even before a couple
        // space exists - unlike CoupleSpaceRoute is not applied here.
        element: createElement(AppLayout),
        children: [
          {
            path: ROUTES.profile,
            element: withSuspense(() =>
              import("@/features/profile/pages/ProfilePage").then((m) => ({
                default: m.ProfilePage,
              })),
            ),
          },
          {
            path: ROUTES.settings,
            element: withSuspense(() =>
              import("@/features/settings/pages/SettingsPage").then((m) => ({
                default: m.SettingsPage,
              })),
            ),
          },
        ],
      },
    ],
  },
  {
    path: "/",
    element: createElement(Navigate, { to: ROUTES.home, replace: true }),
  },
  // Public, no-login routes for albums a couple has explicitly shared.
  // Intentionally unguarded and outside the authenticated app shell — must
  // stay below every static top-level path above (login, couple, app, etc.)
  // so a share slug can never shadow a real route, and above the catch-all.
  {
    path: "/:coupleSlug",
    element: withSuspense(() =>
      import("@/features/public-share/pages/PublicCouplePage").then((m) => ({
        default: m.PublicCouplePage,
      })),
    ),
  },
  {
    path: "/:coupleSlug/:albumSlug",
    element: withSuspense(() =>
      import("@/features/public-share/pages/PublicAlbumPage").then((m) => ({
        default: m.PublicAlbumPage,
      })),
    ),
  },
  {
    path: "*",
    element: createElement(Navigate, { to: ROUTES.splash, replace: true }),
  },
];
