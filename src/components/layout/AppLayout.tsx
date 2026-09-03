import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";

import { useIsDesktop } from "@/hooks/useMediaQuery";

import { AppHeader } from "./AppHeader";
import { BottomNavigation } from "./BottomNavigation";
import { DesktopSidebar } from "./DesktopSidebar";

export function AppLayout() {
  const isDesktop = useIsDesktop();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {isDesktop ? <DesktopSidebar /> : null}
      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        {!isDesktop ? <AppHeader /> : null}
        <Box sx={{ flexGrow: 1, pb: isDesktop ? 0 : 8 }}>
          <Outlet />
        </Box>
        {!isDesktop ? <BottomNavigation /> : null}
      </Box>
    </Box>
  );
}
