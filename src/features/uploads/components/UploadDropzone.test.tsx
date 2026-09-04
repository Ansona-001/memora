import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders, screen } from "@/test/testUtils";

import { UploadDropzone } from "./UploadDropzone";

describe("UploadDropzone", () => {
  it("forwards files selected through the file input", async () => {
    const onFilesSelected = vi.fn();
    renderWithProviders(<UploadDropzone onFilesSelected={onFilesSelected} />);

    const file = new File(["data"], "photo.jpg", { type: "image/jpeg" });
    const input = screen
      .getByRole("button")
      .querySelector("input[type='file']") as HTMLInputElement;

    await userEvent.upload(input, file);

    expect(onFilesSelected).toHaveBeenCalledTimes(1);
    const [files] = onFilesSelected.mock.calls[0] as [FileList];
    expect(files).toHaveLength(1);
    expect(files[0]?.name).toBe("photo.jpg");
  });

  it("renders drop instructions", () => {
    renderWithProviders(<UploadDropzone onFilesSelected={vi.fn()} />);

    expect(
      screen.getByText("Drag and drop photos or videos here"),
    ).toBeInTheDocument();
  });
});
