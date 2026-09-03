import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import { LogoutButton } from "@/features/authentication/components/LogoutButton";

export function AppHeader() {
  return (
    <AppBar position="sticky" color="transparent" elevation={0}>
      <Toolbar>
        <Typography variant="h6" component="span" color="primary.main">
          Memora
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <LogoutButton />
      </Toolbar>
    </AppBar>
  );
}
