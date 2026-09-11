import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, useMemo } from "react";

import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingScreen } from "@/components/feedback/LoadingScreen";
import { PageContainer } from "@/components/layout/PageContainer";
import { useCoupleSpace } from "@/features/couple-space/hooks/useCoupleSpace";
import { TimelineMonthSection } from "@/features/timeline/components/TimelineMonthSection";
import { useTimelineMemories } from "@/features/timeline/hooks/useTimelineMemories";
import { groupMemoriesByDate } from "@/features/timeline/utils/groupMemoriesByDate";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

export function FavoritesPage() {
  const { data: coupleSpace } = useCoupleSpace();
  const favorites = useTimelineMemories(coupleSpace?.id, "favorite");
  const [loadMoreRef, isLoadMoreVisible] = useIntersectionObserver();

  useEffect(() => {
    if (
      isLoadMoreVisible &&
      favorites.hasNextPage &&
      !favorites.isFetchingNextPage
    ) {
      favorites.fetchNextPage();
    }
  }, [isLoadMoreVisible, favorites]);

  const memories = useMemo(
    () => favorites.data?.pages.flatMap((page) => page.memories) ?? [],
    [favorites.data],
  );
  const contextIds = useMemo(
    () => memories.map((memory) => memory.id),
    [memories],
  );
  const yearGroups = useMemo(() => groupMemoriesByDate(memories), [memories]);

  return (
    <PageContainer>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Favorites
      </Typography>

      {favorites.isPending ? (
        <LoadingScreen />
      ) : favorites.isError ? (
        <ErrorState
          title="We couldn't load your favorites"
          onRetry={() => favorites.refetch()}
        />
      ) : memories.length === 0 ? (
        <EmptyState
          title="No favorites yet"
          description="Open a memory and tap the heart to save it here."
        />
      ) : (
        <>
          {yearGroups.map((yearGroup) => (
            <Box key={yearGroup.year}>
              {yearGroup.months.map((monthGroup) => (
                <TimelineMonthSection
                  key={monthGroup.key}
                  group={monthGroup}
                  year={yearGroup.year}
                  contextIds={contextIds}
                />
              ))}
            </Box>
          ))}
          <Box ref={loadMoreRef} sx={{ height: 1 }} />
          {favorites.isFetchingNextPage ? <LoadingScreen /> : null}
        </>
      )}
    </PageContainer>
  );
}
