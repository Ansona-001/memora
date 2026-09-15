import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import Stack from "@mui/material/Stack";
import { useColorScheme } from "@mui/material/styles";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";

export function AppearanceSection() {
  const { mode, setMode } = useColorScheme();

  return (
    <Stack spacing={1.5}>
      <ToggleButtonGroup
        value={mode ?? "dark"}
        exclusive
        size="small"
        onChange={(_, next: "light" | "dark" | null) => {
          if (next) setMode(next);
        }}
        aria-label="Color theme"
      >
        <ToggleButton value="dark" aria-label="Dark mode">
          <DarkModeRoundedIcon fontSize="small" sx={{ mr: 1 }} />
          Dark
        </ToggleButton>
        <ToggleButton value="light" aria-label="Light mode">
          <LightModeRoundedIcon fontSize="small" sx={{ mr: 1 }} />
          Light
        </ToggleButton>
      </ToggleButtonGroup>
      <Typography variant="body2" color="textSecondary">
        Dark is the cinematic default; switch to light whenever you'd
        rather browse your memories on a bright background.
      </Typography>
    </Stack>
  );
}
