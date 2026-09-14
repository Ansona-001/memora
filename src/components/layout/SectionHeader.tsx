import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  action?: ReactNode;
  /**
   * Heading level for the title element. Defaults to "h2" for sub-section
   * headers (e.g. a home row, a queue). Pass "h1" when this is a page's
   * primary heading so the page has exactly one.
   */
  level?: "h1" | "h2";
}

export function SectionHeader({
  title,
  action,
  level = "h2",
}: SectionHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 2,
      }}
    >
      <Typography variant="h5" component={level}>
        {title}
      </Typography>
      {action}
    </Box>
  );
}
