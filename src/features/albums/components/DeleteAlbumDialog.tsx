import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { SecondaryButton } from "@/components/buttons/SecondaryButton";

interface DeleteAlbumDialogProps {
  open: boolean;
  albumTitle: string;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteAlbumDialog({
  open,
  albumTitle,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteAlbumDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete &quot;{albumTitle}&quot;?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          This removes the album. Its memories stay in your couple space, just
          no longer grouped together.
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
