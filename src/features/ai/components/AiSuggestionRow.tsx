import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";

import type { AiEnrichmentStatus } from "@/types/media";

const STATUS_LABEL: Record<AiEnrichmentStatus, string> = {
  idle: "",
  pending: "AI preparing…",
  processing: "AI tagging photo…",
  success: "AI tags",
  skipped: "",
  error: "AI unavailable",
};

interface AiSuggestionRowProps {
  tags?: string[];
  status?: AiEnrichmentStatus;
}

export function AiSuggestionRow({ tags, status }: AiSuggestionRowProps) {
  if (status === "error") {
    return (
      <Typography variant="caption" color="textSecondary">
        AI suggestion unavailable — upload continues normally.
      </Typography>
    );
  }

  if (!tags || tags.length === 0) {
    if (status === "processing" || status === "pending") {
      return (
        <Typography variant="caption" color="textSecondary">
          {STATUS_LABEL[status]}
        </Typography>
      );
    }
    return null;
  }

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
      {tags.map((tag) => (
        <Chip key={tag} label={`#${tag}`} size="small" variant="outlined" />
      ))}
    </Box>
  );
}
