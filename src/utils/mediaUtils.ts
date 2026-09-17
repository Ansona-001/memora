import imageCompression from "browser-image-compression";
import { parse as parseExif } from "exifr";

/**
 * Reads the original capture date from a photo's EXIF metadata (the
 * DateTimeOriginal/CreateDate tags most cameras and phones write). Must be
 * called on the original file before compression, which strips EXIF data.
 * Returns null for formats without EXIF (PNG, most WEBP) or photos with no
 * embedded date (screenshots, edited images), so callers can fall back to
 * upload time.
 */
export async function getPhotoCapturedAt(file: File): Promise<Date | null> {
  try {
    const exifData = await parseExif(file, ["DateTimeOriginal", "CreateDate"]);
    const capturedAt = exifData?.DateTimeOriginal ?? exifData?.CreateDate;
    return capturedAt instanceof Date ? capturedAt : null;
  } catch {
    return null;
  }
}

/**
 * Compresses a full-resolution photo before upload. Encodes to WEBP rather
 * than keeping the original format - at matched visual quality WEBP runs
 * noticeably smaller than JPEG/PNG, so this cuts upload and viewing load
 * time without a visible quality drop. Callers must treat the output as
 * WEBP for storage path/extension purposes, since it no longer matches the
 * input file's format.
 */
export async function compressImageFile(file: File): Promise<File> {
  return imageCompression(file, {
    maxSizeMB: 1.5,
    maxWidthOrHeight: 2560,
    useWebWorker: true,
    fileType: "image/webp",
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

/**
 * Compresses an image for a small profile-style display (avatar or couple
 * space cover) - larger than a grid thumbnail but far smaller than a full
 * memory photo.
 */
export async function compressProfileImage(file: File): Promise<Blob> {
  return imageCompression(file, {
    maxSizeMB: 0.3,
    maxWidthOrHeight: 512,
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
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    // Some browsers only reliably decode/paint frames for video elements
    // that are actually in the document, not just constructed in memory.
    // Position it off-screen rather than display:none, which can also
    // suppress rendering.
    video.style.position = "fixed";
    video.style.left = "-9999px";
    video.style.width = "1px";
    video.style.height = "1px";
    document.body.appendChild(video);

    const cleanup = () => {
      URL.revokeObjectURL(objectUrl);
      video.remove();
    };

    const captureFrame = () => {
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

    video.onloadedmetadata = () => {
      video.currentTime = Math.min(1, video.duration / 2);
    };

    video.onseeked = () => {
      // The 'seeked' event can fire slightly before the browser has
      // actually decoded and painted that frame, which produces a blank
      // canvas capture. A couple of animation-frame ticks reliably waits
      // for the real pixel data to be ready.
      requestAnimationFrame(() => requestAnimationFrame(captureFrame));
    };

    video.onerror = () => {
      cleanup();
      reject(new Error("Could not load the video for thumbnailing."));
    };

    video.src = objectUrl;
  });
}
