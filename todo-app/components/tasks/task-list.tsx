import type { Task } from "@prisma/client";
import { TaskCard } from "@/components/tasks/task-card";

export function TaskList({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return (
      <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-400">
        No tasks yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}