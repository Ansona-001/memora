import type { ThemeOptions } from "@mui/material/styles";

import { colors } from "./colors";
import { radius } from "./spacing";

export const components: ThemeOptions["components"] = {
  MuiCssBaseline: {
    styleOverrides: {
      "html, body, #root": {
        maxWidth: "100%",
        overflowX: "hidden",
        // A percentage height chain (rather than 100vh) tracks the actual
        // visible viewport as mobile browser toolbars show/hide, so fixed
        // bottom navigation doesn't end up positioned off-screen.
        height: "100%",
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: radius.pill,
        paddingInline: 24,
        paddingBlock: 10,
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: "none",
        borderRadius: radius.lg,
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        backgroundColor: colors.background.elevated,
        borderRadius: radius.lg,
        border: `1px solid ${colors.border.subtle}`,
      },
    },
  },
  MuiTextField: {
    defaultProps: {
      variant: "outlined",
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundColor: colors.background.primary,
        backgroundImage: "none",
        boxShadow: "none",
        borderBottom: `1px solid ${colors.border.subtle}`,
      },
    },
  },
};
