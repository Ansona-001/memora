import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { AppAlert } from "@/components/feedback/AppAlert";
import { EmptyState } from "@/components/feedback/EmptyState";
import { LoadingScreen } from "@/components/feedback/LoadingScreen";
import { ROUTES } from "@/constants/routes";
import { getErrorMessage } from "@/utils/errorUtils";

import { useCoupleSpace } from "../hooks/useCoupleSpace";
import { useCreateInvitation } from "../hooks/useCreateInvitation";

export function InvitePartnerPanel() {
  const navigate = useNavigate();
  const { data: coupleSpace, isPending } = useCoupleSpace();
  const createInvitation = useCreateInvitation();

  const isPaired = (coupleSpace?.members.length ?? 0) >= 2;

  useEffect(() => {
    if (isPaired) {
      navigate(ROUTES.home, { replace: true });
    }
  }, [isPaired, navigate]);

  if (isPending) {
    return <LoadingScreen />;
  }

  if (!coupleSpace) {
    return (
      <EmptyState
        title="No couple space yet"
        description="Create a couple space first."
      />
    );
  }

  return (
    <Stack spacing={3} sx={{ alignItems: "center", textAlign: "center" }}>
      <Typography variant="h5">Invite your partner</Typography>
      <Typography variant="body2" color="text.secondary">
        Share this code with your partner. It expires in 7 days.
      </Typography>

      {createInvitation.isError ? (
        <AppAlert severity="error">
          {getErrorMessage(createInvitation.error)}
        </AppAlert>
      ) : null}

      {createInvitation.data ? (
        <Chip
          label={createInvitation.data.code}
          icon={<ContentCopyRoundedIcon fontSize="small" />}
          onClick={() =>
            navigator.clipboard.writeText(createInvitation.data!.code)
          }
          sx={{ fontSize: "1.25rem", py: 2.5, px: 1, letterSpacing: 2 }}
        />
      ) : (
        <PrimaryButton
          isLoading={createInvitation.isPending}
          onClick={() => createInvitation.mutate(coupleSpace.id)}
        >
          Generate invite code
        </PrimaryButton>
      )}

      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
        <CircularProgress size={16} />
        <Typography variant="body2" color="text.secondary">
          Waiting for your partner to join…
        </Typography>
      </Stack>

      <Typography
        component={RouterLink}
        to={ROUTES.home}
        variant="body2"
        color="primary.main"
      >
        Continue to your space
      </Typography>
    </Stack>
  );
}
