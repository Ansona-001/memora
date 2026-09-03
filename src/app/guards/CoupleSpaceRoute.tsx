import { Outlet } from "react-router-dom";

/**
 * Nests inside ProtectedRoute. Couple-space membership checks are added
 * once that query exists (Phase 3).
 */
export function CoupleSpaceRoute() {
  return <Outlet />;
}
