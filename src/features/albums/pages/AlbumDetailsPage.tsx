import Box from "@mui/material/Box";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingScreen } from "@/components/feedback/LoadingScreen";
import { PageContainer } from "@/components/layout/PageContainer";
import { ROUTES } from "@/constants/routes";
import { useCoupleSpace } from "@/features/couple-space/hooks/useCoupleSpace";
import { getErrorMessage } from "@/utils/errorUtils";

import { AddMemoriesDialog } from "../components/AddMemoriesDialog";
import { AlbumComments } from "../components/AlbumComments";
import { AlbumHeader } from "../components/AlbumHeader";
import { AlbumMediaGrid } from "../components/AlbumMediaGrid";
import { DeleteAlbumDialog } from "../components/DeleteAlbumDialog";
import { ShareAlbumDialog } from "../components/ShareAlbumDialog";
import { useAddMemoriesToAlbum } from "../hooks/useAddMemoriesToAlbum";
import { useAlbum } from "../hooks/useAlbum";
import { useAlbumMemories } from "../hooks/useAlbumMemories";
import { useDeleteAlbum } from "../hooks/useDeleteAlbum";
import { useRemoveMemoryFromAlbum } from "../hooks/useRemoveMemoryFromAlbum";
import { useSetAlbumCover } from "../hooks/useSetAlbumCover";
import { useUnassignedMemories } from "../hooks/useUnassignedMemories";
import { useUpdateAlbum } from "../hooks/useUpdateAlbum";

export function AlbumDetailsPage() {
  const { albumId } = useParams<{ albumId: string }>();
  const navigate = useNavigate();
  const { data: coupleSpace } = useCoupleSpace();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const albumQuery = useAlbum(albumId);
  const memoriesQuery = useAlbumMemories(albumId);
  const unassignedQuery = useUnassignedMemories(
    isAddOpen ? coupleSpace?.id : undefined,
  );

  const addMemories = useAddMemoriesToAlbum(albumId ?? "", coupleSpace?.id);
  const removeMemory = useRemoveMemoryFromAlbum(albumId ?? "", coupleSpace?.id);
  const setCover = useSetAlbumCover(albumId ?? "");
  const deleteAlbum = useDeleteAlbum(coupleSpace?.id);
  const updateAlbum = useUpdateAlbum();

  if (albumQuery.isPending || memoriesQuery.isPending) {
    return <LoadingScreen />;
  }

  if (albumQuery.isError || !albumQuery.data) {
    return (
      <ErrorState
        title="We couldn't load this album"
        onRetry={() => albumQuery.refetch()}
      />
    );
  }

  const album = albumQuery.data;
  const memories = memoriesQuery.data ?? [];
  const shareUrl = coupleSpace
    ? `${window.location.origin}${ROUTES.publicAlbum(coupleSpace.publicSlug, album.slug)}`
    : "";

  return (
    <PageContainer>
      <AlbumHeader
        album={album}
        memoryCount={memories.length}
        onAddMemories={() => setIsAddOpen(true)}
        onDelete={() => setIsDeleteOpen(true)}
        onShare={() => setIsShareOpen(true)}
      />

      {memories.length === 0 ? (
        <EmptyState
          title="No memories in this album yet"
          description="Add photos and videos you've already uploaded."
        />
      ) : (
        <AlbumMediaGrid
          memories={memories}
          onRemove={(memoryId) => removeMemory.mutate(memoryId)}
          onSetCover={(thumbnailPath) => setCover.mutate(thumbnailPath)}
        />
      )}

      {album.is_public ? (
        <Box sx={{ mt: 4 }}>
          <AlbumComments albumId={album.id} canModerate />
        </Box>
      ) : null}

      <AddMemoriesDialog
        open={isAddOpen}
        memories={unassignedQuery.data ?? []}
        isSubmitting={addMemories.isPending}
        onClose={() => setIsAddOpen(false)}
        onConfirm={(memoryIds) =>
          addMemories.mutate(memoryIds, {
            onSuccess: () => setIsAddOpen(false),
          })
        }
      />

      <DeleteAlbumDialog
        open={isDeleteOpen}
        albumTitle={album.title}
        isDeleting={deleteAlbum.isPending}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() =>
          deleteAlbum.mutate(album.id, {
            onSuccess: () => navigate("/app/albums"),
          })
        }
      />

      <ShareAlbumDialog
        open={isShareOpen}
        albumTitle={album.title}
        isPublic={album.is_public}
        shareUrl={shareUrl}
        isSaving={updateAlbum.isPending}
        errorMessage={
          updateAlbum.isError ? getErrorMessage(updateAlbum.error) : null
        }
        onClose={() => setIsShareOpen(false)}
        onToggle={(nextIsPublic) =>
          updateAlbum.mutate({
            albumId: album.id,
            updates: { is_public: nextIsPublic },
          })
        }
      />
    </PageContainer>
  );
}
