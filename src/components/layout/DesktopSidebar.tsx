import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { NavLink } from "react-router-dom";

import { IconActionButton } from "@/components/buttons/IconActionButton";
import { UserAvatar } from "@/components/media/UserAvatar";
import { ROUTES } from "@/constants/routes";
import { primaryNavigation } from "@/config/navigation";
import { LogoutButton } from "@/features/authentication/components/LogoutButton";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { useUiStore } from "@/stores/uiStore";
import { wordmarkFontFamily } from "@/theme/typography";

const EXPANDED_WIDTH = 240;
const COLLAPSED_WIDTH = 84;

export function DesktopSidebar() {
  const { data: profile } = useProfile();
  const isCollapsed = useUiStore((state) => state.isSidebarCollapsed);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);

  return (
    <Box
      component="nav"
      aria-label="Primary"
      sx={{
        width: isCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
        flexShrink: 0,
        borderRight: 1,
        borderColor: "divider",
        py: 3,
        px: isCollapsed ? 1 : 2,
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
        transition: (theme) =>
          theme.transitions.create(["width", "padding"], {
            duration: theme.transitions.duration.shorter,
          }),
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "space-between",
          px: 1,
          mb: 3,
        }}
      >
        {!isCollapsed ? (
          <Typography
            variant="h6"
            sx={{
              color: "primary.light",
              fontFamily: wordmarkFontFamily,
              fontSize: "1.5rem",
            }}
          >
            Memora
          </Typography>
        ) : null}
        <IconActionButton
          label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={toggleSidebar}
          size="small"
        >
          {isCollapsed ? (
            <ChevronRightRoundedIcon />
          ) : (
            <ChevronLeftRoundedIcon />
          )}
        </IconActionButton>
      </Box>
      <List>
        {primaryNavigation.map(({ label, path, icon: Icon }) => {
          const button = (
            <ListItemButton
              component={NavLink}
              to={path}
              sx={{
                borderRadius: 2,
                justifyContent: isCollapsed ? "center" : "flex-start",
                px: isCollapsed ? 1.5 : 2,
                "&.active": {
                  backgroundColor: "action.selected",
                  color: "primary.light",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: isCollapsed ? 0 : 40,
                  justifyContent: "center",
                }}
              >
                {path === ROUTES.profile && profile ? (
                  <UserAvatar
                    avatarPath={profile.avatar_path}
                    displayName={profile.display_name}
                    sx={{ width: 24, height: 24, fontSize: 13 }}
                  />
                ) : (
                  <Icon />
                )}
              </ListItemIcon>
              {!isCollapsed ? <ListItemText primary={label} /> : null}
            </ListItemButton>
          );

          return (
            <ListItem key={path} disablePadding sx={{ mb: 0.5 }}>
              {isCollapsed ? (
                <Tooltip title={label} placement="right">
                  {button}
                </Tooltip>
              ) : (
                button
              )}
            </ListItem>
          );
        })}
      </List>
      <Box
        sx={{
          mt: "auto",
          display: "flex",
          flexDirection: isCollapsed ? "column" : "row",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "space-between",
          gap: isCollapsed ? 1.5 : 0,
          px: 1,
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}
        >
          {profile ? (
            <UserAvatar
              avatarPath={profile.avatar_path}
              displayName={profile.display_name}
              sx={{ width: 28, height: 28, fontSize: 13 }}
            />
          ) : null}
          {!isCollapsed ? (
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {profile?.display_name ?? "Account"}
            </Typography>
          ) : null}
        </Box>
        <LogoutButton />
      </Box>
    </Box>
  );
}
