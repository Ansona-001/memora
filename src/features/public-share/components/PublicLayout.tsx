import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";

import { wordmarkFontFamily } from "@/theme/typography";

interface PublicLayoutProps {
  children: React.ReactNode;
}

// Deliberately minimal: no auth chrome, no bottom nav — this is what a
// visitor with no Memora account sees.
export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <Box sx={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <Box
        component="header"
        sx={{
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          component={RouterLink}
          to="/"
          variant="h6"
          sx={{
            color: "primary.light",
            fontFamily: wordmarkFontFamily,
            fontSize: "1.5rem",
            textDecoration: "none",
          }}
        >
          Memora
        </Typography>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
        {children}
      </Box>
    </Box>
  );
}
