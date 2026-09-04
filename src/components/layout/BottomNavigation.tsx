import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useLocation, useNavigate } from "react-router-dom";

import { ROUTES } from "@/constants/routes";
import { primaryNavigation } from "@/config/navigation";

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
              color: isActive ? "primary.main" : "text.secondary",
              cursor: "pointer",
            }}
          >
            <Icon fontSize="small" />
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
            color: "text.primary",
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
              color: isActive ? "primary.main" : "text.secondary",
              cursor: "pointer",
            }}
          >
            <Icon fontSize="small" />
            <Typography variant="caption">{label}</Typography>
          </Box>
        );
      })}
    </Paper>
  );
}
