import { getTasks, getArchivedTasks, getDistinctTopics } from "@/lib/data";
import { TaskList } from "@/components/tasks/task-list";
import { SortControls } from "@/components/tasks/sort-controls";
import { CreateTaskForm } from "@/components/tasks/create-task-form";
import { ViewToggle } from "@/components/tasks/view-toggle";
import { ArchivedTaskCard } from "@/components/tasks/archived-task-card";
import { SearchBar } from "@/components/tasks/search-bar";
import { FilterControls } from "@/components/tasks/filter-controls";
import type { TaskSortField } from "@/lib/data";
import type { Status } from "@prisma/client";

type Props = {
  searchParams: Promise<{
    sort?: string;
    view?: string;
    search?: string;
    status?: string;
    topic?: string;
  }>;
};

export default async function TasksPage({ searchParams }: Props) {
  const { sort, view, search, status, topic } = await searchParams;

  const isArchived = view === "archived";
  const validSorts: TaskSortField[] = ["dueDate", "status", "topic"];
  const sortBy = validSorts.includes(sort as TaskSortField)
    ? (sort as TaskSortField)
    : "dueDate";

  const validStatuses: Status[] = ["Todo", "InProgress", "Completed"];
  const statusFilter = validStatuses.includes(status as Status)
    ? (status as Status)
    : undefined;

  const [tasks, topics] = await Promise.all([
    isArchived
      ? getArchivedTasks()
      : getTasks({ sortBy, search, status: statusFilter, topic }),
    getDistinctTopics(),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Tasks</h1>
          <p className="mt-1 text-sm text-slate-500">
            {tasks.length} {isArchived ? "archived" : "active"}{" "}
            {tasks.length === 1 ? "task" : "tasks"}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <ViewToggle current={isArchived ? "archived" : "active"} />
          {!isArchived && <CreateTaskForm />}
        </div>

        {!isArchived && (
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <SearchBar />
            <FilterControls topics={topics} />
          </div>
        )}

        {!isArchived && <SortControls current={sortBy} />}

        {isArchived ? (
          tasks.length === 0 ? (
            <div className="mt-2 rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-400">
              No archived tasks.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {tasks.map((task) => (
                <ArchivedTaskCard key={task.id} task={task} />
              ))}
            </div>
          )
        ) : (
          <TaskList tasks={tasks} />
        )}
      </div>
    </div>
  );
}