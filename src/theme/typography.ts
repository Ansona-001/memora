import type { ThemeOptions } from "@mui/material/styles";

export const typography: ThemeOptions["typography"] = {
  fontFamily: [
    "Inter",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "sans-serif",
  ].join(","),
  h1: { fontSize: "2.5rem", fontWeight: 700, letterSpacing: "-0.02em" },
  h2: { fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.02em" },
  h3: { fontSize: "1.5rem", fontWeight: 600 },
  h4: { fontSize: "1.25rem", fontWeight: 600 },
  h5: { fontSize: "1.125rem", fontWeight: 600 },
  h6: { fontSize: "1rem", fontWeight: 600 },
  body1: { fontSize: "1rem", fontWeight: 400 },
  body2: { fontSize: "0.875rem", fontWeight: 400 },
  button: { textTransform: "none", fontWeight: 600 },
};
