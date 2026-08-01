import { describe, it, expect, beforeEach, vi } from "vitest";
import { mockReset } from "vitest-mock-extended";

vi.mock("@/lib/prisma");
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { prisma } from "@/lib/prisma";
import { createTask, updateTask, archiveTask, unarchiveTask } from "@/actions/tasks";

beforeEach(() => {
  mockReset(prisma as any);
});

describe("createTask", () => {
  it("rejects an empty title", async () => {
    const result = await createTask({ title: "   ", description: "", dueDate: "2026-01-01", topic: "Work" });
    expect(result.error).toBe("Title is required.");
    expect(prisma.task.create).not.toHaveBeenCalled();
  });

  it("rejects a missing topic", async () => {
    const result = await createTask({ title: "Buy milk", description: "", dueDate: "2026-01-01", topic: "  " });
    expect(result.error).toBe("Topic is required.");
  });

  it("rejects a missing due date", async () => {
    const result = await createTask({ title: "Buy milk", description: "", dueDate: "", topic: "Work" });
    expect(result.error).toBe("Due date is required.");
  });

    it("rejects an empty title", async () => {
        const result = await updateTask(1, {
            title: "  ",
            description: "",
            dueDate: "2026-01-01",
            topic: "Work",
            status: "Todo",
        });
        expect(result.error).toBe("Title is required.");
        expect(prisma.task.update).not.toHaveBeenCalled();
    });

    it("rejects a missing topic", async () => {
        const result = await updateTask(1, {
            title: "Task",
            description: "",
            dueDate: "2026-01-01",
            topic: " ",
            status: "Todo",
        });
        expect(result.error).toBe("Topic is required.");
    });

    it("rejects a missing due date", async () => {
        const result = await updateTask(1, {
            title: "Task",
            description: "",
            dueDate: "",
            topic: "Work",
            status: "Todo",
        });
        expect(result.error).toBe("Due date is required.");
    });


  it("trims fields and creates the task when input is valid", async () => {
    (prisma.task.create as any).mockResolvedValue({});

    const result = await createTask({
      title: "  Buy milk  ",
      description: "  2%  ",
      dueDate: "2026-01-01",
      topic: "  Errands  ",
    });

    expect(result.success).toBe(true);
    expect(prisma.task.create).toHaveBeenCalledWith({
      data: {
        title: "Buy milk",
        description: "2%",
        dueDate: new Date("2026-01-01"),
        topic: "Errands",
      },
    });
  });
});

describe("archiveTask", () => {
  it("sets archived to true instead of deleting", async () => {
    (prisma.task.update as any).mockResolvedValue({});
    await archiveTask(5);
    expect(prisma.task.update).toHaveBeenCalledWith({ where: { id: 5 }, data: { archived: true } });
  });
});

describe("unarchiveTask", () => {
  it("sets archived back to false", async () => {
    (prisma.task.update as any).mockResolvedValue({});
    await unarchiveTask(5);
    expect(prisma.task.update).toHaveBeenCalledWith({ where: { id: 5 }, data: { archived: false } });
  });
});

describe("updateTask", () => {
  it("updates all editable fields including status", async () => {
    (prisma.task.update as any).mockResolvedValue({});

    await updateTask(3, {
      title: "Renamed",
      description: "New desc",
      dueDate: "2026-02-01",
      topic: "Health",
      status: "InProgress",
    });

    expect(prisma.task.update).toHaveBeenCalledWith({
      where: { id: 3 },
      data: {
        title: "Renamed",
        description: "New desc",
        dueDate: new Date("2026-02-01"),
        topic: "Health",
        status: "InProgress",
      },
    });
  });
});