import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";

import { MemoryThumbnail } from "@/components/media/MemoryThumbnail";
import type { Memory } from "@/types/media";

interface MemoryCardProps {
  memory: Memory;
}

export function MemoryCard({ memory }: MemoryCardProps) {
  return (
    <Box sx={{ width: 200, flexShrink: 0, scrollSnapAlign: "start" }}>
      <Box sx={{ position: "relative" }}>
        <MemoryThumbnail memory={memory} />
        {memory.is_favorite ? (
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
      </Box>
      <Typography variant="body2" noWrap sx={{ mt: 1 }}>
        {memory.title || dayjs(memory.captured_at).format("MMM D, YYYY")}
      </Typography>
    </Box>
  );
}
