export function buildMemoryMediaPath(
  coupleSpaceId: string,
  memoryId: string,
  extension: string,
  capturedAt: Date = new Date(),
): string {
  const year = capturedAt.getFullYear();
  const month = String(capturedAt.getMonth() + 1).padStart(2, "0");

  return `${coupleSpaceId}/${year}/${month}/${memoryId}.${extension}`;
}

export function buildMemoryThumbnailPath(
  coupleSpaceId: string,
  memoryId: string,
): string {
  return `${coupleSpaceId}/${memoryId}.webp`;
}

export function buildAvatarPath(userId: string): string {
  return `${userId}/avatar.webp`;
}
