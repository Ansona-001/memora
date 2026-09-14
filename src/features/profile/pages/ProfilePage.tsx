import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

import { IconActionButton } from "@/components/buttons/IconActionButton";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingScreen } from "@/components/feedback/LoadingScreen";
import { PageContainer } from "@/components/layout/PageContainer";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";

import { AvatarUpload } from "../components/AvatarUpload";
import { ProfileForm } from "../components/ProfileForm";
import { useProfile } from "../hooks/useProfile";

export function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile, isPending, isError, error, refetch } = useProfile();

  if (isPending) {
    return <LoadingScreen />;
  }

  if (isError || !profile) {
    return (
      <ErrorState
        title="Couldn't load your profile"
        description={error instanceof Error ? error.message : undefined}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <PageContainer>
      <Stack
        direction="row"
        sx={{ alignItems: "center", justifyContent: "space-between", mb: 3 }}
      >
        <Typography variant="h5" component="h1">
          Your profile
        </Typography>
        <IconActionButton
          label="Settings"
          onClick={() => navigate(ROUTES.settings)}
        >
          <SettingsRoundedIcon />
        </IconActionButton>
      </Stack>

      <Stack spacing={3} sx={{ maxWidth: 420 }}>
        <Box>
          <AvatarUpload
            avatarPath={profile.avatar_path}
            displayName={profile.display_name}
          />
        </Box>

        <ProfileForm displayName={profile.display_name} />

        <Box>
          <Typography variant="body2" color="textSecondary">
            Email
          </Typography>
          <Typography variant="body1">{user?.email}</Typography>
        </Box>
      </Stack>
    </PageContainer>
  );
}
