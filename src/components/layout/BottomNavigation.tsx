import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useLocation, useNavigate } from "react-router-dom";

import { UserAvatar } from "@/components/media/UserAvatar";
import { ROUTES } from "@/constants/routes";
import { primaryNavigation } from "@/config/navigation";
import { useProfile } from "@/features/profile/hooks/useProfile";

function NavIcon({
  path,
  Icon,
  isActive,
}: {
  path: string;
  Icon: (typeof primaryNavigation)[number]["icon"];
  isActive: boolean;
}) {
  const { data: profile } = useProfile();

  if (path === ROUTES.profile && profile) {
    return (
      <UserAvatar
        avatarPath={profile.avatar_path}
        displayName={profile.display_name}
        sx={{
          width: 22,
          height: 22,
          fontSize: 12,
          border: isActive ? 1.5 : 0,
          borderColor: "primary.main",
        }}
      />
    );
  }

  return <Icon fontSize="small" />;
}

export function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const uploadItem = primaryNavigation.find(
    (item) => item.path === ROUTES.upload,
  );
  const tabItems = primaryNavigation.filter(
    (item) => item.path !== ROUTES.upload,
  );

  return (
    <Paper
      component="nav"
      aria-label="Primary"
      elevation={0}
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-around",
        borderTop: 1,
        borderColor: "divider",
        px: 1,
        pb: "calc(4px + env(safe-area-inset-bottom, 0px))",
        zIndex: (theme) => theme.zIndex.appBar,
      }}
    >
      {tabItems.slice(0, 2).map(({ label, path, icon: Icon }) => {
        const isActive = location.pathname.startsWith(path);
        return (
          <Box
            key={path}
            component="button"
            onClick={() => navigate(path)}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0.25,
              py: 1,
              px: 1.5,
              border: "none",
              backgroundColor: "transparent",
              color: isActive ? "primary.light" : "text.secondary",
              cursor: "pointer",
            }}
          >
            <NavIcon path={path} Icon={Icon} isActive={isActive} />
            <Typography variant="caption">{label}</Typography>
          </Box>
        );
      })}

      {uploadItem ? (
        <Box
          component="button"
          aria-label={uploadItem.label}
          onClick={() => navigate(uploadItem.path)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 52,
            height: 52,
            mt: -2.5,
            borderRadius: "50%",
            border: "none",
            backgroundColor: "primary.main",
            // Not text.primary: this button's red background is the same
            // in both color schemes, but text.primary flips from white to
            // near-black in light mode, which would put a near-invisible
            // dark icon on the red circle. primary.contrastText is MUI's
            // auto-computed readable color against primary.main itself.
            color: "primary.contrastText",
            boxShadow: 4,
            cursor: "pointer",
          }}
        >
          <uploadItem.icon sx={{ fontSize: 30 }} />
        </Box>
      ) : null}

      {tabItems.slice(2).map(({ label, path, icon: Icon }) => {
        const isActive = location.pathname.startsWith(path);
        return (
          <Box
            key={path}
            component="button"
            onClick={() => navigate(path)}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0.25,
              py: 1,
              px: 1.5,
              border: "none",
              backgroundColor: "transparent",
              color: isActive ? "primary.light" : "text.secondary",
              cursor: "pointer",
            }}
          >
            <NavIcon path={path} Icon={Icon} isActive={isActive} />
            <Typography variant="caption">{label}</Typography>
          </Box>
        );
      })}
    </Paper>
  );
}
