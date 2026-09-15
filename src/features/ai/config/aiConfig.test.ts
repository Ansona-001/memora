import { describe, expect, it } from "vitest";

import {
  isAiEnabledPreference,
  TAG_VOCABULARY,
  tagToPrompt,
} from "./aiConfig";

describe("aiConfig", () => {
  it("builds a CLIP-style prompt for a tag", () => {
    expect(tagToPrompt("beach")).toBe("a photo of beach");
  });

  it("has a curated, deduplicated tag vocabulary", () => {
    expect(new Set(TAG_VOCABULARY).size).toBe(TAG_VOCABULARY.length);
    expect(TAG_VOCABULARY).toEqual(expect.arrayContaining(["beach", "family"]));
  });

  it("defaults the preference to enabled", () => {
    expect(isAiEnabledPreference(null)).toBe(true);
    expect(isAiEnabledPreference("false")).toBe(false);
    expect(isAiEnabledPreference("true")).toBe(true);
  });
});
