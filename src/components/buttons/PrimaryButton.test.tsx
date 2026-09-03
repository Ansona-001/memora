import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders, screen } from "@/test/testUtils";

import { PrimaryButton } from "./PrimaryButton";

describe("PrimaryButton", () => {
  it("renders its label and responds to clicks", async () => {
    const handleClick = vi.fn();
    renderWithProviders(
      <PrimaryButton onClick={handleClick}>Continue</PrimaryButton>,
    );

    const button = screen.getByRole("button", { name: "Continue" });
    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("disables the button and hides the label interaction while loading", () => {
    renderWithProviders(<PrimaryButton isLoading>Continue</PrimaryButton>);

    expect(screen.getByRole("button", { name: "Continue" })).toBeDisabled();
    expect(
      screen.getByRole("progressbar", { hidden: true }),
    ).toBeInTheDocument();
  });
});
