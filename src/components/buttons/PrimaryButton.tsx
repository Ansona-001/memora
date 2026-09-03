import Button, { type ButtonProps } from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

interface PrimaryButtonProps extends ButtonProps {
  isLoading?: boolean;
}

export function PrimaryButton({
  isLoading = false,
  disabled,
  children,
  ...buttonProps
}: PrimaryButtonProps) {
  return (
    <Button
      variant="contained"
      color="primary"
      disabled={disabled ?? isLoading}
      startIcon={
        isLoading ? <CircularProgress size={16} color="inherit" /> : undefined
      }
      {...buttonProps}
    >
      {children}
    </Button>
  );
}
