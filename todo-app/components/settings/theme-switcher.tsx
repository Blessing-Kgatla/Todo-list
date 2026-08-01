"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateTheme } from "@/actions/settings";

const THEMES = [
  { id: "blue", label: "Blue", accent: "#2563EB", sidebar: "#161B22" },
  { id: "purple", label: "Light Purple", accent: "#7C3AED", sidebar: "#1E1B29" },
  { id: "mono", label: "Black & White", accent: "#0F172A", sidebar: "#0F172A" },
];

export function ThemeSwitcher({ current }: { current: string }) {
  const router = useRouter();
  const [selected, setSelected] = useState(current);
  const [pending, startTransition] = useTransition();

  async function handleSelect(themeId: string) {
    setSelected(themeId);
    await updateTheme(themeId);
    startTransition(() => router.refresh());
  }

  return (
    <div className="grid grid-cols-3 gap-4 max-w-xl">
      {THEMES.map((theme) => {
        const isActive = selected === theme.id;
        return (
          <button
            key={theme.id}
            onClick={() => handleSelect(theme.id)}
            disabled={pending}
            className={`rounded-xl border-2 p-4 text-left transition-colors disabled:opacity-60 ${
              isActive ? "border-slate-900" : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex gap-1.5 mb-3">
              <span className="h-6 w-6 rounded-full" style={{ backgroundColor: theme.sidebar }} />
              <span className="h-6 w-6 rounded-full" style={{ backgroundColor: theme.accent }} />
              <span className="h-6 w-6 rounded-full border border-slate-200 bg-white" />
            </div>
            <p className="text-sm font-medium text-slate-900">{theme.label}</p>
            {isActive && <p className="text-xs text-slate-400 mt-0.5">Active</p>}
          </button>
        );
      })}
    </div>
  );
}