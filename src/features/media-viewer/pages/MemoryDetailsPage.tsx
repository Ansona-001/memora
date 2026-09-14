import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { IconActionButton } from "@/components/buttons/IconActionButton";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingScreen } from "@/components/feedback/LoadingScreen";
import { ImageViewer } from "@/components/media/ImageViewer";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { useCoupleSpace } from "@/features/couple-space/hooks/useCoupleSpace";
import { useAuth } from "@/hooks/useAuth";
import { useSignedUrl } from "@/hooks/useSignedUrl";
import { getErrorMessage } from "@/utils/errorUtils";

import { DeleteMemoryDialog } from "../components/DeleteMemoryDialog";
import { EditMemoryDialog } from "../components/EditMemoryDialog";
import { MemoryMetadataPanel } from "../components/MemoryMetadataPanel";
import { useDeleteMemory } from "../hooks/useDeleteMemory";
import { useMemory } from "../hooks/useMemory";
import { useMemoryContext } from "../hooks/useMemoryContext";
import { usePlaybackProgress } from "../hooks/usePlaybackProgress";
import { useSavePlaybackProgress } from "../hooks/useSavePlaybackProgress";
import { useToggleFavorite } from "../hooks/useToggleFavorite";
import { useUpdateMemory } from "../hooks/useUpdateMemory";

export function MemoryDetailsPage() {
  const { memoryId } = useParams<{ memoryId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { data: coupleSpace } = useCoupleSpace();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const memoryQuery = useMemory(memoryId);
  const fallbackContext = useMemoryContext(coupleSpace?.id);
  const contextIds: string[] =
    (location.state as { contextIds?: string[] } | null)?.contextIds ??
    fallbackContext.data ??
    [];

  const mediaUrl = useSignedUrl("memory-media", memoryQuery.data?.storage_path);
  const playbackProgress = usePlaybackProgress(memoryId);
  const savePlaybackProgress = useSavePlaybackProgress();
  const toggleFavorite = useToggleFavorite();
  const updateMemory = useUpdateMemory();
  const deleteMemory = useDeleteMemory();

  const currentIndex = contextIds.indexOf(memoryId ?? "");
  const prevId = currentIndex > 0 ? contextIds[currentIndex - 1] : null;
  const nextId =
    currentIndex >= 0 && currentIndex < contextIds.length - 1
      ? contextIds[currentIndex + 1]
      : null;

  const goTo = (id: string) => {
    navigate(`/app/memories/${id}`, { state: { contextIds }, replace: true });
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" && prevId) goTo(prevId);
      if (event.key === "ArrowRight" && nextId) goTo(nextId);
      if (event.key === "Escape") navigate(-1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevId, nextId]);

  if (memoryQuery.isPending) {
    return <LoadingScreen />;
  }

  if (memoryQuery.isError || !memoryQuery.data) {
    return (
      <ErrorState
        title="We couldn't load this memory"
        onRetry={() => memoryQuery.refetch()}
      />
    );
  }

  const memory = memoryQuery.data;

  return (
    <Box
      component="main"
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: (theme) => theme.zIndex.modal,
        backgroundColor: "background.default",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 1.5,
        }}
      >
        <IconActionButton label="Close" onClick={() => navigate(-1)}>
          <CloseRoundedIcon />
        </IconActionButton>

        <Box sx={{ display: "flex", gap: 1 }}>
          <IconActionButton
            label={memory.is_favorite ? "Remove favorite" : "Add favorite"}
            onClick={() => toggleFavorite.toggle(memory)}
            disabled={toggleFavorite.isPending}
          >
            {memory.is_favorite ? (
              <FavoriteRoundedIcon sx={{ color: "primary.main" }} />
            ) : (
              <FavoriteBorderRoundedIcon />
            )}
          </IconActionButton>
          <IconActionButton label="Edit" onClick={() => setIsEditOpen(true)}>
            <EditRoundedIcon />
          </IconActionButton>
          <IconActionButton
            label="Delete"
            onClick={() => setIsDeleteOpen(true)}
          >
            <DeleteRoundedIcon />
          </IconActionButton>
        </Box>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 0,
          px: { xs: 1, md: 8 },
        }}
      >
        {prevId ? (
          <IconActionButton
            label="Previous"
            onClick={() => goTo(prevId)}
            sx={{ position: "absolute", left: 8, zIndex: 1 }}
          >
            <ChevronLeftRoundedIcon fontSize="large" />
          </IconActionButton>
        ) : null}

        {mediaUrl.data ? (
          memory.media_type === "video" ? (
            <VideoPlayer
              src={mediaUrl.data}
              startTimeSeconds={playbackProgress.data?.position_seconds ?? 0}
              onProgress={(positionSeconds, durationSeconds) => {
                if (user) {
                  savePlaybackProgress.mutate({
                    coupleSpaceId: memory.couple_space_id,
                    memoryId: memory.id,
                    userId: user.id,
                    positionSeconds,
                    durationSeconds,
                  });
                }
              }}
            />
          ) : (
            <ImageViewer src={mediaUrl.data} alt={memory.title ?? ""} />
          )
        ) : (
          <LoadingScreen />
        )}

        {nextId ? (
          <IconActionButton
            label="Next"
            onClick={() => goTo(nextId)}
            sx={{ position: "absolute", right: 8, zIndex: 1 }}
          >
            <ChevronRightRoundedIcon fontSize="large" />
          </IconActionButton>
        ) : null}
      </Box>

      <Box sx={{ p: 2 }}>
        <MemoryMetadataPanel memory={memory} />
      </Box>

      <EditMemoryDialog
        open={isEditOpen}
        memory={memory}
        isSubmitting={updateMemory.isPending}
        errorMessage={
          updateMemory.isError ? getErrorMessage(updateMemory.error) : null
        }
        onClose={() => setIsEditOpen(false)}
        onSubmit={(values) =>
          updateMemory.mutate(
            {
              memoryId: memory.id,
              updates: { title: values.title || null },
            },
            { onSuccess: () => setIsEditOpen(false) },
          )
        }
      />

      <DeleteMemoryDialog
        open={isDeleteOpen}
        isDeleting={deleteMemory.isPending}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() =>
          deleteMemory.mutate(memory, {
            onSuccess: () => navigate(-1),
          })
        }
      />
    </Box>
  );
}
