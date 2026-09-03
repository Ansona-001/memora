import MuiBottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import { useLocation, useNavigate } from "react-router-dom";

import { primaryNavigation } from "@/config/navigation";

export function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const activeIndex = primaryNavigation.findIndex((item) =>
    location.pathname.startsWith(item.path),
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
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <MuiBottomNavigation
        showLabels
        value={activeIndex === -1 ? 0 : activeIndex}
        onChange={(_event, newIndex: number) => {
          const target = primaryNavigation[newIndex];
          if (target) {
            navigate(target.path);
          }
        }}
      >
        {primaryNavigation.map(({ label, icon: Icon }) => (
          <BottomNavigationAction key={label} label={label} icon={<Icon />} />
        ))}
      </MuiBottomNavigation>
    </Paper>
  );
}
