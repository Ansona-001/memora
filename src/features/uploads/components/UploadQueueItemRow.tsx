import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { IconActionButton } from "@/components/buttons/IconActionButton";
import { UploadProgress } from "@/components/feedback/UploadProgress";
import type { UploadQueueItem } from "@/types/media";
import { formatBytes } from "@/utils/fileUtils";

interface UploadQueueItemRowProps {
  item: UploadQueueItem;
  onRetry: (id: string) => void;
  onRemove: (id: string) => void;
}

export function UploadQueueItemRow({
  item,
  onRetry,
  onRemove,
}: UploadQueueItemRowProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 1.5,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: 1.5,
          overflow: "hidden",
          flexShrink: 0,
          backgroundColor: "background.paper",
        }}
      >
        {item.mediaType === "video" ? (
          <video
            src={item.previewUrl}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <img
            src={item.previewUrl}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
      </Box>

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography variant="body2" noWrap>
          {item.file.name}
        </Typography>
        <Typography
          variant="caption"
          color="textSecondary"
          sx={{ display: "block", mb: 0.5 }}
        >
          {formatBytes(item.file.size)}
        </Typography>

        {item.status === "error" ? (
          <Typography variant="caption" color="error">
            {item.errorMessage}
          </Typography>
        ) : (
          <UploadProgress status={item.status} progress={item.progress} />
        )}
      </Box>

      {item.status === "success" ? (
        <CheckCircleRoundedIcon color="success" />
      ) : item.status === "error" ? (
        <IconActionButton label="Retry upload" onClick={() => onRetry(item.id)}>
          <RefreshRoundedIcon fontSize="small" />
        </IconActionButton>
      ) : null}

      <IconActionButton
        label="Remove from queue"
        onClick={() => onRemove(item.id)}
        disabled={item.status === "processing" || item.status === "uploading"}
      >
        <DeleteRoundedIcon fontSize="small" />
      </IconActionButton>
    </Box>
  );
}
