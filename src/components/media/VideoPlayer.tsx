import Box from "@mui/material/Box";
import { useEffect, useRef } from "react";

interface VideoPlayerProps {
  src: string;
  startTimeSeconds?: number;
  onProgress?: (currentTimeSeconds: number, durationSeconds: number) => void;
}

const SAVE_INTERVAL_MS = 5000;

export function VideoPlayer({
  src,
  startTimeSeconds = 0,
  onProgress,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const onProgressRef = useRef(onProgress);

  useEffect(() => {
    onProgressRef.current = onProgress;
  }, [onProgress]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const handleLoadedMetadata = () => {
      if (startTimeSeconds > 0 && startTimeSeconds < video.duration - 5) {
        video.currentTime = startTimeSeconds;
      }
    };

    const reportProgress = () => {
      if (video.duration) {
        onProgressRef.current?.(video.currentTime, video.duration);
      }
    };

    const interval = setInterval(() => {
      if (!video.paused) {
        reportProgress();
      }
    }, SAVE_INTERVAL_MS);

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("pause", reportProgress);

    return () => {
      clearInterval(interval);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("pause", reportProgress);
      reportProgress();
    };
  }, [src, startTimeSeconds]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        component="video"
        ref={videoRef}
        src={src}
        controls
        autoPlay
        sx={{ maxWidth: "100%", maxHeight: "100%" }}
      />
    </Box>
  );
}
