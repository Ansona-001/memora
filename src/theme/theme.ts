import { createTheme } from "@mui/material/styles";

import { colors } from "./colors";
import { components } from "./components";
import "./paletteAugmentation";
import { radius, spacingBaseUnit } from "./spacing";
import { typography } from "./typography";

function schemePalette(mode: "light" | "dark") {
  const scheme = colors[mode];
  return {
    mode,
    primary: {
      main: colors.brand.primary,
      light: scheme.primaryText,
    },
    secondary: {
      main: colors.brand.accent,
      light: scheme.accentText,
    },
    background: {
      default: scheme.background.default,
      paper: scheme.background.paper,
      elevated: scheme.background.elevated,
    },
    text: {
      primary: scheme.text.primary,
      secondary: scheme.text.secondary,
      disabled: scheme.text.disabled,
    },
    divider: scheme.border.subtle,
    success: { main: scheme.state.success },
    warning: { main: scheme.state.warning },
    error: { main: scheme.state.error },
  } as const;
}

export const theme = createTheme({
  cssVariables: { colorSchemeSelector: "data" },
  colorSchemes: {
    dark: { palette: schemePalette("dark") },
    light: { palette: schemePalette("light") },
  },
  defaultColorScheme: "dark",
  spacing: spacingBaseUnit,
  shape: { borderRadius: radius.md },
  typography,
  components,
});
