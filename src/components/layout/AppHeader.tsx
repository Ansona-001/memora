import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";

import { UserAvatar } from "@/components/media/UserAvatar";
import { ROUTES } from "@/constants/routes";
import { LogoutButton } from "@/features/authentication/components/LogoutButton";
import { useProfile } from "@/features/profile/hooks/useProfile";

export function AppHeader() {
  const { data: profile } = useProfile();

  return (
    <AppBar position="sticky" color="transparent" elevation={0}>
      <Toolbar>
        <Typography
          variant="h6"
          component="span"
          sx={{ color: "primary.light" }}
        >
          Memora
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        {profile ? (
          <Box
            component={RouterLink}
            to={ROUTES.profile}
            aria-label="Your profile"
            sx={{ display: "flex", mr: 1 }}
          >
            <UserAvatar
              avatarPath={profile.avatar_path}
              displayName={profile.display_name}
              sx={{ width: 32, height: 32, fontSize: 14 }}
            />
          </Box>
        ) : null}
        <LogoutButton />
      </Toolbar>
    </AppBar>
  );
}
