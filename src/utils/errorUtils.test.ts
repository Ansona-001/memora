import { describe, expect, it } from "vitest";

import { getErrorMessage } from "./errorUtils";

describe("getErrorMessage", () => {
  it("returns the message of an Error instance", () => {
    expect(getErrorMessage(new Error("Invalid credentials"))).toBe(
      "Invalid credentials",
    );
  });

  it("returns a string error as-is", () => {
    expect(getErrorMessage("Network unavailable")).toBe("Network unavailable");
  });

  it("falls back to a generic message for unknown shapes", () => {
    expect(getErrorMessage({ weird: true })).toBe(
      "Something went wrong. Please try again.",
    );
  });

  it("reads Supabase-style plain object errors", () => {
    expect(getErrorMessage({ message: "column ai_caption does not exist" })).toBe(
      "column ai_caption does not exist",
    );
    expect(getErrorMessage({ message: "", error: "RLS violation" })).toBe(
      "RLS violation",
    );
  });
});
