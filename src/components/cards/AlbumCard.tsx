import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { MediaThumbnail } from "@/components/media/MediaThumbnail";
import type { HomeAlbum } from "@/features/home/types/homeFeed";

interface AlbumCardProps {
  album: HomeAlbum;
}

export function AlbumCard({ album }: AlbumCardProps) {
  return (
    <Box sx={{ width: 220, flexShrink: 0, scrollSnapAlign: "start" }}>
      <MediaThumbnail accentIndex={album.accentIndex} aspectRatio="4 / 3" />
      <Typography variant="body2" noWrap sx={{ mt: 1 }}>
        {album.title}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {album.memoryCount} memories
      </Typography>
    </Box>
  );
}
