import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useRef } from "react";

import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { useSignedUrl } from "@/hooks/useSignedUrl";

import { useUploadCoupleCover } from "../hooks/useUploadCoupleCover";

interface CoupleCoverUploadProps {
  coupleSpaceId: string;
  coverPath: string | null;
}

export function CoupleCoverUpload({
  coupleSpaceId,
  coverPath,
}: CoupleCoverUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: signedUrl } = useSignedUrl("couple-covers", coverPath);
  const uploadCover = useUploadCoupleCover(coupleSpaceId);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) {
      uploadCover.mutate(file);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          width: "100%",
          aspectRatio: "16 / 7",
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.elevated",
          backgroundImage: signedUrl ? `url(${signedUrl})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 1,
        }}
      >
        {uploadCover.isPending ? <CircularProgress size={24} /> : null}
      </Box>

      <SecondaryButton
        startIcon={<PhotoCameraRoundedIcon fontSize="small" />}
        disabled={uploadCover.isPending}
        onClick={() => inputRef.current?.click()}
      >
        Change cover
      </SecondaryButton>

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
