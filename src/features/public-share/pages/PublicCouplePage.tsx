import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useParams, Link as RouterLink } from "react-router-dom";

import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingScreen } from "@/components/feedback/LoadingScreen";
import { MediaThumbnail } from "@/components/media/MediaThumbnail";
import { ROUTES } from "@/constants/routes";
import { useSignedUrl } from "@/hooks/useSignedUrl";
import { accentIndexFromId } from "@/utils/accentUtils";

import { PublicLayout } from "../components/PublicLayout";
import { usePublicCoupleSpace } from "../hooks/usePublicCoupleSpace";

function PublicAlbumCard({
  coupleSlug,
  album,
}: {
  coupleSlug: string;
  album: {
    id: string;
    slug: string;
    title: string;
    cover_path: string | null;
  };
}) {
  const { data: coverUrl } = useSignedUrl("memory-thumbnails", album.cover_path);

  return (
    <Box
      component={RouterLink}
      to={ROUTES.publicAlbum(coupleSlug, album.slug)}
      sx={{ textDecoration: "none", color: "inherit" }}
    >
      <MediaThumbnail
        accentIndex={accentIndexFromId(album.id)}
        imageUrl={coverUrl}
        aspectRatio="4 / 3"
      />
      <Typography variant="body2" sx={{ mt: 1 }}>
        {album.title}
      </Typography>
    </Box>
  );
}

export function PublicCouplePage() {
  const { coupleSlug } = useParams<{ coupleSlug: string }>();
  const query = usePublicCoupleSpace(coupleSlug);

  if (query.isPending) {
    return (
      <PublicLayout>
        <LoadingScreen />
      </PublicLayout>
    );
  }

  if (query.isError) {
    return (
      <PublicLayout>
        <ErrorState
          title="We couldn't load this page"
          onRetry={() => query.refetch()}
        />
      </PublicLayout>
    );
  }

  if (!query.data) {
    return (
      <PublicLayout>
        <EmptyState
          title="Nothing shared here"
          description="This link doesn't have any albums shared publicly right now."
        />
      </PublicLayout>
    );
  }

  const { name, albums } = query.data;

  return (
    <PublicLayout>
      <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
        {name}
      </Typography>

      {albums.length === 0 ? (
        <EmptyState
          title="Nothing shared here yet"
          description="This couple hasn't made any albums public."
        />
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 2,
          }}
        >
          {albums.map((album) => (
            <PublicAlbumCard
              key={album.id}
              coupleSlug={coupleSlug!}
              album={album}
            />
          ))}
        </Box>
      )}
    </PublicLayout>
  );
}
