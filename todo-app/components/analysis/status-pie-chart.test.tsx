import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  PieChart: ({ children }: any) => <div>{children}</div>,
  Pie: (props: any) => (
    <div data-testid="pie" data-chart-data={JSON.stringify(props.data)} />
  ),
  Cell: () => null,
  Tooltip: () => null,
  Legend: () => null,
}));

import { StatusPieChart } from "@/components/analysis/status-pie-chart";

describe("StatusPieChart", () => {
  it("renders the section title", () => {
    render(<StatusPieChart data={[]} />);
    expect(screen.getByText("Status Breakdown")).toBeInTheDocument();
  });

  it("maps each status to its plain-English label for the chart", () => {
    render(
      <StatusPieChart
        data={[
          { status: "Todo", count: 2 },
          { status: "InProgress", count: 1 },
          { status: "Completed", count: 4 },
        ]}
      />
    );

    const chartData = JSON.parse(
      screen.getByTestId("pie").getAttribute("data-chart-data")!
    );

    expect(chartData).toEqual([
      { name: "Todo", value: 2, status: "Todo" },
      { name: "In Progress", value: 1, status: "InProgress" },
      { name: "Completed", value: 4, status: "Completed" },
    ]);
  });
});