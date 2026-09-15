// Romantic red/pink palette matching the logo's heart mark — deliberately
// no purple or blue anywhere, per direct feedback on the earlier version.
// Split into a `dark` and `light` scheme so the app can offer a real
// light/dark mode switch (see theme.ts's colorSchemes) rather than just
// inverting one hardcoded palette.
export const colors = {
  dark: {
    background: {
      default: "#09090B",
      paper: "#111115",
      elevated: "#19191F",
    },
    text: {
      primary: "#FAFAFA",
      secondary: "#A1A1AA",
      disabled: "#71717A",
    },
    border: {
      subtle: "rgba(255, 255, 255, 0.08)",
      strong: "rgba(255, 255, 255, 0.16)",
    },
    // Lightened further than a purely visual tint would need, so
    // brand-colored text (active nav labels, inline links) meets WCAG AA
    // contrast (4.5:1) against this scheme's dark background.
    primaryText: "#FFB3C7",
    accentText: "#FFD6E3",
    state: {
      success: "#51CF66",
      warning: "#FCC419",
      error: "#FF6B6B",
    },
  },
  light: {
    background: {
      default: "#FFF8F9",
      paper: "#FFFFFF",
      elevated: "#FFFFFF",
    },
    text: {
      primary: "#18181B",
      secondary: "#52525B",
      disabled: "#A1A1AA",
    },
    border: {
      subtle: "rgba(0, 0, 0, 0.08)",
      strong: "rgba(0, 0, 0, 0.16)",
    },
    // Darkened (mirroring dark mode's lightened variants) so brand-colored
    // text meets WCAG AA contrast against this scheme's light background —
    // the same pastel tints used for dark mode would be nearly invisible
    // on white.
    primaryText: "#9F1239",
    accentText: "#C81E4F",
    state: {
      success: "#1E7A33",
      warning: "#B45309",
      error: "#C92A2A",
    },
  },

  // Shared across both schemes — vivid enough to work as a button fill
  // (with auto-computed contrastText) on either background.
  brand: {
    primary: "#E11D48",
    accent: "#FF6B9D",
  },
} as const;
