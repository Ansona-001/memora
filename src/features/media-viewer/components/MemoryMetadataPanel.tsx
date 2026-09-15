import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
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
      <Typography variant="h6" component="h1">
        {memory.title ?? dayjs(memory.captured_at).format("MMMM D, YYYY")}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {details.join(" · ")}
      </Typography>
      {memory.ai_caption ? (
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ fontStyle: "italic", mt: 0.5 }}
        >
          {memory.ai_caption}
        </Typography>
      ) : null}
      {memory.ai_tags && memory.ai_tags.length > 0 ? (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
          {memory.ai_tags.map((tag) => (
            <Chip key={tag} label={`#${tag}`} size="small" variant="outlined" />
          ))}
        </Box>
      ) : null}
    </Stack>
  );
}
