import Alert, { type AlertProps } from "@mui/material/Alert";

export function AppAlert(props: AlertProps) {
  return <Alert variant="filled" {...props} />;
}
