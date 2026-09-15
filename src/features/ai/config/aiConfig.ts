export const AI_CONFIG = {
  enabledByDefault: true,
  storageKey: "memora:ai-enabled",
} as const;

// Fixed vocabulary for zero-shot tagging via CLIP. Keep this curated and
// stable — changing it invalidates any cached vocabulary embeddings (see
// ai.worker.ts, which embeds this list once at init).
export const TAG_VOCABULARY = [
  "beach",
  "sunset",
  "sunrise",
  "family",
  "couple",
  "indoor",
  "outdoor",
  "night",
  "food",
  "travel",
  "city",
  "nature",
  "mountains",
  "snow",
  "rain",
  "party",
  "pet",
  "car",
  "concert",
  "sports",
  "selfie",
  "group photo",
  "candid",
  "pool",
  "hiking",
] as const;

export const SUGGESTED_AI_TAGS: readonly string[] = TAG_VOCABULARY;

// CLIP-style prompt template — "a photo of {tag}" is the standard baseline
// template from the CLIP paper and works well without extra tuning.
export function tagToPrompt(tag: string): string {
  return `a photo of ${tag}`;
}

// Minimum cosine similarity for a tag to be attached to a memory. Tune this
// empirically against a sample of the real photo library — log raw scores
// for a test batch before changing the production value.
export const TAG_SIMILARITY_THRESHOLD = 0.24;

// Cap on tags attached per memory, even if more clear the threshold.
export const MAX_TAGS_PER_MEMORY = 6;

export function isAiEnabledPreference(value: string | null): boolean {
  if (value === null) {
    return AI_CONFIG.enabledByDefault;
  }

  return value !== "false";
}
