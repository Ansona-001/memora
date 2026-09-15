import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";

import { useAiPreference } from "@/features/ai/hooks/useAiSuggestion";

export function AiSettingsSection() {
  const { aiEnabled, setAiEnabled } = useAiPreference();

  return (
    <>
      <FormControlLabel
        control={
          <Switch
            checked={aiEnabled}
            onChange={(_, checked) => setAiEnabled(checked)}
          />
        }
        label="AI photo suggestions"
      />
      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
        When on, Memora tags photos on this device and enables searching by
        what's in a photo, not just its title. Photos never leave your
        device for AI, nothing costs extra, and uploads work the same with
        it off.
      </Typography>
    </>
  );
}
