// MUI's default palette.background only has `default`/`paper`. This app
// uses a third, slightly-lighter dark surface tone for cards; extend the
// palette type so it can be set per color-scheme in theme.ts and read via
// theme.vars.palette.background.elevated in component overrides.
declare module "@mui/material/styles" {
  interface TypeBackground {
    elevated: string;
  }
}

export {};
