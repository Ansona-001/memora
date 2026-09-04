import { describe, expect, it } from "vitest";

import { accentIndexFromId } from "./accentUtils";

describe("accentIndexFromId", () => {
  it("returns a value within the requested range", () => {
    for (const id of ["a", "album-1", "9f2c1e", "z".repeat(40)]) {
      const index = accentIndexFromId(id, 6);
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(6);
    }
  });

  it("is deterministic for the same id", () => {
    expect(accentIndexFromId("album-1")).toBe(accentIndexFromId("album-1"));
  });

  it("differs for most distinct ids", () => {
    expect(accentIndexFromId("album-1")).not.toBe(accentIndexFromId("album-2"));
  });
});
