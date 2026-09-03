import { describe, expect, it } from "vitest";

import { renderWithProviders, screen } from "@/test/testUtils";

import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders the title and description", () => {
    renderWithProviders(
      <EmptyState title="No albums yet" description="Create your first one." />,
    );

    expect(
      screen.getByRole("heading", { name: "No albums yet" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Create your first one.")).toBeInTheDocument();
  });

  it("renders an optional action", () => {
    renderWithProviders(
      <EmptyState
        title="No albums yet"
        action={<button>Create album</button>}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Create album" }),
    ).toBeInTheDocument();
  });
});
