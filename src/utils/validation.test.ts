import { describe, expect, it } from "vitest";

import { UPLOAD_LIMITS } from "@/config/uploadLimits";

import { validateUploadFile, validateVideoDuration } from "./validation";

function makeFile(size: number, type: string, name = "file"): File {
  return new File([new Uint8Array(size)], name, { type });
}

describe("validateUploadFile", () => {
  it("accepts a photo within the size limit", () => {
    const file = makeFile(1024, "image/jpeg");
    expect(validateUploadFile(file)).toBeNull();
  });

  it("rejects a photo over the size limit", () => {
    const file = makeFile(UPLOAD_LIMITS.maxPhotoSizeBytes + 1, "image/png");
    expect(validateUploadFile(file)).toMatch(/under/i);
  });

  it("accepts a video within the size limit", () => {
    const file = makeFile(1024, "video/mp4");
    expect(validateUploadFile(file)).toBeNull();
  });

  it("rejects a video over the size limit", () => {
    const file = makeFile(UPLOAD_LIMITS.maxVideoSizeBytes + 1, "video/webm");
    expect(validateUploadFile(file)).toMatch(/under/i);
  });

  it("rejects an unsupported file type", () => {
    const file = makeFile(1024, "application/pdf");
    expect(validateUploadFile(file)).toMatch(/unsupported/i);
  });
});

describe("validateVideoDuration", () => {
  it("accepts a duration within the limit", () => {
    expect(validateVideoDuration(60)).toBeNull();
  });

  it("rejects a duration over the limit", () => {
    expect(
      validateVideoDuration(UPLOAD_LIMITS.maxVideoDurationSeconds + 1),
    ).toMatch(/minutes/i);
  });
});
