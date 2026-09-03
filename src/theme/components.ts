import type { ThemeOptions } from "@mui/material/styles";

import { colors } from "./colors";
import { radius } from "./spacing";

export const components: ThemeOptions["components"] = {
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
