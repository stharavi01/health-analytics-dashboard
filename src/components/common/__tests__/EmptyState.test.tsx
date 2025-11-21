import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { EmptyState } from "../EmptyState";
import { Home } from "lucide-react";

describe("EmptyState", () => {
  it("renders with default props", () => {
    render(<EmptyState />);
    expect(screen.getByText("No data found")).toBeInTheDocument();
  });

  it("renders with custom title and description", () => {
    render(
      <EmptyState
        title="No countries"
        description="Try adjusting your filters"
      />
    );
    expect(screen.getByText("No countries")).toBeInTheDocument();
    expect(screen.getByText("Try adjusting your filters")).toBeInTheDocument();
  });

  it("renders with custom icon", () => {
    render(<EmptyState icon={Home} title="Welcome" />);
    expect(screen.getByText("Welcome")).toBeInTheDocument();
  });
});
