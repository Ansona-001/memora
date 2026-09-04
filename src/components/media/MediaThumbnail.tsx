import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import Box from "@mui/material/Box";
import type { ReactNode } from "react";

const ACCENT_GRADIENTS = [
  "linear-gradient(135deg, #C92A54 0%, #6B1530 100%)",
  "linear-gradient(135deg, #F06585 0%, #A3325A 100%)",
  "linear-gradient(135deg, #4B2E83 0%, #1F1140 100%)",
  "linear-gradient(135deg, #2E6F8E 0%, #143244 100%)",
  "linear-gradient(135deg, #C9852A 0%, #6B4315 100%)",
  "linear-gradient(135deg, #2E8E6F 0%, #143C30 100%)",
];

interface MediaThumbnailProps {
  accentIndex: number;
  mediaType?: "photo" | "video";
  aspectRatio?: string;
  imageUrl?: string | null;
  children?: ReactNode;
}

export function MediaThumbnail({
  accentIndex,
  mediaType,
  aspectRatio = "16 / 10",
  imageUrl,
  children,
}: MediaThumbnailProps) {
  const gradient = ACCENT_GRADIENTS[accentIndex % ACCENT_GRADIENTS.length];

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        aspectRatio,
        borderRadius: 2,
        overflow: "hidden",
        backgroundImage: gradient,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {imageUrl ? (
        <Box
          component="img"
          src={imageUrl}
          alt=""
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : null}
      {mediaType === "video" ? (
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: "rgba(0, 0, 0, 0.45)",
          }}
        >
          <PlayArrowRoundedIcon sx={{ color: "text.primary" }} />
        </Box>
      ) : null}
      {children}
    </Box>
  );
}
