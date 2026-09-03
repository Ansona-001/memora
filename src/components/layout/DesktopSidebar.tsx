import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { NavLink } from "react-router-dom";

import { primaryNavigation } from "@/config/navigation";
import { LogoutButton } from "@/features/authentication/components/LogoutButton";

export function DesktopSidebar() {
  return (
    <Box
      component="nav"
      aria-label="Primary"
      sx={{
        width: 240,
        flexShrink: 0,
        borderRight: 1,
        borderColor: "divider",
        py: 3,
        px: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h6" color="primary.main" sx={{ px: 1, mb: 3 }}>
        Memora
      </Typography>
      <List>
        {primaryNavigation.map(({ label, path, icon: Icon }) => (
          <ListItemButton
            key={path}
            component={NavLink}
            to={path}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              "&.active": {
                backgroundColor: "action.selected",
                color: "primary.main",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Icon />
            </ListItemIcon>
            <ListItemText primary={label} />
          </ListItemButton>
        ))}
      </List>
      <Box
        sx={{
          mt: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Account
        </Typography>
        <LogoutButton />
      </Box>
    </Box>
  );
}
