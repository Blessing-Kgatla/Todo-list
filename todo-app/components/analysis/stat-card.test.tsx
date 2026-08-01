import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatCard } from "@/components/analysis/stat-card";

describe("StatCard", () => {
  it("renders the label and value", () => {
    render(<StatCard label="Total Tasks" value={12} />);
    expect(screen.getByText("Total Tasks")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("applies the accent class when provided", () => {
    render(<StatCard label="Overdue" value={3} accent="text-red-500" />);
    expect(screen.getByText("3")).toHaveClass("text-red-500");
  });

  it("defaults to the standard text color when no accent is given", () => {
    render(<StatCard label="Completed" value={5} />);
    expect(screen.getByText("5")).toHaveClass("text-slate-900");
  });
});