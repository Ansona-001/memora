import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { SectionHeader } from "@/components/layout/SectionHeader";
import type { UploadQueueItem } from "@/types/media";

import { UploadQueueItemRow } from "./UploadQueueItemRow";

interface UploadQueueListProps {
  items: UploadQueueItem[];
  onRetry: (id: string) => void;
  onRemove: (id: string) => void;
  onClearCompleted: () => void;
}

export function UploadQueueList({
  items,
  onRetry,
  onRemove,
  onClearCompleted,
}: UploadQueueListProps) {
  if (items.length === 0) {
    return null;
  }

  const hasCompleted = items.some((item) => item.status === "success");

  return (
    <Box sx={{ mt: 3 }}>
      <SectionHeader
        title={`Upload queue (${items.length})`}
        action={
          hasCompleted ? (
            <SecondaryButton size="small" onClick={onClearCompleted}>
              Clear completed
            </SecondaryButton>
          ) : undefined
        }
      />
      <Stack spacing={1.5}>
        {items.map((item) => (
          <UploadQueueItemRow
            key={item.id}
            item={item}
            onRetry={onRetry}
            onRemove={onRemove}
          />
        ))}
      </Stack>
    </Box>
  );
}
