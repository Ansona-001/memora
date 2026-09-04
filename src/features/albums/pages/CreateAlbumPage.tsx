import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

import { PageContainer } from "@/components/layout/PageContainer";
import { useCoupleSpace } from "@/features/couple-space/hooks/useCoupleSpace";
import { useAuth } from "@/hooks/useAuth";
import { getErrorMessage } from "@/utils/errorUtils";

import { AlbumForm } from "../components/AlbumForm";
import { useCreateAlbum } from "../hooks/useCreateAlbum";
import type { AlbumFormValues } from "../schemas/albumSchema";

export function CreateAlbumPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: coupleSpace } = useCoupleSpace();
  const createAlbum = useCreateAlbum();

  const handleSubmit = (values: AlbumFormValues) => {
    if (!coupleSpace || !user) {
      return;
    }

    createAlbum.mutate(
      {
        coupleSpaceId: coupleSpace.id,
        createdBy: user.id,
        title: values.title,
        description: values.description,
      },
      {
        onSuccess: (album) => navigate(`/app/albums/${album.id}`),
      },
    );
  };

  return (
    <PageContainer>
      <Typography variant="h5" sx={{ mb: 3 }}>
        New album
      </Typography>
      <AlbumForm
        onSubmit={handleSubmit}
        isSubmitting={createAlbum.isPending}
        submitLabel="Create album"
        errorMessage={
          createAlbum.isError ? getErrorMessage(createAlbum.error) : null
        }
      />
    </PageContainer>
  );
}
