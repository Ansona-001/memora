import { Navigate, Outlet } from "react-router-dom";

import { LoadingScreen } from "@/components/feedback/LoadingScreen";
import { ROUTES } from "@/constants/routes";
import { useCoupleSpace } from "@/features/couple-space/hooks/useCoupleSpace";

export function CoupleSpaceRoute() {
  const { data: coupleSpace, isPending, isFetching } = useCoupleSpace();

  // A stale cached "no couple space" result can be sitting in the cache
  // (e.g. from before the user created or joined one). Wait for an
  // in-flight fetch to settle before redirecting on an empty result, so a
  // freshly created/joined space isn't bounced back to setup.
  if (isPending || (!coupleSpace && isFetching)) {
    return <LoadingScreen />;
  }

  if (!coupleSpace) {
    return <Navigate to={ROUTES.coupleSetup} replace />;
  }

  return <Outlet />;
}
