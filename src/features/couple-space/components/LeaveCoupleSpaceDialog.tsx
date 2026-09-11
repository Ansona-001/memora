import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { SecondaryButton } from "@/components/buttons/SecondaryButton";

interface LeaveCoupleSpaceDialogProps {
  open: boolean;
  spaceName: string;
  hasPartner: boolean;
  isLeaving: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LeaveCoupleSpaceDialog({
  open,
  spaceName,
  hasPartner,
  isLeaving,
  onClose,
  onConfirm,
}: LeaveCoupleSpaceDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Leave &quot;{spaceName}&quot;?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {hasPartner
            ? "You'll lose access to this couple space and its shared memories. Your partner keeps everything."
            : "You are the only member, so this deletes the couple space and every memory and album in it. This cannot be undone."}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
        <Button
          color="error"
          variant="contained"
          disabled={isLeaving}
          onClick={onConfirm}
        >
          Leave
        </Button>
      </DialogActions>
    </Dialog>
  );
}
