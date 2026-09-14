import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100%",
        px: 2,
      }}
    >
      <Typography
        component="h1"
        variant="h4"
        sx={{ mb: 4, color: "primary.light" }}
      >
        Memora
      </Typography>
      <Box sx={{ width: "100%", maxWidth: 400 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
