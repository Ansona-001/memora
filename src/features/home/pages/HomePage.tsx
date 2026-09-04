import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";

import { MemoryCard } from "@/components/cards/MemoryCard";
import { ErrorState } from "@/components/feedback/ErrorState";
import { PageContainer } from "@/components/layout/PageContainer";
import { HorizontalMediaRow } from "@/components/media/HorizontalMediaRow";
import { ROUTES } from "@/constants/routes";
import { AlbumGridCard } from "@/features/albums/components/AlbumGridCard";
import { useCoupleSpace } from "@/features/couple-space/hooks/useCoupleSpace";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";

import { EmptyHomeState } from "../components/EmptyHomeState";
import { FeaturedMemory } from "../components/FeaturedMemory";
import { HomeRowSkeleton } from "../components/HomeRowSkeleton";
import { useHomeFeed } from "../hooks/useHomeFeed";

function isFeedEmpty(feed: ReturnType<typeof useHomeFeed>["data"]): boolean {
  if (!feed) {
    return false;
  }

  return (
    !feed.featured &&
    feed.recentMemories.length === 0 &&
    feed.favoriteMemories.length === 0 &&
    feed.albums.length === 0 &&
    feed.videoMemories.length === 0 &&
    feed.historicalMemories.length === 0
  );
}

export function HomePage() {
  const { data: profile } = useProfile();
  const { data: coupleSpace } = useCoupleSpace();
  const { user } = useAuth();
  const feed = useHomeFeed(coupleSpace?.id);

  const partnerName = coupleSpace?.members.find(
    (member) => member.userId !== user?.id,
  )?.profile?.display_name;

  return (
    <PageContainer>
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h5">
          {profile ? `Welcome back, ${profile.display_name}` : "Welcome back"}
        </Typography>
        {partnerName ? (
          <Typography variant="body2" color="text.secondary">
            {coupleSpace?.name} · Shared with {partnerName}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {coupleSpace?.name} · Waiting for your partner to join —{" "}
            <Typography
              component={RouterLink}
              to={ROUTES.coupleInvite}
              variant="body2"
              color="primary.main"
              sx={{ display: "inline" }}
            >
              share your invite code
            </Typography>
          </Typography>
        )}
      </Stack>

      {feed.isPending ? (
        <>
          <HomeRowSkeleton />
          <HomeRowSkeleton />
          <HomeRowSkeleton />
        </>
      ) : feed.isError ? (
        <ErrorState
          title="We couldn't load your memories"
          onRetry={() => feed.refetch()}
        />
      ) : isFeedEmpty(feed.data) ? (
        <EmptyHomeState />
      ) : (
        <>
          <FeaturedMemory memory={feed.data?.featured} isLoading={false} />

          <HorizontalMediaRow
            title="Recently Added"
            items={feed.data?.recentMemories ?? []}
            getKey={(memory) => memory.id}
            renderItem={(memory) => <MemoryCard memory={memory} />}
          />
          <HorizontalMediaRow
            title="Our Favorites"
            items={feed.data?.favoriteMemories ?? []}
            getKey={(memory) => memory.id}
            renderItem={(memory) => <MemoryCard memory={memory} />}
          />
          <HorizontalMediaRow
            title="Your Albums"
            items={feed.data?.albums ?? []}
            getKey={(album) => album.id}
            renderItem={(album) => <AlbumGridCard album={album} />}
          />
          <HorizontalMediaRow
            title="Videos of Us"
            items={feed.data?.videoMemories ?? []}
            getKey={(memory) => memory.id}
            renderItem={(memory) => <MemoryCard memory={memory} />}
          />
          <HorizontalMediaRow
            title="This Time Last Year"
            items={feed.data?.historicalMemories ?? []}
            getKey={(memory) => memory.id}
            renderItem={(memory) => <MemoryCard memory={memory} />}
          />
        </>
      )}
    </PageContainer>
  );
}
