import IconButton, { type IconButtonProps } from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import type { ElementType } from "react";

interface IconActionButtonProps extends IconButtonProps {
  label: string;
  // MUI's IconButton is polymorphic via `component`, but IconButtonProps
  // (unparameterized) doesn't include component-specific props like
  // react-router's `to`. Accept them loosely here rather than making every
  // call site instantiate the generic just to render as a Link.
  component?: ElementType;
  to?: string;
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
