import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { CreateCoupleSpaceForm } from "../components/CreateCoupleSpaceForm";

export function CoupleCreatePage() {
  return (
    <Stack spacing={3}>
      <Typography variant="h5" component="h1" sx={{ textAlign: "center" }}>
        Create your couple space
      </Typography>
      <CreateCoupleSpaceForm />
    </Stack>
  );
}
