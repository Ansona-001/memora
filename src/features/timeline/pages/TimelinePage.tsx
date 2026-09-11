import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, useMemo, useState } from "react";

import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingScreen } from "@/components/feedback/LoadingScreen";
import { PageContainer } from "@/components/layout/PageContainer";
import { useCoupleSpace } from "@/features/couple-space/hooks/useCoupleSpace";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

import type { TimelineMediaFilter } from "../api/getTimelineMemories";
import { TimelineFilters } from "../components/TimelineFilters";
import { TimelineMonthSection } from "../components/TimelineMonthSection";
import { TimelineYearJump } from "../components/TimelineYearJump";
import { useTimelineMemories } from "../hooks/useTimelineMemories";
import { useTimelineYears } from "../hooks/useTimelineYears";
import { groupMemoriesByDate } from "../utils/groupMemoriesByDate";

export function TimelinePage() {
  const { data: coupleSpace } = useCoupleSpace();
  const [filter, setFilter] = useState<TimelineMediaFilter>("all");

  const timeline = useTimelineMemories(coupleSpace?.id, filter);
  const years = useTimelineYears(coupleSpace?.id);
  const [loadMoreRef, isLoadMoreVisible] = useIntersectionObserver();

  useEffect(() => {
    if (
      isLoadMoreVisible &&
      timeline.hasNextPage &&
      !timeline.isFetchingNextPage
    ) {
      timeline.fetchNextPage();
    }
  }, [isLoadMoreVisible, timeline]);

  const memories = useMemo(
    () => timeline.data?.pages.flatMap((page) => page.memories) ?? [],
    [timeline.data],
  );
  const contextIds = useMemo(
    () => memories.map((memory) => memory.id),
    [memories],
  );
  const yearGroups = useMemo(() => groupMemoriesByDate(memories), [memories]);

  const jumpToYear = (year: number) => {
    document
      .getElementById(`timeline-year-${year}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <PageContainer>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Timeline
      </Typography>

      <TimelineFilters value={filter} onChange={setFilter} />

      {years.data && years.data.length > 1 ? (
        <TimelineYearJump years={years.data} onJump={jumpToYear} />
      ) : null}

      <Box sx={{ mt: 2 }}>
        {timeline.isPending ? (
          <LoadingScreen />
        ) : timeline.isError ? (
          <ErrorState
            title="We couldn't load your timeline"
            onRetry={() => timeline.refetch()}
          />
        ) : memories.length === 0 ? (
          <EmptyState
            title="Nothing here yet"
            description="Memories matching this filter will show up here once you have some."
          />
        ) : (
          <>
            {yearGroups.map((yearGroup) => (
              <Box key={yearGroup.year} id={`timeline-year-${yearGroup.year}`}>
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
            {timeline.isFetchingNextPage ? <LoadingScreen /> : null}
          </>
        )}
      </Box>
    </PageContainer>
  );
}
