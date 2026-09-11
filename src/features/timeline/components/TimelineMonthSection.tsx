import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

import { MemoryThumbnail } from "@/components/media/MemoryThumbnail";
import type { Memory } from "@/types/media";

import type { MonthGroup } from "../utils/groupMemoriesByDate";

interface TimelineMonthSectionProps {
  group: MonthGroup;
  year: number;
  contextIds: string[];
}

export function TimelineMonthSection({
  group,
  year,
  contextIds,
}: TimelineMonthSectionProps) {
  const navigate = useNavigate();

  return (
    <Box component="section" sx={{ mb: 4 }}>
      <Typography
        variant="h6"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          backgroundColor: "background.default",
          py: 1,
        }}
      >
        {group.monthLabel} {year}
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: 1.5,
        }}
      >
        {group.memories.map((memory: Memory) => (
          <Box
            key={memory.id}
            role="button"
            tabIndex={0}
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
            sx={{ position: "relative", cursor: "pointer" }}
          >
            <MemoryThumbnail memory={memory} aspectRatio="1 / 1" />
            {memory.is_favorite ? (
              <FavoriteRoundedIcon
                fontSize="small"
                sx={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  color: "primary.main",
                }}
              />
            ) : null}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
