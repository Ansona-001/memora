export const colors = {
  background: {
    primary: "#09090B",
    secondary: "#111115",
    elevated: "#19191F",
  },

  brand: {
    primary: "#C92A54",
    // Used as palette.primary.light - lightened further than a purely
    // visual tint would need, so brand-colored text (active nav labels,
    // inline links) meets WCAG AA contrast (4.5:1) against dark
    // backgrounds instead of just the button/decorative use case.
    secondary: "#F27491",
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

  state: {
    success: "#51CF66",
    warning: "#FCC419",
    error: "#FF6B6B",
  },
} as const;
