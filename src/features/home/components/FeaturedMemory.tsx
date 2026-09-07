import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

import { FeaturedMemoryCard } from "@/components/cards/FeaturedMemoryCard";
import type { Memory } from "@/types/media";

interface FeaturedMemoryProps {
  memory: Memory | null | undefined;
  isLoading: boolean;
  contextIds?: string[];
}

export function FeaturedMemory({
  memory,
  isLoading,
  contextIds,
}: FeaturedMemoryProps) {
  if (isLoading) {
    return (
      <Skeleton
        variant="rounded"
        sx={{ width: "100%", aspectRatio: "21 / 9", mb: 4 }}
      />
    );
  }

  if (!memory) {
    return null;
  }

  return (
    <Box sx={{ mb: 4 }}>
      <FeaturedMemoryCard memory={memory} contextIds={contextIds} />
    </Box>
  );
}
