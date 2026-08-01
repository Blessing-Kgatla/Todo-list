import { prisma } from "@/lib/prisma";
import type { Task, Status } from "@prisma/client";

export type TaskSortField = "topic" | "status" | "dueDate";

export async function getTasks(sortBy: TaskSortField = "dueDate"): Promise<Task[]> {
  return prisma.task.findMany({
    where: { archived: false },
    orderBy: { [sortBy]: "asc" },
  });
}

// Topics the user has already used, so the create/edit form can suggest them
// alongside a default list like "Health", "Work", "School".
export async function getDistinctTopics(): Promise<string[]> {
  const rows = await prisma.task.findMany({
    where: { archived: false },
    distinct: ["topic"],
    select: { topic: true },
  });
  return rows.map((row) => row.topic);
}

export async function getArchivedTasks(): Promise<Task[]> {
  return prisma.task.findMany({
    where: { archived: true },
    orderBy: { updatedAt: "desc" },
  });
}

export type TaskStats = {
  total: number;
  byStatus: { status: Status; count: number }[];
  byTopic: { topic: string; count: number }[];
  overdueCount: number;
  completionRate: number;
};

export async function getTaskStats(): Promise<TaskStats> {
  const tasks = await prisma.task.findMany({ where: { archived: false } });
  const total = tasks.length;

  const statusCounts: Record<Status, number> = { Todo: 0, InProgress: 0, Completed: 0 };
  const topicCounts: Record<string, number> = {};
  let overdueCount = 0;
  const now = new Date();

  for (const task of tasks) {
    statusCounts[task.status]++;
    topicCounts[task.topic] = (topicCounts[task.topic] ?? 0) + 1;
    if (task.status !== "Completed" && new Date(task.dueDate) < now) {
      overdueCount++;
    }
  }

  const byStatus = (Object.keys(statusCounts) as Status[]).map((status) => ({
    status,
    count: statusCounts[status],
  }));

  const byTopic = Object.entries(topicCounts)
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count);

  const completionRate =
    total === 0 ? 0 : Math.round((statusCounts.Completed / total) * 100);

  return { total, byStatus, byTopic, overdueCount, completionRate };
}