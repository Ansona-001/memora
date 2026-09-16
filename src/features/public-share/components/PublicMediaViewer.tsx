import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { IconActionButton } from "@/components/buttons/IconActionButton";
import { LoadingScreen } from "@/components/feedback/LoadingScreen";
import { ImageViewer } from "@/components/media/ImageViewer";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { useSignedUrl } from "@/hooks/useSignedUrl";
import type { Memory } from "@/types/media";

interface PublicMediaViewerProps {
  memory: Memory;
  onClose: () => void;
  onPrev: (() => void) | null;
  onNext: (() => void) | null;
}

export function PublicMediaViewer({
  memory,
  onClose,
  onPrev,
  onNext,
}: PublicMediaViewerProps) {
  const mediaUrl = useSignedUrl("memory-media", memory.storage_path);

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: (theme) => theme.zIndex.modal,
        backgroundColor: "background.default",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1.5 }}>
        <IconActionButton label="Close" onClick={onClose}>
          <CloseRoundedIcon />
        </IconActionButton>
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
        {onPrev ? (
          <IconActionButton
            label="Previous"
            onClick={onPrev}
            sx={{ position: "absolute", left: 8, zIndex: 1 }}
          >
            <ChevronLeftRoundedIcon fontSize="large" />
          </IconActionButton>
        ) : null}

        {mediaUrl.data ? (
          memory.media_type === "video" ? (
            <VideoPlayer src={mediaUrl.data} />
          ) : (
            <ImageViewer src={mediaUrl.data} alt={memory.title ?? ""} />
          )
        ) : (
          <LoadingScreen />
        )}

        {onNext ? (
          <IconActionButton
            label="Next"
            onClick={onNext}
            sx={{ position: "absolute", right: 8, zIndex: 1 }}
          >
            <ChevronRightRoundedIcon fontSize="large" />
          </IconActionButton>
        ) : null}
      </Box>

      {memory.title || memory.ai_caption ? (
        <Box sx={{ p: 2 }}>
          {memory.title ? (
            <Typography variant="subtitle1">{memory.title}</Typography>
          ) : null}
          {memory.ai_caption ? (
            <Typography variant="body2" color="textSecondary">
              {memory.ai_caption}
            </Typography>
          ) : null}
        </Box>
      ) : null}
    </Box>
  );
}
