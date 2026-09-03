import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { SecondaryButton } from "@/components/buttons/SecondaryButton";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  description = "Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <Box
      role="alert"
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
      <Typography variant="h6" color="error.main">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
        {description}
      </Typography>
      {onRetry ? (
        <SecondaryButton onClick={onRetry}>Try again</SecondaryButton>
      ) : null}
    </Box>
  );
}
