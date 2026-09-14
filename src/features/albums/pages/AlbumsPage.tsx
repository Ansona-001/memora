import AddRoundedIcon from "@mui/icons-material/AddRounded";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";

import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { useCoupleSpace } from "@/features/couple-space/hooks/useCoupleSpace";

import { AlbumGridCard } from "../components/AlbumGridCard";
import { AlbumSkeleton } from "../components/AlbumSkeleton";
import { useAlbums } from "../hooks/useAlbums";

export function AlbumsPage() {
  const navigate = useNavigate();
  const { data: coupleSpace } = useCoupleSpace();
  const albums = useAlbums(coupleSpace?.id);

  return (
    <PageContainer>
      <SectionHeader
        title="Albums"
        level="h1"
        action={
          <PrimaryButton
            startIcon={<AddRoundedIcon />}
            onClick={() => navigate("/app/albums/new")}
          >
            New album
          </PrimaryButton>
        }
      />

      {albums.isPending ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 2,
          }}
        >
          {Array.from({ length: 4 }, (_, index) => (
            <AlbumSkeleton key={index} />
          ))}
        </Box>
      ) : albums.isError ? (
        <ErrorState
          title="We couldn't load your albums"
          onRetry={() => albums.refetch()}
        />
      ) : albums.data && albums.data.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 2,
          }}
        >
          {albums.data.map((album) => (
            <AlbumGridCard key={album.id} album={album} />
          ))}
        </Box>
      ) : (
        <EmptyState
          title="No albums yet"
          description="Group your favorite memories into an album."
          action={
            <PrimaryButton onClick={() => navigate("/app/albums/new")}>
              Create your first album
            </PrimaryButton>
          }
        />
      )}
    </PageContainer>
  );
}
