"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { TaskSortField } from "@/lib/data";

const OPTIONS: { label: string; value: TaskSortField }[] = [
  { label: "Due Date", value: "dueDate" },
  { label: "Status", value: "status" },
  { label: "Topic", value: "topic" },
];

export function SortControls({ current }: { current: TaskSortField }) {
  const pathname = usePathname();

  return (
    <div className="mt-6 flex items-center gap-2">
      <span className="text-xs text-slate-400 font-medium">Sort by</span>
      {OPTIONS.map((opt) => {
        const isActive = current === opt.value;
        return (
          <Link
            key={opt.value}
            href={`${pathname}?sort=${opt.value}`}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              isActive
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300"
            }`}
          >
            {opt.label}
          </Link>
        );
      })}
    </div>
  );
}