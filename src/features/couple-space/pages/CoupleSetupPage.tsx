import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { ROUTES } from "@/constants/routes";

export function CoupleSetupPage() {
  const navigate = useNavigate();

  return (
    <Stack spacing={3} sx={{ textAlign: "center" }}>
      <Typography variant="h5">Set up your couple space</Typography>
      <Typography variant="body2" color="text.secondary">
        Create a new space or join your partner&apos;s invitation.
      </Typography>
      <PrimaryButton fullWidth onClick={() => navigate(ROUTES.coupleCreate)}>
        Create a space
      </PrimaryButton>
      <SecondaryButton fullWidth onClick={() => navigate(ROUTES.coupleJoin)}>
        Join with a code
      </SecondaryButton>
    </Stack>
  );
}
