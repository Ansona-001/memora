import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";

import { IconActionButton } from "@/components/buttons/IconActionButton";
import { AppAlert } from "@/components/feedback/AppAlert";

interface ShareAlbumDialogProps {
  open: boolean;
  albumTitle: string;
  isPublic: boolean;
  shareUrl: string;
  isSaving: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onToggle: (nextIsPublic: boolean) => void;
}

export function ShareAlbumDialog({
  open,
  albumTitle,
  isPublic,
  shareUrl,
  isSaving,
  errorMessage,
  onClose,
  onToggle,
}: ShareAlbumDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Share &quot;{albumTitle}&quot;</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {errorMessage ? (
            <AppAlert severity="error">{errorMessage}</AppAlert>
          ) : null}

          <FormControlLabel
            control={
              <Switch
                checked={isPublic}
                disabled={isSaving}
                onChange={(_, checked) => onToggle(checked)}
              />
            }
            label="Anyone with the link can view"
          />
          <Typography variant="body2" color="textSecondary">
            No account or login needed. Turning this off immediately hides
            the album from anyone who isn't a couple member, even if they
            have the link.
          </Typography>

          {isPublic ? (
            <Stack direction="row" spacing={1}>
              <TextField
                value={shareUrl}
                fullWidth
                size="small"
                slotProps={{ input: { readOnly: true } }}
              />
              <IconActionButton label="Copy link" onClick={handleCopy}>
                <ContentCopyRoundedIcon fontSize="small" />
              </IconActionButton>
            </Stack>
          ) : null}
          {copied ? (
            <Typography variant="caption" color="success.main">
              Link copied.
            </Typography>
          ) : null}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
