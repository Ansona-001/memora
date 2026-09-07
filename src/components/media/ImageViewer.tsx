import Box from "@mui/material/Box";
import { useState } from "react";

interface ImageViewerProps {
  src: string;
  alt: string;
}

const ZOOMED_SCALE = 2.5;

export function ImageViewer({ src, alt }: ImageViewerProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [origin, setOrigin] = useState("center center");

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        cursor: isZoomed ? "zoom-out" : "zoom-in",
      }}
      onClick={(event) => {
        if (!isZoomed) {
          const rect = event.currentTarget.getBoundingClientRect();
          const x = ((event.clientX - rect.left) / rect.width) * 100;
          const y = ((event.clientY - rect.top) / rect.height) * 100;
          setOrigin(`${x}% ${y}%`);
        }
        setIsZoomed((zoomed) => !zoomed);
      }}
    >
      <Box
        component="img"
        src={src}
        alt={alt}
        sx={{
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
          transformOrigin: origin,
          transform: isZoomed ? `scale(${ZOOMED_SCALE})` : "scale(1)",
          transition: "transform 0.2s ease",
        }}
      />
    </Box>
  );
}
