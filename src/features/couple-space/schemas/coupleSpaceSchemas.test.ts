import { describe, expect, it } from "vitest";

import {
  createCoupleSpaceSchema,
  joinCoupleSpaceSchema,
} from "./coupleSpaceSchemas";

describe("createCoupleSpaceSchema", () => {
  it("requires a non-empty name", () => {
    expect(createCoupleSpaceSchema.safeParse({ name: "" }).success).toBe(false);
    expect(
      createCoupleSpaceSchema.safeParse({ name: "Our Space" }).success,
    ).toBe(true);
  });
});

describe("joinCoupleSpaceSchema", () => {
  it("normalizes the code to trimmed uppercase", () => {
    const result = joinCoupleSpaceSchema.safeParse({ code: "  ab12cd34  " });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.code).toBe("AB12CD34");
    }
  });

  it("rejects an empty code", () => {
    expect(joinCoupleSpaceSchema.safeParse({ code: "" }).success).toBe(false);
  });
});
