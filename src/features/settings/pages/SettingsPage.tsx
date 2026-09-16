import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState } from "react";

import { PageContainer } from "@/components/layout/PageContainer";
import { useCoupleSpace } from "@/features/couple-space/hooks/useCoupleSpace";
import { useAuth } from "@/hooks/useAuth";

import { AppearanceSection } from "../components/AppearanceSection";
import { CacheSection } from "../components/CacheSection";
import { ChangePasswordSection } from "../components/ChangePasswordSection";
import { CoupleSpaceSettingsSection } from "../components/CoupleSpaceSettingsSection";
import { DeleteAccountDialog } from "../components/DeleteAccountDialog";
import { LogoutSection } from "../components/LogoutSection";
import { MediaPreferencesSection } from "../components/MediaPreferencesSection";
import { PrivacySection } from "../components/PrivacySection";
import { SettingsSection } from "../components/SettingsSection";
import { useDeleteAccount } from "../hooks/useDeleteAccount";

export function SettingsPage() {
  const { user } = useAuth();
  const { data: coupleSpace } = useCoupleSpace();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const deleteAccount = useDeleteAccount();

  return (
    <PageContainer>
      <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
        Settings
      </Typography>

      <Stack spacing={3} sx={{ maxWidth: 560 }}>
        <SettingsSection title="Account" description={user?.email}>
          <ChangePasswordSection />
          <Divider />
          <LogoutSection />
        </SettingsSection>

        {coupleSpace ? (
          <SettingsSection
            title="Couple space"
            description="Rename your space or leave it."
          >
            <CoupleSpaceSettingsSection coupleSpace={coupleSpace} />
          </SettingsSection>
        ) : null}

        <SettingsSection title="Privacy">
          <PrivacySection />
        </SettingsSection>

        <SettingsSection title="Media preferences">
          <MediaPreferencesSection />
        </SettingsSection>

        <SettingsSection title="Cache">
          <CacheSection />
        </SettingsSection>

        <SettingsSection title="Appearance">
          <AppearanceSection />
        </SettingsSection>

        <SettingsSection
          title="Delete account"
          description="Permanently delete your account and profile."
        >
          <Button
            color="error"
            variant="outlined"
            sx={{ alignSelf: "flex-start" }}
            onClick={() => setIsDeleteOpen(true)}
          >
            Delete account
          </Button>
        </SettingsSection>
      </Stack>

      <DeleteAccountDialog
        open={isDeleteOpen}
        isDeleting={deleteAccount.isPending}
        error={deleteAccount.error}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => deleteAccount.mutate()}
      />
    </PageContainer>
  );
}
