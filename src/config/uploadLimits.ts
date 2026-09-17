export const UPLOAD_LIMITS = {
  maxPhotoSizeBytes: 15 * 1024 * 1024,
  maxVideoSizeBytes: 100 * 1024 * 1024,
  maxVideoDurationSeconds: 300,
  maxFilesPerUpload: 20,
  acceptedPhotoTypes: ["image/jpeg", "image/png", "image/webp"],
  acceptedVideoTypes: ["video/mp4", "video/webm", "video/quicktime"],
} as const;

export type AcceptedMediaType =
  | (typeof UPLOAD_LIMITS.acceptedPhotoTypes)[number]
  | (typeof UPLOAD_LIMITS.acceptedVideoTypes)[number];
