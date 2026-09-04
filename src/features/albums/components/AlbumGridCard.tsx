import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

import { MediaThumbnail } from "@/components/media/MediaThumbnail";
import { useSignedUrl } from "@/hooks/useSignedUrl";
import { accentIndexFromId } from "@/utils/accentUtils";

import type { AlbumWithCount } from "../api/getAlbums";

interface AlbumGridCardProps {
  album: AlbumWithCount;
}

export function AlbumGridCard({ album }: AlbumGridCardProps) {
  const navigate = useNavigate();
  const { data: coverUrl } = useSignedUrl(
    "memory-thumbnails",
    album.cover_path,
  );

  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/app/albums/${album.id}`)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          navigate(`/app/albums/${album.id}`);
        }
      }}
      sx={{ cursor: "pointer" }}
    >
      <MediaThumbnail
        accentIndex={accentIndexFromId(album.id)}
        imageUrl={coverUrl}
        aspectRatio="4 / 3"
      />
      <Typography variant="body2" noWrap sx={{ mt: 1 }}>
        {album.title}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {album.memoryCount} {album.memoryCount === 1 ? "memory" : "memories"}
      </Typography>
    </Box>
  );
}
