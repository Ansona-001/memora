import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded";
import Box from "@mui/material/Box";
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
      {memories.map((memory) => (
        <Box
          key={memory.id}
          role="button"
          tabIndex={0}
          onClick={() =>
            navigate(`/app/memories/${memory.id}`, { state: { contextIds } })
          }
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              navigate(`/app/memories/${memory.id}`, {
                state: { contextIds },
              });
            }
          }}
          sx={{ position: "relative", cursor: "pointer" }}
        >
          <MemoryThumbnail memory={memory} aspectRatio="1 / 1" />
          <Box
            sx={{
              position: "absolute",
              top: 4,
              right: 4,
              display: "flex",
              gap: 0.5,
            }}
          >
            <IconActionButton
              label="Set as album cover"
              size="small"
              onClick={(event) => {
                event.stopPropagation();
                onSetCover(memory.thumbnail_path);
              }}
              sx={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            >
              <ImageRoundedIcon fontSize="small" />
            </IconActionButton>
            <IconActionButton
              label="Remove from album"
              size="small"
              onClick={(event) => {
                event.stopPropagation();
                onRemove(memory.id);
              }}
              sx={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            >
              <RemoveCircleRoundedIcon fontSize="small" />
            </IconActionButton>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
