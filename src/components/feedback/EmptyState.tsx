import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  /**
   * Heading level for the title element. Defaults to "h2" since this is
   * typically the primary content beneath a page's own h1.
   */
  level?: "h1" | "h2" | "h3";
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  level = "h2",
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 1.5,
        py: 8,
        px: 3,
      }}
    >
      {icon}
      <Typography variant="h6" component={level} color="textPrimary">
        {title}
      </Typography>
      {description ? (
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ maxWidth: 360 }}
        >
          {description}
        </Typography>
      ) : null}
      {action}
    </Box>
  );
}
