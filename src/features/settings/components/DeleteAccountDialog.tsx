import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useState } from "react";

import { AppAlert } from "@/components/feedback/AppAlert";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { getErrorMessage } from "@/utils/errorUtils";

const CONFIRM_TEXT = "DELETE";

interface DeleteAccountDialogProps {
  open: boolean;
  isDeleting: boolean;
  error: unknown;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteAccountDialog({
  open,
  isDeleting,
  error,
  onClose,
  onConfirm,
}: DeleteAccountDialogProps) {
  const [confirmText, setConfirmText] = useState("");

  const handleClose = () => {
    setConfirmText("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete your account?</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          This permanently deletes your account and profile. If you're the only
          member of your couple space, all of its memories and albums are
          deleted too. If your partner is still there, they keep the shared
          space. This cannot be undone.
        </DialogContentText>

        {error ? (
          <AppAlert severity="error" sx={{ mb: 2 }}>
            {getErrorMessage(error)}
          </AppAlert>
        ) : null}

        <TextField
          fullWidth
          label={`Type ${CONFIRM_TEXT} to confirm`}
          value={confirmText}
          onChange={(event) => setConfirmText(event.target.value)}
          autoComplete="off"
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <SecondaryButton onClick={handleClose}>Cancel</SecondaryButton>
        <Button
          color="error"
          variant="contained"
          disabled={isDeleting || confirmText !== CONFIRM_TEXT}
          onClick={onConfirm}
        >
          Delete account
        </Button>
      </DialogActions>
    </Dialog>
  );
}
