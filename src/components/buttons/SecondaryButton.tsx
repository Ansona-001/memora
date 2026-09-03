import Button, { type ButtonProps } from "@mui/material/Button";

export function SecondaryButton(props: ButtonProps) {
  return <Button variant="outlined" color="inherit" {...props} />;
}
