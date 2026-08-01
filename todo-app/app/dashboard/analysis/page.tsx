import { getTaskStats } from "@/lib/data";
import { StatCard } from "@/components/analysis/stat-card";
import { StatusPieChart } from "@/components/analysis/status-pie-chart";
import { TopicBarChart } from "@/components/analysis/topic-bar-chart";

export default async function AnalysisPage() {
  const stats = await getTaskStats();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Analysis</h1>
      <p className="mt-1 text-sm text-slate-500">
        Overview of your active tasks.
      </p>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Tasks" value={stats.total} />
        <StatCard label="Completion Rate" value={`${stats.completionRate}%`} />
        <StatCard
          label="Overdue"
          value={stats.overdueCount}
          accent={stats.overdueCount > 0 ? "text-red-500" : undefined}
        />
        <StatCard
          label="Completed"
          value={stats.byStatus.find((s) => s.status === "Completed")?.count ?? 0}
          accent="text-green-600"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatusPieChart data={stats.byStatus} />
        {stats.byTopic.length > 0 ? (
          <TopicBarChart data={stats.byTopic} />
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white flex items-center justify-center text-sm text-slate-400 h-[268px]">
            No topics yet
          </div>
        )}
      </div>
    </div>
  );
}