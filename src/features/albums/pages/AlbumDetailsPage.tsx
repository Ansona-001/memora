import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingScreen } from "@/components/feedback/LoadingScreen";
import { PageContainer } from "@/components/layout/PageContainer";
import { useCoupleSpace } from "@/features/couple-space/hooks/useCoupleSpace";

import { AddMemoriesDialog } from "../components/AddMemoriesDialog";
import { AlbumHeader } from "../components/AlbumHeader";
import { AlbumMediaGrid } from "../components/AlbumMediaGrid";
import { DeleteAlbumDialog } from "../components/DeleteAlbumDialog";
import { useAddMemoriesToAlbum } from "../hooks/useAddMemoriesToAlbum";
import { useAlbum } from "../hooks/useAlbum";
import { useAlbumMemories } from "../hooks/useAlbumMemories";
import { useDeleteAlbum } from "../hooks/useDeleteAlbum";
import { useRemoveMemoryFromAlbum } from "../hooks/useRemoveMemoryFromAlbum";
import { useSetAlbumCover } from "../hooks/useSetAlbumCover";
import { useUnassignedMemories } from "../hooks/useUnassignedMemories";

export function AlbumDetailsPage() {
  const { albumId } = useParams<{ albumId: string }>();
  const navigate = useNavigate();
  const { data: coupleSpace } = useCoupleSpace();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const albumQuery = useAlbum(albumId);
  const memoriesQuery = useAlbumMemories(albumId);
  const unassignedQuery = useUnassignedMemories(
    isAddOpen ? coupleSpace?.id : undefined,
  );

  const addMemories = useAddMemoriesToAlbum(albumId ?? "", coupleSpace?.id);
  const removeMemory = useRemoveMemoryFromAlbum(albumId ?? "", coupleSpace?.id);
  const setCover = useSetAlbumCover(albumId ?? "");
  const deleteAlbum = useDeleteAlbum(coupleSpace?.id);

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

  return (
    <PageContainer>
      <AlbumHeader
        album={album}
        memoryCount={memories.length}
        onAddMemories={() => setIsAddOpen(true)}
        onDelete={() => setIsDeleteOpen(true)}
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
    </PageContainer>
  );
}
