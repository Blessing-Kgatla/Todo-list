"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function ViewToggle({ current }: { current: "active" | "archived" }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  function switchTo(view: "active" | "archived") {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", view);
    // reset sort when switching views
    params.delete("sort");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex rounded-lg border border-slate-200 bg-white p-1 w-fit">
      <button
        onClick={() => switchTo("active")}
        className={`rounded-md px-4 py-1.5 text-xs font-medium transition-colors ${
          current === "active"
            ? "bg-[var(--accent)] text-white"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        Active
      </button>
      <button
        onClick={() => switchTo("archived")}
        className={`rounded-md px-4 py-1.5 text-xs font-medium transition-colors ${
          current === "archived"
            ? "bg-[var(--accent)] text-white"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        Archived
      </button>
    </div>
  );
}