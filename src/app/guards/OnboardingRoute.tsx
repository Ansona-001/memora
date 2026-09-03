import { Outlet } from "react-router-dom";

/**
 * Nests inside ProtectedRoute. Onboarding-completion checks are added once
 * profile data is available (Phase 2).
 */
export function OnboardingRoute() {
  return <Outlet />;
}
