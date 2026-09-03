import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/config/queryKeys";
import { useAuth } from "@/hooks/useAuth";
import { getCurrentProfile } from "@/services/profileService";

export function useProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.profile.current(),
    queryFn: () => getCurrentProfile(user!.id),
    enabled: Boolean(user),
  });
}
