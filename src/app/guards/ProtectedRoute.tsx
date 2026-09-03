import { Navigate, Outlet } from "react-router-dom";

import { LoadingScreen } from "@/components/feedback/LoadingScreen";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace />;
  }

  return <Outlet />;
}
