import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/config/queryKeys";
import { useAuth } from "@/hooks/useAuth";

import { getPlaybackProgress } from "../api/getPlaybackProgress";

export function usePlaybackProgress(memoryId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.playbackProgress.memory(memoryId ?? "", user?.id ?? ""),
    queryFn: () => getPlaybackProgress(memoryId!, user!.id),
    enabled: Boolean(memoryId) && Boolean(user),
  });
}
