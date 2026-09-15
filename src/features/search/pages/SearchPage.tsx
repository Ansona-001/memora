import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useMemo, useState } from "react";

import { SearchField } from "@/components/forms/SearchField";
import { PageContainer } from "@/components/layout/PageContainer";
import { useAlbums } from "@/features/albums/hooks/useAlbums";
import { useAiPreference } from "@/features/ai/hooks/useAiSuggestion";
import { useCoupleSpace } from "@/features/couple-space/hooks/useCoupleSpace";
import { useDebounce } from "@/hooks/useDebounce";

import { SearchResults } from "../components/SearchResults";
import { useSearchMemories } from "../hooks/useSearchMemories";

export function SearchPage() {
  const { data: coupleSpace } = useCoupleSpace();
  const { aiEnabled } = useAiPreference();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const albumsQuery = useAlbums(coupleSpace?.id);
  const memoriesQuery = useSearchMemories(
    coupleSpace?.id,
    debouncedQuery,
    aiEnabled,
  );

  const matchingAlbums = useMemo(() => {
    const trimmed = debouncedQuery.trim().toLowerCase();
    if (!trimmed) {
      return [];
    }
    return (albumsQuery.data ?? []).filter((album) =>
      album.title.toLowerCase().includes(trimmed),
    );
  }, [albumsQuery.data, debouncedQuery]);

  return (
    <PageContainer>
      <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
        Search
      </Typography>

      <SearchField
        value={query}
        onChange={setQuery}
        placeholder="Search memories and albums"
      />

      <Box sx={{ mt: 3 }}>
        <SearchResults
          query={debouncedQuery}
          albums={matchingAlbums}
          memoriesQuery={memoriesQuery}
          onSuggestionClick={setQuery}
        />
      </Box>
    </PageContainer>
  );
}
