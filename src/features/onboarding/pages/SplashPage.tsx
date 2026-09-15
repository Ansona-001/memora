import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { wordmarkFontFamily } from "@/theme/typography";

export function SplashPage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100%",
        gap: 2,
      }}
    >
      <Typography
        variant="h3"
        sx={{
          color: "primary.light",
          fontFamily: wordmarkFontFamily,
          fontSize: "3.5rem",
        }}
      >
        Memora
      </Typography>
      <Typography variant="body1" color="textSecondary">
        Your shared memories, always close.
      </Typography>
    </Box>
  );
}
