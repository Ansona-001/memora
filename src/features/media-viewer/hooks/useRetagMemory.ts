import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  MAX_TAGS_PER_MEMORY,
  TAG_SIMILARITY_THRESHOLD,
} from "@/features/ai/config/aiConfig";
import { getSharedAiClient } from "@/features/ai/services/aiClient";
import { queryKeys } from "@/config/queryKeys";
import type { Memory } from "@/types/media";

import { updateMemory } from "../api/updateMemory";

const MODEL_VERSION = "Xenova/clip-vit-base-patch32";

// Lets a user re-run AI tagging on an already-uploaded photo — the only
// recovery path if the original upload's tagging was interrupted (e.g. the
// tab was refreshed while it was still processing) or never ran at all.
export function useRetagMemory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      memory,
      mediaUrl,
    }: {
      memory: Memory;
      mediaUrl: string;
    }) => {
      const response = await fetch(mediaUrl);
      if (!response.ok) {
        throw new Error("Could not load the photo for AI tagging.");
      }
      const blob = await response.blob();

      const { tags, embedding } = await getSharedAiClient().analyzeImage(blob);
      const selectedTags = tags
        .filter((t) => t.score >= TAG_SIMILARITY_THRESHOLD)
        .slice(0, MAX_TAGS_PER_MEMORY)
        .map((t) => t.tag);

      return updateMemory(memory.id, {
        ai_tags: selectedTags,
        ai_embedding: embedding,
        ai_model_version: MODEL_VERSION,
      });
    },
    onSuccess: (memory) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.memories.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.home.feed(memory.couple_space_id),
      });
    },
  });
}
