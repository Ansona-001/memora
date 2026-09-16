import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { AppAlert } from "@/components/feedback/AppAlert";
import { useLogout } from "@/features/authentication/hooks/useLogout";
import { useLogoutAllDevices } from "@/features/authentication/hooks/useLogoutAllDevices";
import { getErrorMessage } from "@/utils/errorUtils";

export function LogoutSection() {
  const logout = useLogout();
  const logoutAllDevices = useLogoutAllDevices();

  return (
    <Stack spacing={1.5}>
      <Typography variant="subtitle2">Log out</Typography>

      {logoutAllDevices.isError ? (
        <AppAlert severity="error">
          {getErrorMessage(logoutAllDevices.error)}
        </AppAlert>
      ) : null}

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
        <SecondaryButton
          onClick={() => logout.mutate()}
          disabled={logout.isPending || logoutAllDevices.isPending}
        >
          Log out
        </SecondaryButton>
        <SecondaryButton
          color="error"
          onClick={() => logoutAllDevices.mutate()}
          disabled={logout.isPending || logoutAllDevices.isPending}
        >
          Log out of all devices
        </SecondaryButton>
      </Stack>
    </Stack>
  );
}
