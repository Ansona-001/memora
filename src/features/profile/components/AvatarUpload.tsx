import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useRef } from "react";

import { IconActionButton } from "@/components/buttons/IconActionButton";
import { UserAvatar } from "@/components/media/UserAvatar";

import { useUploadAvatar } from "../hooks/useUploadAvatar";

interface AvatarUploadProps {
  avatarPath: string | null | undefined;
  displayName: string;
}

export function AvatarUpload({ avatarPath, displayName }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadAvatar = useUploadAvatar();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) {
      uploadAvatar.mutate(file);
    }
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
    </Box>
  );
}
