import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { MediaThumbnail } from "@/components/media/MediaThumbnail";
import type { HomeMediaItem } from "@/features/home/types/homeFeed";

interface MediaCardProps {
  item: HomeMediaItem;
}

export function MediaCard({ item }: MediaCardProps) {
  return (
    <Box sx={{ width: 200, flexShrink: 0, scrollSnapAlign: "start" }}>
      <MediaThumbnail accentIndex={item.accentIndex} mediaType={item.mediaType}>
        {item.isFavorite ? (
          <FavoriteRoundedIcon
            fontSize="small"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "primary.main",
            }}
          />
        ) : null}
      </MediaThumbnail>
      <Typography variant="body2" noWrap sx={{ mt: 1 }}>
        {item.title}
      </Typography>
    </Box>
  );
}
