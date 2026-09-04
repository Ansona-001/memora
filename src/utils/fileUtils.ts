import { UPLOAD_LIMITS } from "@/config/uploadLimits";

export function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(1)} ${units[unitIndex]}`;
}

export function getFileExtension(file: File): string {
  const fromName = file.name.split(".").pop();
  if (fromName && fromName !== file.name) {
    return fromName.toLowerCase();
  }

  return file.type.split("/")[1] ?? "bin";
}

export function isPhotoFile(file: File): boolean {
  return (UPLOAD_LIMITS.acceptedPhotoTypes as readonly string[]).includes(
    file.type,
  );
}

export function isVideoFile(file: File): boolean {
  return (UPLOAD_LIMITS.acceptedVideoTypes as readonly string[]).includes(
    file.type,
  );
}
