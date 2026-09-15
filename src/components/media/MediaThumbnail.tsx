import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import Box from "@mui/material/Box";
import type { ReactNode } from "react";

// Same red/pink romantic family as the app logo, so placeholder thumbnails
// read as on-brand rather than an unrelated color set.
const ACCENT_GRADIENTS = [
  "linear-gradient(135deg, #FFC2D1 0%, #E11D48 100%)",
  "linear-gradient(135deg, #FF6B9D 0%, #B91C46 100%)",
  "linear-gradient(135deg, #FF4D6D 0%, #9F1239 100%)",
  "linear-gradient(135deg, #E11D48 0%, #6B0F2A 100%)",
  "linear-gradient(135deg, #FFB3C7 0%, #C81E4F 100%)",
  "linear-gradient(135deg, #F4436C 0%, #7A1230 100%)",
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
