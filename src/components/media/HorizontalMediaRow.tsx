import Box from "@mui/material/Box";
import type { ReactNode } from "react";

import { SectionHeader } from "@/components/layout/SectionHeader";

interface HorizontalMediaRowProps<TItem> {
  title: string;
  items: TItem[];
  getKey: (item: TItem) => string;
  renderItem: (item: TItem) => ReactNode;
}

export function HorizontalMediaRow<TItem>({
  title,
  items,
  getKey,
  renderItem,
}: HorizontalMediaRowProps<TItem>) {
  if (items.length === 0) {
    return null;
  }

  return (
    <Box component="section" sx={{ mb: 4 }}>
      <SectionHeader title={title} />
      <Box
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          pb: 1,
          "&::-webkit-scrollbar": { height: 6 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "action.selected",
            borderRadius: 3,
          },
        }}
      >
        {items.map((item) => (
          <Box key={getKey(item)}>{renderItem(item)}</Box>
        ))}
      </Box>
    </Box>
  );
}
