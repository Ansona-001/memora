import { createTheme } from "@mui/material/styles";

import { colors } from "./colors";
import { components } from "./components";
import { radius, spacingBaseUnit } from "./spacing";
import { typography } from "./typography";

export const theme = createTheme({
  colorSchemes: { dark: true, light: false },
  spacing: spacingBaseUnit,
  shape: { borderRadius: radius.md },
  typography,
  components,
  palette: {
    mode: "dark",
    primary: {
      main: colors.brand.primary,
      light: colors.brand.secondary,
    },
    background: {
      default: colors.background.primary,
      paper: colors.background.secondary,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
      disabled: colors.text.disabled,
    },
    divider: colors.border.subtle,
    success: { main: colors.state.success },
    warning: { main: colors.state.warning },
    error: { main: colors.state.error },
  },
});
