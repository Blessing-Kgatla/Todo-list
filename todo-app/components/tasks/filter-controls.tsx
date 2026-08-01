"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Status } from "@prisma/client";

const STATUS_OPTIONS: { label: string; value: Status | "" }[] = [
  { label: "All Statuses", value: "" },
  { label: "Todo", value: "Todo" },
  { label: "In Progress", value: "InProgress" },
  { label: "Completed", value: "Completed" },
];

export function FilterControls({ topics }: { topics: string[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={searchParams.get("status") ?? ""}
        onChange={(e) => updateParam("status", e.target.value)}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        value={searchParams.get("topic") ?? ""}
        onChange={(e) => updateParam("topic", e.target.value)}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
      >
        <option value="">All Topics</option>
        {topics.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
  );
}