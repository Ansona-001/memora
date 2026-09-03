import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { MediaThumbnail } from "@/components/media/MediaThumbnail";
import type { HomeFeaturedMemory } from "@/features/home/types/homeFeed";

interface FeaturedMemoryCardProps {
  memory: HomeFeaturedMemory;
}

export function FeaturedMemoryCard({ memory }: FeaturedMemoryCardProps) {
  return (
    <Box sx={{ position: "relative" }}>
      <MediaThumbnail accentIndex={memory.accentIndex} aspectRatio="21 / 9" />
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
        <Typography variant="h4" sx={{ mb: 0.5 }}>
          {memory.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {memory.caption}
        </Typography>
        <Box>
          <PrimaryButton>View memory</PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
}
