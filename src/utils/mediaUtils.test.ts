import { describe, expect, it, vi } from "vitest";

const parseMock = vi.hoisted(() => vi.fn());

vi.mock("exifr", () => ({
  parse: parseMock,
}));

describe("getPhotoCapturedAt", () => {
  it("returns the DateTimeOriginal tag when present", async () => {
    const { getPhotoCapturedAt } = await import("./mediaUtils");
    const capturedDate = new Date("2025-06-01T10:00:00Z");
    parseMock.mockResolvedValueOnce({ DateTimeOriginal: capturedDate });

    const file = new File(["data"], "photo.jpg", { type: "image/jpeg" });
    const result = await getPhotoCapturedAt(file);

    expect(result).toEqual(capturedDate);
  });

  it("falls back to CreateDate when DateTimeOriginal is missing", async () => {
    const { getPhotoCapturedAt } = await import("./mediaUtils");
    const createDate = new Date("2025-05-01T10:00:00Z");
    parseMock.mockResolvedValueOnce({ CreateDate: createDate });

    const file = new File(["data"], "photo.jpg", { type: "image/jpeg" });
    const result = await getPhotoCapturedAt(file);

    expect(result).toEqual(createDate);
  });

  it("returns null when there is no EXIF date data", async () => {
    const { getPhotoCapturedAt } = await import("./mediaUtils");
    parseMock.mockResolvedValueOnce(undefined);

    const file = new File(["data"], "screenshot.png", { type: "image/png" });
    const result = await getPhotoCapturedAt(file);

    expect(result).toBeNull();
  });

  it("returns null instead of throwing when parsing fails", async () => {
    const { getPhotoCapturedAt } = await import("./mediaUtils");
    parseMock.mockRejectedValueOnce(new Error("corrupt file"));

    const file = new File(["data"], "photo.jpg", { type: "image/jpeg" });
    const result = await getPhotoCapturedAt(file);

    expect(result).toBeNull();
  });
});
