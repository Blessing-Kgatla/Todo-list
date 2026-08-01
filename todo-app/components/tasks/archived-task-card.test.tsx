import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Task } from "@prisma/client";

vi.mock("@/actions/tasks", () => ({ unarchiveTask: vi.fn() }));

import { unarchiveTask } from "@/actions/tasks";
import { ArchivedTaskCard } from "@/components/tasks/archived-task-card";

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 7,
    title: "Old task",
    description: "",
    dueDate: new Date("2020-01-01"),
    topic: "Work",
    status: "Todo",
    archived: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

beforeEach(() => {
  vi.mocked(unarchiveTask).mockReset();
});

describe("ArchivedTaskCard", () => {
  it("renders the task info with a strikethrough title", () => {
    render(<ArchivedTaskCard task={makeTask()} />);
    expect(screen.getByText("Old task")).toBeInTheDocument();
    expect(screen.getByText("Restore")).toBeInTheDocument();
  });

  it("asks for confirmation before restoring", async () => {
    render(<ArchivedTaskCard task={makeTask()} />);
    await userEvent.click(screen.getByText("Restore"));

    expect(screen.getByText("Restore?")).toBeInTheDocument();
    expect(unarchiveTask).not.toHaveBeenCalled();
  });

  it("calls unarchiveTask only after confirming", async () => {
    vi.mocked(unarchiveTask).mockResolvedValue({ success: true });
    render(<ArchivedTaskCard task={makeTask()} />);

    await userEvent.click(screen.getByText("Restore"));
    await userEvent.click(screen.getByText("Yes"));

    await waitFor(() => {
      expect(unarchiveTask).toHaveBeenCalledWith(7);
    });
  });
});