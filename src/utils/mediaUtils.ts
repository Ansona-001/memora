import imageCompression from "browser-image-compression";

export async function compressImageFile(file: File): Promise<File> {
  return imageCompression(file, {
    maxSizeMB: 2,
    maxWidthOrHeight: 2560,
    useWebWorker: true,
    fileType: file.type,
  });
}

export async function generatePhotoThumbnail(file: File): Promise<Blob> {
  return imageCompression(file, {
    maxSizeMB: 0.3,
    maxWidthOrHeight: 480,
    useWebWorker: true,
    fileType: "image/webp",
  });
}

export function getImageDimensions(
  file: File,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not read image dimensions."));
    };

    image.src = objectUrl;
  });
}

export interface VideoMetadata {
  durationSeconds: number;
  width: number;
  height: number;
}

export function getVideoMetadata(file: File): Promise<VideoMetadata> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;

    video.onloadedmetadata = () => {
      const metadata: VideoMetadata = {
        durationSeconds: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
      };
      URL.revokeObjectURL(objectUrl);
      resolve(metadata);
    };
    video.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not read video metadata."));
    };

    video.src = objectUrl;
  });
}

export function generateVideoThumbnail(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;

    const cleanup = () => URL.revokeObjectURL(objectUrl);

    video.onloadedmetadata = () => {
      video.currentTime = Math.min(1, video.duration / 2);
    };

    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");
      if (!context) {
        cleanup();
        reject(new Error("Could not create a canvas context."));
        return;
      }

      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          cleanup();
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Could not generate a video thumbnail."));
          }
        },
        "image/webp",
        0.85,
      );
    };

    video.onerror = () => {
      cleanup();
      reject(new Error("Could not load the video for thumbnailing."));
    };

    video.src = objectUrl;
  });
}
