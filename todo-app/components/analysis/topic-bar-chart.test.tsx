import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  BarChart: (props: any) => (
    <div data-testid="bar-chart" data-chart-data={JSON.stringify(props.data)}>
      {props.children}
    </div>
  ),
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  CartesianGrid: () => null,
}));

import { TopicBarChart } from "@/components/analysis/topic-bar-chart";

describe("TopicBarChart", () => {
  it("renders the section title", () => {
    render(<TopicBarChart data={[]} />);
    expect(screen.getByText("Tasks by Topic")).toBeInTheDocument();
  });

  it("passes the topic counts straight through to the chart", () => {
    const data = [
      { topic: "Work", count: 3 },
      { topic: "Health", count: 1 },
    ];
    render(<TopicBarChart data={data} />);

    const chartData = JSON.parse(
      screen.getByTestId("bar-chart").getAttribute("data-chart-data")!
    );

    expect(chartData).toEqual(data);
  });
});