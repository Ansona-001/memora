import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

import { MemoryThumbnail } from "@/components/media/MemoryThumbnail";
import type { Memory } from "@/types/media";

interface MemoryCardProps {
  memory: Memory;
  contextIds?: string[];
}

export function MemoryCard({ memory, contextIds }: MemoryCardProps) {
  const navigate = useNavigate();

  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={() =>
        navigate(`/app/memories/${memory.id}`, { state: { contextIds } })
      }
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          navigate(`/app/memories/${memory.id}`, { state: { contextIds } });
        }
      }}
      sx={{
        width: 200,
        flexShrink: 0,
        scrollSnapAlign: "start",
        cursor: "pointer",
      }}
    >
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
