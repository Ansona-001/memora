import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";

import { useIsDesktop } from "@/hooks/useMediaQuery";

import { AppHeader } from "./AppHeader";
import { BottomNavigation } from "./BottomNavigation";
import { DesktopSidebar } from "./DesktopSidebar";

export function AppLayout() {
  const isDesktop = useIsDesktop();

  return (
    <Box sx={{ display: "flex", minHeight: "100%" }}>
      {isDesktop ? <DesktopSidebar /> : null}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          minWidth: 0,
        }}
      >
        {!isDesktop ? <AppHeader /> : null}
        <Box
          sx={{
            flexGrow: 1,
            minWidth: 0,
            pb: isDesktop ? 0 : "calc(72px + env(safe-area-inset-bottom, 0px))",
          }}
        >
          <Outlet />
        </Box>
        {!isDesktop ? <BottomNavigation /> : null}
      </Box>
    </Box>
  );
}
