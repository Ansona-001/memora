import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { SecondaryButton } from "@/components/buttons/SecondaryButton";

interface DeleteMemoryDialogProps {
  open: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteMemoryDialog({
  open,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteMemoryDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete this memory?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          This permanently removes the photo or video for both of you. This
          can&apos;t be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
        <Button
          color="error"
          variant="contained"
          disabled={isDeleting}
          onClick={onConfirm}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
