import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

import { IconActionButton } from "@/components/buttons/IconActionButton";
import { MemoryThumbnail } from "@/components/media/MemoryThumbnail";
import type { Memory } from "@/types/media";

interface AlbumMediaGridProps {
  memories: Memory[];
  onRemove: (memoryId: string) => void;
  onSetCover: (thumbnailPath: string) => void;
}

export function AlbumMediaGrid({
  memories,
  onRemove,
  onSetCover,
}: AlbumMediaGridProps) {
  const navigate = useNavigate();
  const contextIds = memories.map((memory) => memory.id);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
        gap: 1.5,
      }}
    >
      {memories.map((memory) => {
        const label =
          memory.title ??
          `${memory.media_type === "video" ? "Video" : "Photo"} from ${dayjs(memory.captured_at).format("MMMM D, YYYY")}`;

        return (
          <Box key={memory.id} sx={{ position: "relative" }}>
            <Box
              role="button"
              tabIndex={0}
              aria-label={label}
              onClick={() =>
                navigate(`/app/memories/${memory.id}`, {
                  state: { contextIds },
                })
              }
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  navigate(`/app/memories/${memory.id}`, {
                    state: { contextIds },
                  });
                }
              }}
              sx={{ cursor: "pointer" }}
            >
              <MemoryThumbnail memory={memory} aspectRatio="1 / 1" />
            </Box>
            <Box
              sx={{
                position: "absolute",
                top: 4,
                right: 4,
                display: "flex",
                gap: 0.5,
              }}
            >
              {/* Explicit white: these sit on a fixed dark scrim over the
                  thumbnail regardless of color scheme. The default
                  (unset) icon color follows theme.palette.action.active,
                  which turns dark in light mode and would go invisible
                  against this scrim. */}
              <IconActionButton
                label="Set as album cover"
                size="small"
                onClick={() => onSetCover(memory.thumbnail_path)}
                sx={{ backgroundColor: "rgba(0, 0, 0, 0.5)", color: "common.white" }}
              >
                <ImageRoundedIcon fontSize="small" />
              </IconActionButton>
              <IconActionButton
                label="Remove from album"
                size="small"
                onClick={() => onRemove(memory.id)}
                sx={{ backgroundColor: "rgba(0, 0, 0, 0.5)", color: "common.white" }}
              >
                <RemoveCircleRoundedIcon fontSize="small" />
              </IconActionButton>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
