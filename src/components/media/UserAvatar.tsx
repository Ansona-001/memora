import Avatar, { type AvatarProps } from "@mui/material/Avatar";

import { useSignedUrl } from "@/hooks/useSignedUrl";

interface UserAvatarProps extends Omit<AvatarProps, "src"> {
  avatarPath: string | null | undefined;
  displayName: string;
}

function getInitial(displayName: string): string {
  return displayName.trim().charAt(0).toUpperCase() || "?";
}

export function UserAvatar({
  avatarPath,
  displayName,
  ...avatarProps
}: UserAvatarProps) {
  const { data: signedUrl } = useSignedUrl("avatars", avatarPath);

  return (
    <Avatar src={signedUrl} alt={displayName} {...avatarProps}>
      {getInitial(displayName)}
    </Avatar>
  );
}
