import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { AiSettingsSection } from "@/features/ai/components/AiSettingsSection";

export function PrivacySection() {
  return (
    <Stack spacing={2}>
      <Typography variant="body2" color="textSecondary">
        Your memories are private by default. Only you and your paired partner
        can ever view, download, or manage what's in your couple space - nothing
        is shared or discoverable beyond the two of you.
      </Typography>
      <AiSettingsSection />
    </Stack>
  );
}
