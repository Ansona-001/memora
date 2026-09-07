import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { renderWithProviders, screen } from "@/test/testUtils";

import { ImageViewer } from "./ImageViewer";

describe("ImageViewer", () => {
  it("toggles zoom on click", async () => {
    renderWithProviders(
      <ImageViewer src="https://example.com/photo.jpg" alt="A memory" />,
    );

    const image = screen.getByAltText("A memory");
    expect(image).toHaveStyle({ transform: "scale(1)" });

    await userEvent.click(image);
    expect(image).toHaveStyle({ transform: "scale(2.5)" });

    await userEvent.click(image);
    expect(image).toHaveStyle({ transform: "scale(1)" });
  });
});
