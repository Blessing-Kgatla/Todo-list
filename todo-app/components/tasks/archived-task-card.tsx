"use client";

import { useState } from "react";
import type { Task, Status } from "@prisma/client";
import { unarchiveTask } from "@/actions/tasks";

const STATUS_STYLES: Record<Status, string> = {
  Todo: "bg-slate-100 text-slate-600",
  InProgress: "bg-blue-50 text-blue-600",
  Completed: "bg-green-50 text-green-600",
};

const STATUS_LABELS: Record<Status, string> = {
  Todo: "Todo",
  InProgress: "In Progress",
  Completed: "Completed",
};



export function ArchivedTaskCard({ task }: { task: Task }) {
    const [loading, setLoading] = useState(false);
    const [confirmRestore, setConfirmRestore] = useState(false);
    const formattedDate = new Date(task.dueDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
});

async function handleUnarchive() {
    setLoading(true);
    await unarchiveTask(task.id);
} 

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 flex items-start justify-between gap-4 opacity-75">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-slate-500 text-sm line-through">
            {task.title}
          </span>
        </div>
        {task.description && (
          <p className="mt-1 text-xs text-slate-400 line-clamp-2">
            {task.description}
          </p>
        )}
        <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
          <span>{task.topic}</span>
          <span>·</span>
          <span>Due {formattedDate}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[task.status]}`}>
          {STATUS_LABELS[task.status]}
        </span>
        {!confirmRestore ? (
            <button
                onClick={() => setConfirmRestore(true)}
                disabled={loading}
                className="text-xs text-slate-400 hover:text-slate-700 transition-colors disabled:opacity-50"
            >
                Restore
            </button>
            ) : (
            <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Restore?</span>
                <button
                onClick={handleUnarchive}
                disabled={loading}
                className="text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors disabled:opacity-50"
                >
                {loading ? "Restoring..." : "Yes"}
                </button>
                <button
                onClick={() => setConfirmRestore(false)}
                className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                >
                No
                </button>
            </div>
            )}
      </div>
    </div>
  );
}