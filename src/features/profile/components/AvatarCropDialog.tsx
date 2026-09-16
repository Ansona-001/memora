import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { useState } from "react";
import Cropper, { type Area } from "react-easy-crop";

import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";

interface AvatarCropDialogProps {
  open: boolean;
  imageSrc: string;
  isSaving: boolean;
  onClose: () => void;
  onConfirm: (cropArea: Area) => void;
}

export function AvatarCropDialog({
  open,
  imageSrc,
  isSaving,
  onClose,
  onConfirm,
}: AvatarCropDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);

  const handleConfirm = () => {
    if (croppedArea) {
      onConfirm(croppedArea);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Adjust photo</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            aspectRatio: "1 / 1",
            bgcolor: "common.black",
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, areaPixels) => setCroppedArea(areaPixels)}
          />
        </Box>
        <Box sx={{ px: 1, pt: 3 }}>
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.01}
            aria-label="Zoom"
            onChange={(_, value) => setZoom(value as number)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={onClose} disabled={isSaving}>
          Cancel
        </SecondaryButton>
        <PrimaryButton
          onClick={handleConfirm}
          isLoading={isSaving}
          disabled={!croppedArea}
        >
          Save
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
}
