import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";

import type { Memory } from "@/types/media";
import { formatBytes } from "@/utils/fileUtils";

interface MemoryMetadataPanelProps {
  memory: Memory;
}

export function MemoryMetadataPanel({ memory }: MemoryMetadataPanelProps) {
  const details = [
    dayjs(memory.captured_at).format("MMMM D, YYYY [at] h:mm A"),
    memory.width && memory.height ? `${memory.width} × ${memory.height}` : null,
    memory.duration_seconds ? `${Math.round(memory.duration_seconds)}s` : null,
    formatBytes(memory.file_size_bytes),
  ].filter(Boolean);

  return (
    <Stack spacing={0.5}>
      {memory.title ? (
        <Typography variant="h6">{memory.title}</Typography>
      ) : null}
      <Typography variant="body2" color="text.secondary">
        {details.join(" · ")}
      </Typography>
    </Stack>
  );
}
