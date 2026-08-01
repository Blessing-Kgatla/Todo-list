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
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" className="h-5 w-5">
        <path
          d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15 1.65 1.65 0 0 0 3.17 14H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.13.44.4.83.76 1.11.36.28.8.43 1.25.43H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
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
    <aside className="flex h-screen w-60 shrink-0 flex-col bg-[var(--sidebar-bg)] text-slate-300">
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
                  ? "bg-[var(--sidebar-active)] text-white"
                  : "text-slate-400 hover:bg-[var(--sidebar-hover)] hover:text-slate-200"
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