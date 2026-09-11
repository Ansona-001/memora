import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders, screen } from "@/test/testUtils";

import { SearchField } from "./SearchField";

describe("SearchField", () => {
  it("calls onChange as the user types", async () => {
    const onChange = vi.fn();
    renderWithProviders(<SearchField value="" onChange={onChange} />);

    await userEvent.type(screen.getByPlaceholderText("Search"), "trip");

    expect(onChange).toHaveBeenCalledTimes(4);
    expect(onChange).toHaveBeenLastCalledWith("p");
  });

  it("shows a clear button only when there is a value, and clears on click", async () => {
    const onChange = vi.fn();
    const { rerender } = renderWithProviders(
      <SearchField value="" onChange={onChange} />,
    );
    expect(
      screen.queryByRole("button", { name: "Clear search" }),
    ).not.toBeInTheDocument();

    rerender(<SearchField value="trip" onChange={onChange} />);
    const clearButton = screen.getByRole("button", { name: "Clear search" });
    await userEvent.click(clearButton);

    expect(onChange).toHaveBeenCalledWith("");
  });
});
