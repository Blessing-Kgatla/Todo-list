"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    href: "/dashboard/tasks",
    label: "Tasks",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" className="h-5 w-5">
        <path
          d="M9 11l2.5 2.5L16 8.5M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "/dashboard/analysis",
    label: "Analysis",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" className="h-5 w-5">
        <path
          d="M4 20V10M12 20V4M20 20v-7"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col bg-[#161B22] text-slate-300">
      <div className="px-6 py-6">
        <span className="text-lg font-semibold tracking-tight text-white">
          Todo
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#242C38] text-white"
                  : "text-slate-400 hover:bg-[#1D242E] hover:text-slate-200"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-4 text-xs text-slate-500">v0.1.0</div>
    </aside>
  );
}