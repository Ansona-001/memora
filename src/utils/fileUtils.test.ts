import { describe, expect, it } from "vitest";

import {
  formatBytes,
  getFileExtension,
  isPhotoFile,
  isVideoFile,
} from "./fileUtils";

describe("formatBytes", () => {
  it("formats bytes, kilobytes, megabytes and gigabytes", () => {
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(2048)).toBe("2.0 KB");
    expect(formatBytes(5 * 1024 * 1024)).toBe("5.0 MB");
  });
});

describe("getFileExtension", () => {
  it("reads the extension from the file name", () => {
    const file = new File(["data"], "vacation.JPG", { type: "image/jpeg" });
    expect(getFileExtension(file)).toBe("jpg");
  });

  it("falls back to the mime subtype when there is no extension", () => {
    const file = new File(["data"], "vacation", { type: "image/webp" });
    expect(getFileExtension(file)).toBe("webp");
  });
});

describe("isPhotoFile / isVideoFile", () => {
  it("classifies accepted photo and video mime types", () => {
    const photo = new File(["data"], "a.jpg", { type: "image/jpeg" });
    const video = new File(["data"], "a.mp4", { type: "video/mp4" });

    expect(isPhotoFile(photo)).toBe(true);
    expect(isVideoFile(photo)).toBe(false);
    expect(isVideoFile(video)).toBe(true);
    expect(isPhotoFile(video)).toBe(false);
  });

  it("rejects unsupported mime types", () => {
    const file = new File(["data"], "a.gif", { type: "image/gif" });
    expect(isPhotoFile(file)).toBe(false);
    expect(isVideoFile(file)).toBe(false);
  });
});
