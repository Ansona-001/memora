import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders, screen } from "@/test/testUtils";

import { AlbumForm } from "./AlbumForm";

describe("AlbumForm", () => {
  it("shows a validation error when the title is empty", async () => {
    const onSubmit = vi.fn();
    renderWithProviders(
      <AlbumForm
        onSubmit={onSubmit}
        isSubmitting={false}
        submitLabel="Create album"
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Create album" }));

    expect(
      await screen.findByText("Give the album a title"),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits the entered title and description", async () => {
    const onSubmit = vi.fn();
    renderWithProviders(
      <AlbumForm
        onSubmit={onSubmit}
        isSubmitting={false}
        submitLabel="Create album"
      />,
    );

    await userEvent.type(
      screen.getByLabelText("Album title"),
      "Our Weekend Trip",
    );
    await userEvent.click(screen.getByRole("button", { name: "Create album" }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Our Weekend Trip" }),
      expect.anything(),
    );
  });

  it("displays an error message when provided", () => {
    renderWithProviders(
      <AlbumForm
        onSubmit={vi.fn()}
        isSubmitting={false}
        submitLabel="Create album"
        errorMessage="Something went wrong"
      />,
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });
});
