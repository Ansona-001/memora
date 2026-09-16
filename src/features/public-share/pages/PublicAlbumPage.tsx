import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useParams, Link as RouterLink } from "react-router-dom";

import { AlbumComments } from "@/features/albums/components/AlbumComments";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingScreen } from "@/components/feedback/LoadingScreen";
import { ROUTES } from "@/constants/routes";

import { PublicLayout } from "../components/PublicLayout";
import { PublicMediaGrid } from "../components/PublicMediaGrid";
import { usePublicAlbum } from "../hooks/usePublicAlbum";

export function PublicAlbumPage() {
  const { coupleSlug, albumSlug } = useParams<{
    coupleSlug: string;
    albumSlug: string;
  }>();
  const query = usePublicAlbum(coupleSlug, albumSlug);

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
          title="We couldn't load this album"
          onRetry={() => query.refetch()}
        />
      </PublicLayout>
    );
  }

  if (!query.data) {
    return (
      <PublicLayout>
        <EmptyState
          title="This album isn't shared"
          description="Either it was never public, or sharing has been turned off."
        />
      </PublicLayout>
    );
  }

  const { album, coupleSpaceName, coupleSpaceSlug, memories } = query.data;

  return (
    <PublicLayout>
      <Typography
        component={RouterLink}
        to={ROUTES.publicCouple(coupleSpaceSlug)}
        variant="body2"
        sx={{ color: "primary.light", mb: 1, display: "inline-block" }}
      >
        ← {coupleSpaceName}
      </Typography>
      <Typography variant="h5" component="h1" sx={{ mb: 1 }}>
        {album.title}
      </Typography>
      {album.description ? (
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          {album.description}
        </Typography>
      ) : null}

      {memories.length === 0 ? (
        <EmptyState title="No memories in this album" />
      ) : (
        <PublicMediaGrid memories={memories} />
      )}

      <Box sx={{ mt: 4 }}>
        <AlbumComments albumId={album.id} />
      </Box>
    </PublicLayout>
  );
}
