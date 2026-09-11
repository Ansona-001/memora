import Box from "@mui/material/Box";

import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingScreen } from "@/components/feedback/LoadingScreen";
import { SectionHeader } from "@/components/layout/SectionHeader";
import type { AlbumWithCount } from "@/features/albums/api/getAlbums";
import { AlbumGridCard } from "@/features/albums/components/AlbumGridCard";
import { TimelineMonthSection } from "@/features/timeline/components/TimelineMonthSection";
import { groupMemoriesByDate } from "@/features/timeline/utils/groupMemoriesByDate";
import type { Memory } from "@/types/media";

interface SearchResultsProps {
  query: string;
  albums: AlbumWithCount[];
  memoriesQuery: {
    data: Memory[] | undefined;
    isPending: boolean;
    isError: boolean;
    refetch: () => void;
  };
}

export function SearchResults({
  query,
  albums,
  memoriesQuery,
}: SearchResultsProps) {
  if (query.trim().length === 0) {
    return (
      <EmptyState
        title="Search your memories"
        description="Find photos, videos, and albums by title."
      />
    );
  }

  const memories = memoriesQuery.data ?? [];
  const contextIds = memories.map((memory) => memory.id);
  const yearGroups = groupMemoriesByDate(memories);
  const hasNoResults =
    !memoriesQuery.isPending &&
    !memoriesQuery.isError &&
    albums.length === 0 &&
    memories.length === 0;

  if (hasNoResults) {
    return (
      <EmptyState
        title="No results"
        description={`Nothing matches "${query}".`}
      />
    );
  }

  return (
    <Box>
      {albums.length > 0 ? (
        <Box sx={{ mb: 4 }}>
          <SectionHeader title="Albums" />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: 2,
            }}
          >
            {albums.map((album) => (
              <AlbumGridCard key={album.id} album={album} />
            ))}
          </Box>
        </Box>
      ) : null}

      <SectionHeader title="Memories" />
      {memoriesQuery.isPending ? (
        <LoadingScreen />
      ) : memoriesQuery.isError ? (
        <ErrorState
          title="We couldn't search your memories"
          onRetry={memoriesQuery.refetch}
        />
      ) : memories.length === 0 ? (
        <EmptyState title="No matching memories" />
      ) : (
        yearGroups.map((yearGroup) => (
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
        ))
      )}
    </Box>
  );
}
