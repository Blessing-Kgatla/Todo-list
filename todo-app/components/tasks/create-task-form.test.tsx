import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/actions/tasks", () => ({ createTask: vi.fn() }));

import { createTask } from "@/actions/tasks";
import { CreateTaskForm } from "@/components/tasks/create-task-form";

beforeEach(() => {
  vi.mocked(createTask).mockReset();
});

describe("CreateTaskForm", () => {
  it("shows only the toggle button initially", () => {
    render(<CreateTaskForm />);
    expect(screen.getByText("+ New Task")).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("e.g. Buy groceries")).not.toBeInTheDocument();
  });

  it("reveals the form fields when clicked", async () => {
    render(<CreateTaskForm />);
    await userEvent.click(screen.getByText("+ New Task"));
    expect(screen.getByPlaceholderText("e.g. Buy groceries")).toBeInTheDocument();
  });

  it("calls createTask with entered values and closes the form on success", async () => {
    vi.mocked(createTask).mockResolvedValue({ success: true });
    render(<CreateTaskForm />);

    await userEvent.click(screen.getByText("+ New Task"));
    await userEvent.type(screen.getByPlaceholderText("e.g. Buy groceries"), "Buy milk");
    await userEvent.type(screen.getByPlaceholderText("Type or pick below"), "Errands");
    await userEvent.click(screen.getByText("Save Task"));

    await waitFor(() => {
      expect(createTask).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Buy milk", topic: "Errands" })
      );
    });
    await waitFor(() => {
      expect(screen.queryByPlaceholderText("e.g. Buy groceries")).not.toBeInTheDocument();
    });
  });

  it("shows the error and keeps the form open if the action fails", async () => {
    vi.mocked(createTask).mockResolvedValue({ error: "Title is required." });
    render(<CreateTaskForm />);

    await userEvent.click(screen.getByText("+ New Task"));
    await userEvent.click(screen.getByText("Save Task"));

    await waitFor(() => {
      expect(screen.getByText("Title is required.")).toBeInTheDocument();
    });
    expect(screen.getByPlaceholderText("e.g. Buy groceries")).toBeInTheDocument();
  });
});