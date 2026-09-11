import { useQuery } from "@tanstack/react-query";

import { getTimelineYears } from "../api/getTimelineYears";

export function useTimelineYears(coupleSpaceId: string | undefined) {
  return useQuery({
    queryKey: ["timeline-years", coupleSpaceId ?? ""],
    queryFn: () => getTimelineYears(coupleSpaceId!),
    enabled: Boolean(coupleSpaceId),
  });
}
