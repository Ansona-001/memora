import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { JoinCoupleSpaceForm } from "../components/JoinCoupleSpaceForm";

export function CoupleJoinPage() {
  return (
    <Stack spacing={3}>
      <Typography variant="h5" component="h1" sx={{ textAlign: "center" }}>
        Join your partner&apos;s space
      </Typography>
      <JoinCoupleSpaceForm />
    </Stack>
  );
}
