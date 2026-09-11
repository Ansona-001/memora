import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

import { useUiStore } from "@/stores/uiStore";

export function MediaPreferencesSection() {
  const autoplayVideos = useUiStore((state) => state.autoplayVideos);
  const setAutoplayVideos = useUiStore((state) => state.setAutoplayVideos);

  return (
    <FormControlLabel
      control={
        <Switch
          checked={autoplayVideos}
          onChange={(event) => setAutoplayVideos(event.target.checked)}
        />
      }
      label="Autoplay videos when opened"
    />
  );
}
