import { describe, expect, it } from "vitest";

import { memorySchema } from "./memorySchema";

describe("memorySchema", () => {
  it("allows an empty title", () => {
    expect(memorySchema.safeParse({ title: "" }).success).toBe(true);
    expect(memorySchema.safeParse({}).success).toBe(true);
  });

  it("accepts a reasonable title", () => {
    expect(memorySchema.safeParse({ title: "Our anniversary" }).success).toBe(
      true,
    );
  });

  it("rejects a title over the max length", () => {
    expect(memorySchema.safeParse({ title: "a".repeat(121) }).success).toBe(
      false,
    );
  });
});
