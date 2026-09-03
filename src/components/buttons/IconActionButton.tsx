import IconButton, { type IconButtonProps } from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

interface IconActionButtonProps extends IconButtonProps {
  label: string;
}

export function IconActionButton({
  label,
  children,
  ...iconButtonProps
}: IconActionButtonProps) {
  return (
    <Tooltip title={label}>
      <IconButton aria-label={label} {...iconButtonProps}>
        {children}
      </IconButton>
    </Tooltip>
  );
}
