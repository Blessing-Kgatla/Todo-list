"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { Status } from "@prisma/client";

const COLORS: Record<Status, string> = {
  Todo: "#94A3B8",
  InProgress: "#3B82F6",
  Completed: "#22C55E",
};

const LABELS: Record<Status, string> = {
  Todo: "Todo",
  InProgress: "In Progress",
  Completed: "Completed",
};

type Props = {
  data: { status: Status; count: number }[];
};

export function StatusPieChart({ data }: Props) {
  const chartData = data.map((d) => ({ name: LABELS[d.status], value: d.count, status: d.status }));

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
      <p className="text-xs font-medium text-slate-400 mb-2">Status Breakdown</p>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
          >
            {chartData.map((entry) => (
              <Cell key={entry.status} fill={COLORS[entry.status]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}