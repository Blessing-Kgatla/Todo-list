"use client";

import { useState } from "react";
import { createTask } from "@/actions/tasks";

const SUGGESTED_TOPICS = ["Health", "Work", "School", "Personal", "Finance", "Other"];

export function CreateTaskForm() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [topic, setTopic] = useState("");

  async function handleSubmit() {
    setLoading(true);
    setError(null);

    const result = await createTask({ title, description, dueDate, topic });

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    // reset
    setTitle("");
    setDescription("");
    setDueDate("");
    setTopic("");
    setOpen(false);
    setLoading(false);
  }

  return (
    <div>
      {/* Toggle button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
        >
          + New Task
        </button>
      )}

      {/* Inline form */}
      {open && (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">New Task</h2>

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
                placeholder="e.g. Buy groceries"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
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
                placeholder="Optional details..."
                rows={3}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
              />
            </div>

            {/* Due Date + Topic side by side */}
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
                  placeholder="Type or pick below"
                  list="topic-suggestions"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
                <datalist id="topic-suggestions">
                  {SUGGESTED_TOPICS.map((t) => (
                    <option key={t} value={t} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs text-red-500">{error}</p>
            )}

            {/* Actions */}
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => { setOpen(false); setError(null); }}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Task"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}