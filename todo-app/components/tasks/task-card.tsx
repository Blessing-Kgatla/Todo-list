"use client";

import { useState } from "react";
import type { Task, Status } from "@prisma/client";
import { updateTask, archiveTask } from "@/actions/tasks";

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

const SUGGESTED_TOPICS = ["Health", "Work", "School", "Personal", "Finance", "Other"];
const STATUSES: Status[] = ["Todo", "InProgress", "Completed"];

export function TaskCard({ task }: { task: Task }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(
    new Date(task.dueDate).toISOString().split("T")[0]
  );
  const [topic, setTopic] = useState(task.topic);
  const [status, setStatus] = useState<Status>(task.status);

  const [confirmArchive, setConfirmArchive] = useState(false);

  const isOverdue =
    task.status !== "Completed" && new Date(task.dueDate) < new Date();

  const formattedDate = new Date(task.dueDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  function handleCancel() {
    // reset to original values
    setTitle(task.title);
    setDescription(task.description);
    setDueDate(new Date(task.dueDate).toISOString().split("T")[0]);
    setTopic(task.topic);
    setStatus(task.status);
    setError(null);
    setOpen(false);
  }

  async function handleSave() {
    setLoading(true);
    setError(null);

    const result = await updateTask(task.id, {
      title,
      description,
      dueDate,
      topic,
      status,
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setLoading(false);
    setOpen(false);
  }

  async function handleArchive() {
    setLoading(true);
    await archiveTask(task.id);
}

  // ── Collapsed view ───────────────────────────────────────────────
  if (!open) {
    return (
      <div
        onClick={() => setOpen(true)}
        className="rounded-xl border border-slate-200 bg-white px-5 py-4 flex items-start justify-between gap-4 cursor-pointer hover:border-slate-300 hover:shadow-sm transition-all"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-slate-900 text-sm">{task.title}</span>
            {isOverdue && (
              <span className="rounded-full bg-red-50 border border-red-200 px-2 py-0.5 text-xs text-red-500 font-medium">
                Overdue
              </span>
            )}
          </div>
          {task.description && (
            <p className="mt-1 text-xs text-slate-400 line-clamp-2">
              {task.description}
            </p>
          )}
          <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
            <span>{task.topic}</span>
            <span>·</span>
            <span className={isOverdue ? "text-red-400" : ""}>
              Due {formattedDate}
            </span>
          </div>
        </div>

        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[task.status]}`}>
          {STATUS_LABELS[task.status]}
        </span>
      </div>
    );
  }

  // ── Expanded / edit view ─────────────────────────────────────────
  return (
    <div className="rounded-xl border border-slate-300 bg-white px-6 py-5 shadow-sm">
      <div className="flex flex-col gap-4">

        {/* Title */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
          />
        </div>

        {/* Due Date + Topic */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Due Date <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Topic <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              list="topic-suggestions-edit"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            <datalist id="topic-suggestions-edit">
              {SUGGESTED_TOPICS.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-2">
            Status
          </label>
          <div className="flex gap-2">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors ${
                  status === s
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 text-slate-500 hover:border-slate-300"
                }`}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && <p className="text-xs text-red-500">{error}</p>}

        {/* Actions */}
        <div className="flex items-center justify-between pt-1">
          {!confirmArchive ? (
            <button
                onClick={() => setConfirmArchive(true)}
                disabled={loading}
                className="text-xs text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
            >
                Archive task
            </button>
            ) : (
            <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Archive this task?</span>
                <button
                onClick={handleArchive}
                disabled={loading}
                className="text-xs font-medium text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
                >
                {loading ? "Archiving..." : "Yes, archive"}
                </button>
                <button
                  onClick={() => setConfirmArchive(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                >
                  No
                </button>
            </div>
            )}

          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}