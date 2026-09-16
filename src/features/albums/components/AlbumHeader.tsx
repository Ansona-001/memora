import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

import { IconActionButton } from "@/components/buttons/IconActionButton";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { MediaThumbnail } from "@/components/media/MediaThumbnail";
import { useSignedUrl } from "@/hooks/useSignedUrl";
import type { Album } from "@/types/album";
import { accentIndexFromId } from "@/utils/accentUtils";

interface AlbumHeaderProps {
  album: Album;
  memoryCount: number;
  onAddMemories: () => void;
  onDelete: () => void;
  onShare: () => void;
}

export function AlbumHeader({
  album,
  memoryCount,
  onAddMemories,
  onDelete,
  onShare,
}: AlbumHeaderProps) {
  const navigate = useNavigate();
  const { data: coverUrl } = useSignedUrl(
    "memory-thumbnails",
    album.cover_path,
  );

  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ mb: 4 }}>
      <Box sx={{ width: { xs: "100%", sm: 240 }, flexShrink: 0 }}>
        <MediaThumbnail
          accentIndex={accentIndexFromId(album.id)}
          imageUrl={coverUrl}
          aspectRatio="4 / 3"
        />
      </Box>

      <Stack spacing={1.5} sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography variant="h4" component="h1">
          {album.title}
        </Typography>
        {album.description ? (
          <Typography variant="body2" color="textSecondary">
            {album.description}
          </Typography>
        ) : null}
        <Typography variant="body2" color="textSecondary">
          {memoryCount} {memoryCount === 1 ? "memory" : "memories"}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
          <PrimaryButton onClick={onAddMemories}>Add memories</PrimaryButton>
          <IconActionButton
            label={album.is_public ? "Sharing is on" : "Share album"}
            onClick={onShare}
          >
            <ShareRoundedIcon
              fontSize="small"
              color={album.is_public ? "primary" : "inherit"}
            />
          </IconActionButton>
          <IconActionButton
            label="Edit album"
            onClick={() => navigate(`/app/albums/${album.id}/edit`)}
          >
            <EditRoundedIcon fontSize="small" />
          </IconActionButton>
          <IconActionButton label="Delete album" onClick={onDelete}>
            <DeleteRoundedIcon fontSize="small" />
          </IconActionButton>
        </Stack>
      </Stack>
    </Stack>
  );
}
