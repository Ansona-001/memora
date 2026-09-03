import { describe, expect, it } from "vitest";

import { renderWithProviders, screen } from "@/test/testUtils";

import { HorizontalMediaRow } from "./HorizontalMediaRow";

interface Item {
  id: string;
  label: string;
}

describe("HorizontalMediaRow", () => {
  it("renders a title and each item", () => {
    const items: Item[] = [
      { id: "1", label: "First" },
      { id: "2", label: "Second" },
    ];

    renderWithProviders(
      <HorizontalMediaRow
        title="Recently Added"
        items={items}
        getKey={(item) => item.id}
        renderItem={(item) => <span>{item.label}</span>}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Recently Added" }),
    ).toBeInTheDocument();
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });

  it("renders nothing when there are no items", () => {
    const { container } = renderWithProviders(
      <HorizontalMediaRow
        title="Empty Row"
        items={[] as Item[]}
        getKey={(item) => item.id}
        renderItem={(item) => <span>{item.label}</span>}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
