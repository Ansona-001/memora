import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/config/queryKeys";

import { getPublicCoupleSpace } from "../api/getPublicCoupleSpace";

export function usePublicCoupleSpace(slug: string | undefined) {
  return useQuery({
    queryKey: queryKeys.publicShare.coupleSpace(slug ?? ""),
    queryFn: () => getPublicCoupleSpace(slug!),
    enabled: Boolean(slug),
  });
}
