import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useRef, useState } from "react";
import type { Area } from "react-easy-crop";

import { IconActionButton } from "@/components/buttons/IconActionButton";
import { UserAvatar } from "@/components/media/UserAvatar";
import { getCroppedImageBlob } from "@/utils/cropImage";

import { useUploadAvatar } from "../hooks/useUploadAvatar";
import { AvatarCropDialog } from "./AvatarCropDialog";

interface AvatarUploadProps {
  avatarPath: string | null | undefined;
  displayName: string;
}

export function AvatarUpload({ avatarPath, displayName }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadAvatar = useUploadAvatar();
  const [pendingImageSrc, setPendingImageSrc] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) {
      setPendingImageSrc(URL.createObjectURL(file));
    }
  };

  const closeCropDialog = () => {
    if (pendingImageSrc) {
      URL.revokeObjectURL(pendingImageSrc);
    }
    setPendingImageSrc(null);
  };

  const handleCropConfirm = async (cropArea: Area) => {
    if (!pendingImageSrc) {
      return;
    }
    const croppedBlob = await getCroppedImageBlob(pendingImageSrc, cropArea);
    const croppedFile = new File([croppedBlob], "avatar.webp", {
      type: "image/webp",
    });
    uploadAvatar.mutate(croppedFile, { onSuccess: closeCropDialog });
  };

  return (
    <Box sx={{ position: "relative", width: "fit-content" }}>
      <UserAvatar
        avatarPath={avatarPath}
        displayName={displayName}
        sx={{ width: 96, height: 96, fontSize: 36 }}
      />

      <Box sx={{ position: "absolute", bottom: -4, right: -4 }}>
        <IconActionButton
          label="Change avatar"
          size="small"
          disabled={uploadAvatar.isPending}
          onClick={() => inputRef.current?.click()}
          sx={{
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            "&:hover": { bgcolor: "background.paper" },
          }}
        >
          {uploadAvatar.isPending ? (
            <CircularProgress size={16} />
          ) : (
            <PhotoCameraRoundedIcon fontSize="small" />
          )}
        </IconActionButton>
      </Box>

      <Box
        component="input"
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFileChange}
        sx={{ display: "none" }}
      />

      {pendingImageSrc ? (
        <AvatarCropDialog
          open
          imageSrc={pendingImageSrc}
          isSaving={uploadAvatar.isPending}
          onClose={closeCropDialog}
          onConfirm={handleCropConfirm}
        />
      ) : null}
    </Box>
  );
}
