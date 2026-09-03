import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";

import { EmptyState } from "@/components/feedback/EmptyState";
import { PageContainer } from "@/components/layout/PageContainer";
import { useCoupleSpace } from "@/features/couple-space/hooks/useCoupleSpace";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { ROUTES } from "@/constants/routes";

export function HomePage() {
  const { data: profile } = useProfile();
  const { data: coupleSpace } = useCoupleSpace();
  const { user } = useAuth();

  const partnerName = coupleSpace?.members.find(
    (member) => member.userId !== user?.id,
  )?.profile?.display_name;

  return (
    <PageContainer>
      <Stack spacing={1} sx={{ mb: 4 }}>
        <Typography variant="body2" color="text.secondary">
          {coupleSpace?.name}
        </Typography>
        {partnerName ? (
          <Typography variant="body2" color="text.secondary">
            Shared with {partnerName}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Waiting for your partner to join —{" "}
            <Typography
              component={RouterLink}
              to={ROUTES.coupleInvite}
              variant="body2"
              color="primary.main"
              sx={{ display: "inline" }}
            >
              share your invite code
            </Typography>
          </Typography>
        )}
      </Stack>

      <EmptyState
        title={
          profile ? `Welcome back, ${profile.display_name}` : "Welcome back"
        }
        description="The cinematic home feed will be implemented in the home phase."
      />
    </PageContainer>
  );
}
