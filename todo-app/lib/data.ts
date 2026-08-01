import { prisma } from "@/lib/prisma";
import type { Task } from "@prisma/client";

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