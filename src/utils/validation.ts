import { UPLOAD_LIMITS } from "@/config/uploadLimits";
import { isPhotoFile, isVideoFile } from "@/utils/fileUtils";

export function validateUploadFile(file: File): string | null {
  if (isPhotoFile(file)) {
    if (file.size > UPLOAD_LIMITS.maxPhotoSizeBytes) {
      return `Photos must be under ${UPLOAD_LIMITS.maxPhotoSizeBytes / (1024 * 1024)}MB.`;
    }
    return null;
  }

  if (isVideoFile(file)) {
    if (file.size > UPLOAD_LIMITS.maxVideoSizeBytes) {
      return `Videos must be under ${UPLOAD_LIMITS.maxVideoSizeBytes / (1024 * 1024)}MB.`;
    }
    return null;
  }

  return "Unsupported file type. Upload a JPEG, PNG, WEBP, MP4, MOV, or WEBM file.";
}

export function validateVideoDuration(durationSeconds: number): string | null {
  if (durationSeconds > UPLOAD_LIMITS.maxVideoDurationSeconds) {
    return `Videos must be under ${UPLOAD_LIMITS.maxVideoDurationSeconds / 60} minutes long.`;
  }

  return null;
}
