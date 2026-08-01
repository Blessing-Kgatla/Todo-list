import { describe, it, expect, beforeEach, vi } from "vitest";
import { mockReset } from "vitest-mock-extended";

vi.mock("@/lib/prisma");

import { prisma } from "@/lib/prisma";
import { getTasks, getTaskStats, getArchivedTasks } from "@/lib/data";
import type { Task } from "@prisma/client";



beforeEach(() => {
  mockReset(prisma as any);
});

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 1,
    title: "Sample task",
    description: "",
    dueDate: new Date("2020-01-01"),
    topic: "Work",
    status: "Todo",
    archived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe("getTasks", () => {
  it("only fetches non-archived tasks, sorted by the given field, when no filters given", async () => {
    (prisma.task.findMany as any).mockResolvedValue([makeTask()]);

    await getTasks({ sortBy: "topic" });

    expect(prisma.task.findMany).toHaveBeenCalledWith({
      where: { archived: false },
      orderBy: { topic: "asc" },
    });
  });

  it("filters by status and topic when provided", async () => {
    (prisma.task.findMany as any).mockResolvedValue([]);

    await getTasks({ status: "InProgress", topic: "Work" });

    expect(prisma.task.findMany).toHaveBeenCalledWith({
      where: { archived: false, status: "InProgress", topic: "Work" },
      orderBy: { dueDate: "asc" },
    });
  });

  it("searches title and description when a search term is given", async () => {
    (prisma.task.findMany as any).mockResolvedValue([]);

    await getTasks({ search: "milk" });

    expect(prisma.task.findMany).toHaveBeenCalledWith({
      where: {
        archived: false,
        OR: [
          { title: { contains: "milk" } },
          { description: { contains: "milk" } },
        ],
      },
      orderBy: { dueDate: "asc" },
    });
  });
});

describe("getArchivedTasks", () => {
  it("only fetches archived tasks, newest updated first", async () => {
    (prisma.task.findMany as any).mockResolvedValue([]);

    await getArchivedTasks();

    expect(prisma.task.findMany).toHaveBeenCalledWith({
      where: { archived: true },
      orderBy: { updatedAt: "desc" },
    });
  });
});

describe("getTaskStats", () => {
  it("computes totals, topic breakdown, and completion rate", async () => {
    (prisma.task.findMany as any).mockResolvedValue([
      makeTask({ id: 1, status: "Completed", topic: "Work" }),
      makeTask({ id: 2, status: "Todo", topic: "Work" }),
      makeTask({ id: 3, status: "InProgress", topic: "Health" }),
    ]);

    const stats = await getTaskStats();

    expect(stats.total).toBe(3);
    expect(stats.completionRate).toBe(33); // 1 of 3 completed, rounded
    expect(stats.byTopic).toEqual([
      { topic: "Work", count: 2 },
      { topic: "Health", count: 1 },
    ]);
  });

  it("only counts a task as overdue if it's unfinished and past due", async () => {
    const past = new Date("2020-01-01");
    const future = new Date("2999-01-01");

    (prisma.task.findMany as any).mockResolvedValue([
      makeTask({ id: 1, status: "Todo", dueDate: past }),         // overdue
      makeTask({ id: 2, status: "Completed", dueDate: past }),    // not overdue — completed
      makeTask({ id: 3, status: "InProgress", dueDate: future }), // not overdue — future
    ]);

    const stats = await getTaskStats();

    expect(stats.overdueCount).toBe(1);
  });
});