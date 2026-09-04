import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";

import type { UploadStatus } from "@/types/media";

const STATUS_LABELS: Record<UploadStatus, string> = {
  queued: "Queued",
  processing: "Processing",
  uploading: "Uploading",
  success: "Uploaded",
  error: "Failed",
};

interface UploadProgressProps {
  status: UploadStatus;
  progress: number;
}

export function UploadProgress({ status, progress }: UploadProgressProps) {
  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgress
        variant={status === "queued" ? "indeterminate" : "determinate"}
        value={progress}
        color={status === "error" ? "error" : "primary"}
        sx={{ borderRadius: 1, height: 6 }}
      />
      <Typography variant="caption" color="text.secondary">
        {STATUS_LABELS[status]}
      </Typography>
    </Box>
  );
}
