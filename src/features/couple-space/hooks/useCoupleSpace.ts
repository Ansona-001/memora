import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/config/queryKeys";
import { useAuth } from "@/hooks/useAuth";
import { getCurrentCoupleSpace } from "@/services/coupleSpaceService";

export function useCoupleSpace() {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.coupleSpace.current(),
    queryFn: () => getCurrentCoupleSpace(user!.id),
    enabled: Boolean(user),
    refetchInterval: (query) =>
      query.state.data && query.state.data.members.length < 2 ? 4000 : false,
  });
}
