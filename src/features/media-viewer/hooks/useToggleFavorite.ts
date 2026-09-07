import type { Memory } from "@/types/media";

import { useUpdateMemory } from "./useUpdateMemory";

export function useToggleFavorite() {
  const updateMemory = useUpdateMemory();

  const toggle = (memory: Memory) =>
    updateMemory.mutate({
      memoryId: memory.id,
      updates: { is_favorite: !memory.is_favorite },
    });

  return { toggle, isPending: updateMemory.isPending };
}
