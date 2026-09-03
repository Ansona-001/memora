import { useTheme } from "@mui/material/styles";
import useMuiMediaQuery from "@mui/material/useMediaQuery";

export function useIsDesktop() {
  const theme = useTheme();
  return useMuiMediaQuery(theme.breakpoints.up("md"));
}

export function useIsMobile() {
  const theme = useTheme();
  return useMuiMediaQuery(theme.breakpoints.down("md"));
}
