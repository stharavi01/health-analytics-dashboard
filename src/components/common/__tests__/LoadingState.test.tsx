import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LoadingState } from "../LoadingState";

describe("LoadingState", () => {
  it("renders table skeleton", () => {
    const { container } = render(
      <LoadingState type="table" rows={3} columns={4} />
    );
    expect(container.querySelector(".space-y-4")).toBeInTheDocument();
  });

  it("renders cards skeleton", () => {
    const { container } = render(<LoadingState type="cards" columns={4} />);
    expect(container.querySelector(".grid")).toBeInTheDocument();
  });

  it("renders stats skeleton", () => {
    const { container } = render(<LoadingState type="stats" columns={3} />);
    expect(container.querySelector(".grid")).toBeInTheDocument();
  });
});
