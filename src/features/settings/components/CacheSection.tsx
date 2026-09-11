import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { AppAlert } from "@/components/feedback/AppAlert";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";

export function CacheSection() {
  const queryClient = useQueryClient();
  const [justCleared, setJustCleared] = useState(false);

  const handleClear = () => {
    // invalidateQueries (not clear/removeQueries) so mounted screens keep
    // showing their current data while it refetches in the background,
    // rather than dropping to empty/loading for a moment.
    void queryClient.invalidateQueries();
    setJustCleared(true);
  };

  return (
    <>
      {justCleared ? (
        <AppAlert severity="success" sx={{ mb: 2 }}>
          Cached data cleared. Fresh content will reload as you browse.
        </AppAlert>
      ) : null}
      <SecondaryButton onClick={handleClear}>Clear cached data</SecondaryButton>
    </>
  );
}
