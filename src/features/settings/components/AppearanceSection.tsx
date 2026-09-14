import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export function AppearanceSection() {
  return (
    <Stack direction="row" sx={{ alignItems: "center", gap: 1.5 }}>
      <Chip label="Cinematic Dark" color="primary" size="small" />
      <Typography variant="body2" color="textSecondary">
        Memora is designed as a dark, cinematic experience for your memories.
      </Typography>
    </Stack>
  );
}
