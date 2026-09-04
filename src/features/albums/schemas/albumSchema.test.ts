import { describe, expect, it } from "vitest";

import { albumSchema } from "./albumSchema";

describe("albumSchema", () => {
  it("requires a non-empty title", () => {
    expect(albumSchema.safeParse({ title: "" }).success).toBe(false);
    expect(albumSchema.safeParse({ title: "Our Trip" }).success).toBe(true);
  });

  it("allows an optional description", () => {
    const result = albumSchema.safeParse({ title: "Our Trip" });
    expect(result.success).toBe(true);
  });

  it("rejects a title over the max length", () => {
    const result = albumSchema.safeParse({ title: "a".repeat(81) });
    expect(result.success).toBe(false);
  });
});
