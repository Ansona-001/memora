import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

import { IconActionButton } from "@/components/buttons/IconActionButton";

import { useLogout } from "../hooks/useLogout";

export function LogoutButton() {
  const logout = useLogout();

  return (
    <IconActionButton
      label="Log out"
      onClick={() => logout.mutate()}
      disabled={logout.isPending}
    >
      <LogoutRoundedIcon fontSize="small" />
    </IconActionButton>
  );
}
