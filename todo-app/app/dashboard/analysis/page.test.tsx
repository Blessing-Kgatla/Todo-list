import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  PieChart: ({ children }: any) => <div>{children}</div>,
  Pie: () => null,
  Cell: () => null,
  Legend: () => null,
  BarChart: ({ children }: any) => <div>{children}</div>,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  CartesianGrid: () => null,
}));

vi.mock("@/lib/data", () => ({ getTaskStats: vi.fn() }));

import { getTaskStats } from "@/lib/data";
import AnalysisPage from "@/app/dashboard/analysis/page";


describe("AnalysisPage", () => {
  it("renders stat cards and charts from fetched stats", async () => {
    vi.mocked(getTaskStats).mockResolvedValue({
      total: 5,
      byStatus: [
        { status: "Todo", count: 2 },
        { status: "InProgress", count: 1 },
        { status: "Completed", count: 2 },
      ],
      byTopic: [
        { topic: "Work", count: 3 },
        { topic: "Health", count: 2 },
      ],
      overdueCount: 1,
      completionRate: 40,
    });

    const jsx = await AnalysisPage();
    render(jsx);

    expect(screen.getByText("Total Tasks")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("Completion Rate")).toBeInTheDocument();
    expect(screen.getByText("40%")).toBeInTheDocument();
    expect(screen.getByText("Overdue")).toBeInTheDocument();
    expect(screen.getByText("Status Breakdown")).toBeInTheDocument();
    expect(screen.getByText("Tasks by Topic")).toBeInTheDocument();
  });

  it("shows a placeholder instead of the bar chart when there are no topics", async () => {
    vi.mocked(getTaskStats).mockResolvedValue({
      total: 0,
      byStatus: [
        { status: "Todo", count: 0 },
        { status: "InProgress", count: 0 },
        { status: "Completed", count: 0 },
      ],
      byTopic: [],
      overdueCount: 0,
      completionRate: 0,
    });

    const jsx = await AnalysisPage();
    render(jsx);

    expect(screen.getByText("No topics yet")).toBeInTheDocument();
  });
});