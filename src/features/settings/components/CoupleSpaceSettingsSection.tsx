import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { AppAlert } from "@/components/feedback/AppAlert";
import { UserAvatar } from "@/components/media/UserAvatar";
import { ROUTES } from "@/constants/routes";
import { CoupleSpaceForm } from "@/features/couple-space/components/CoupleSpaceForm";
import { LeaveCoupleSpaceDialog } from "@/features/couple-space/components/LeaveCoupleSpaceDialog";
import { useLeaveCoupleSpace } from "@/features/couple-space/hooks/useLeaveCoupleSpace";
import type { CoupleSpaceWithMembers } from "@/services/coupleSpaceService";
import { getErrorMessage } from "@/utils/errorUtils";

interface CoupleSpaceSettingsSectionProps {
  coupleSpace: CoupleSpaceWithMembers;
}

export function CoupleSpaceSettingsSection({
  coupleSpace,
}: CoupleSpaceSettingsSectionProps) {
  const navigate = useNavigate();
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);
  const leaveSpace = useLeaveCoupleSpace();

  const handleConfirmLeave = () => {
    leaveSpace.mutate(undefined, {
      onSuccess: () => navigate(ROUTES.coupleSetup, { replace: true }),
    });
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2}>
        {coupleSpace.members.map((member) => (
          <Stack
            key={member.userId}
            spacing={0.5}
            sx={{ alignItems: "center" }}
          >
            <UserAvatar
              avatarPath={member.profile?.avatar_path}
              displayName={member.profile?.display_name ?? "?"}
              sx={{ width: 48, height: 48 }}
            />
            <Typography variant="caption" color="text.secondary">
              {member.profile?.display_name ?? "Unknown"}
            </Typography>
          </Stack>
        ))}
      </Stack>

      <CoupleSpaceForm
        coupleSpaceId={coupleSpace.id}
        name={coupleSpace.name}
        coverPath={coupleSpace.coverPath}
      />

      {leaveSpace.isError ? (
        <AppAlert severity="error">
          {getErrorMessage(leaveSpace.error)}
        </AppAlert>
      ) : null}

      <Button
        color="error"
        variant="outlined"
        sx={{ alignSelf: "flex-start" }}
        onClick={() => setIsLeaveOpen(true)}
      >
        Leave couple space
      </Button>

      <LeaveCoupleSpaceDialog
        open={isLeaveOpen}
        spaceName={coupleSpace.name}
        hasPartner={coupleSpace.members.length > 1}
        isLeaving={leaveSpace.isPending}
        onClose={() => setIsLeaveOpen(false)}
        onConfirm={handleConfirmLeave}
      />
    </Stack>
  );
}
