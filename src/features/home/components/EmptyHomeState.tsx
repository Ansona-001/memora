import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import { useNavigate } from "react-router-dom";

import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ROUTES } from "@/constants/routes";

export function EmptyHomeState() {
  const navigate = useNavigate();

  return (
    <EmptyState
      icon={<AddPhotoAlternateRoundedIcon sx={{ fontSize: 48 }} />}
      title="No memories yet"
      description="Upload your first photo or video to start building your shared timeline."
      action={
        <PrimaryButton onClick={() => navigate(ROUTES.upload)}>
          Add your first memory
        </PrimaryButton>
      }
    />
  );
}
