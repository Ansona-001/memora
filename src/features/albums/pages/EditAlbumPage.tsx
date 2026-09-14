import Typography from "@mui/material/Typography";
import { useNavigate, useParams } from "react-router-dom";

import { LoadingScreen } from "@/components/feedback/LoadingScreen";
import { PageContainer } from "@/components/layout/PageContainer";
import { getErrorMessage } from "@/utils/errorUtils";

import { AlbumForm } from "../components/AlbumForm";
import { useAlbum } from "../hooks/useAlbum";
import { useUpdateAlbum } from "../hooks/useUpdateAlbum";
import type { AlbumFormValues } from "../schemas/albumSchema";

export function EditAlbumPage() {
  const { albumId } = useParams<{ albumId: string }>();
  const navigate = useNavigate();
  const { data: album, isPending } = useAlbum(albumId);
  const updateAlbum = useUpdateAlbum();

  if (isPending) {
    return <LoadingScreen />;
  }

  if (!album) {
    return null;
  }

  const handleSubmit = (values: AlbumFormValues) => {
    updateAlbum.mutate(
      {
        albumId: album.id,
        updates: {
          title: values.title,
          description: values.description || null,
        },
      },
      {
        onSuccess: () => navigate(`/app/albums/${album.id}`),
      },
    );
  };

  return (
    <PageContainer>
      <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
        Edit album
      </Typography>
      <AlbumForm
        defaultValues={{
          title: album.title,
          description: album.description ?? "",
        }}
        onSubmit={handleSubmit}
        isSubmitting={updateAlbum.isPending}
        submitLabel="Save changes"
        errorMessage={
          updateAlbum.isError ? getErrorMessage(updateAlbum.error) : null
        }
      />
    </PageContainer>
  );
}
