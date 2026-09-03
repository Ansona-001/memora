import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { NavLink } from "react-router-dom";

import { primaryNavigation } from "@/config/navigation";

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
    </Box>
  );
}
