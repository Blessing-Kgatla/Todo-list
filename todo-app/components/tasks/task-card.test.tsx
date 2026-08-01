import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Task } from "@prisma/client";

vi.mock("@/actions/tasks", () => ({
  updateTask: vi.fn(),
  archiveTask: vi.fn(),
}));

import { updateTask, archiveTask } from "@/actions/tasks";
import { TaskCard } from "@/components/tasks/task-card";

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 1,
    title: "Buy milk",
    description: "2%",
    dueDate: new Date("2999-01-01"), // far future by default — not overdue
    topic: "Errands",
    status: "Todo",
    archived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

beforeEach(() => {
  vi.mocked(updateTask).mockReset();
  vi.mocked(archiveTask).mockReset();
});

describe("TaskCard — collapsed view", () => {
  it("shows the title, topic, due date and status", () => {
    render(<TaskCard task={makeTask()} />);
    expect(screen.getByText("Buy milk")).toBeInTheDocument();
    expect(screen.getByText("Errands")).toBeInTheDocument();
    expect(screen.getByText("Todo")).toBeInTheDocument();
  });

  it("shows an Overdue badge only when unfinished and past due", () => {
    const { rerender } = render(
      <TaskCard task={makeTask({ dueDate: new Date("2020-01-01"), status: "Todo" })} />
    );
    expect(screen.getByText("Overdue")).toBeInTheDocument();

    rerender(<TaskCard task={makeTask({ dueDate: new Date("2020-01-01"), status: "Completed" })} />);
    expect(screen.queryByText("Overdue")).not.toBeInTheDocument();
  });
});

describe("TaskCard — edit flow", () => {
  it("expands to show editable fields when clicked", async () => {
    render(<TaskCard task={makeTask()} />);
    await userEvent.click(screen.getByText("Buy milk"));
    expect(screen.getByDisplayValue("Buy milk")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("calls updateTask with edited values and the selected status", async () => {
    vi.mocked(updateTask).mockResolvedValue({ success: true });
    render(<TaskCard task={makeTask()} />);

    await userEvent.click(screen.getByText("Buy milk"));
    const titleInput = screen.getByDisplayValue("Buy milk");
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, "Buy oat milk");
    await userEvent.click(screen.getByText("In Progress"));
    await userEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(updateTask).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ title: "Buy oat milk", status: "InProgress" })
      );
    });
  });

  it("resets fields and collapses on Cancel", async () => {
    render(<TaskCard task={makeTask()} />);

    await userEvent.click(screen.getByText("Buy milk"));
    const titleInput = screen.getByDisplayValue("Buy milk");
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, "Something else");
    await userEvent.click(screen.getByText("Cancel"));

    // collapsed again, original title shown, edit not saved
    expect(screen.getByText("Buy milk")).toBeInTheDocument();
    expect(updateTask).not.toHaveBeenCalled();
  });
});

describe("TaskCard — archive flow", () => {
  it("asks for inline confirmation before archiving", async () => {
    render(<TaskCard task={makeTask()} />);
    await userEvent.click(screen.getByText("Buy milk"));
    await userEvent.click(screen.getByText("Archive task"));

    expect(screen.getByText("Archive this task?")).toBeInTheDocument();
    expect(archiveTask).not.toHaveBeenCalled();
  });

  it("only archives after confirming", async () => {
    vi.mocked(archiveTask).mockResolvedValue({ success: true });
    render(<TaskCard task={makeTask()} />);

    await userEvent.click(screen.getByText("Buy milk"));
    await userEvent.click(screen.getByText("Archive task"));
    await userEvent.click(screen.getByText("Yes, archive"));

    await waitFor(() => {
      expect(archiveTask).toHaveBeenCalledWith(1);
    });
  });

  it("cancels the archive confirmation without calling archiveTask", async () => {
    render(<TaskCard task={makeTask()} />);

    await userEvent.click(screen.getByText("Buy milk"));
    await userEvent.click(screen.getByText("Archive task"));
    await userEvent.click(screen.getByText("No")); // was "Cancel"

    expect(screen.queryByText("Archive this task?")).not.toBeInTheDocument();
    expect(archiveTask).not.toHaveBeenCalled();
    });
});