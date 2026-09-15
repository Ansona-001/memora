import type { ThemeOptions } from "@mui/material/styles";

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
      // Reference theme.vars (CSS custom properties), not a static color,
      // so this stays correct when the active color scheme changes at
      // runtime instead of only whatever scheme was active when the theme
      // object was created.
      root: ({ theme }) => ({
        backgroundColor: (theme.vars ?? theme).palette.background.elevated,
        borderRadius: radius.lg,
        border: `1px solid ${(theme.vars ?? theme).palette.divider}`,
      }),
    },
  },
  MuiTextField: {
    defaultProps: {
      variant: "outlined",
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: (theme.vars ?? theme).palette.background.default,
        backgroundImage: "none",
        boxShadow: "none",
        borderBottom: `1px solid ${(theme.vars ?? theme).palette.divider}`,
      }),
    },
  },
};
