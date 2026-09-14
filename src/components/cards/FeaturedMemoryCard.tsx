import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { MemoryThumbnail } from "@/components/media/MemoryThumbnail";
import type { Memory } from "@/types/media";

interface FeaturedMemoryCardProps {
  memory: Memory;
  contextIds?: string[];
}

export function FeaturedMemoryCard({
  memory,
  contextIds,
}: FeaturedMemoryCardProps) {
  const navigate = useNavigate();
  const capturedDate = dayjs(memory.captured_at).format("MMMM D, YYYY");

  return (
    <Box sx={{ position: "relative" }}>
      <MemoryThumbnail memory={memory} aspectRatio="21 / 9" highRes />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          p: { xs: 2, md: 4 },
          background:
            "linear-gradient(180deg, rgba(9,9,11,0) 40%, rgba(9,9,11,0.85) 100%)",
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" component="h2" sx={{ mb: 0.5 }}>
          {memory.title || `A memory from ${capturedDate}`}
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          {capturedDate}
        </Typography>
        <Box>
          <PrimaryButton
            onClick={() =>
              navigate(`/app/memories/${memory.id}`, { state: { contextIds } })
            }
          >
            View memory
          </PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
}
