"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const VALID_THEMES = ["blue", "purple", "mono"] as const;
type ThemeId = (typeof VALID_THEMES)[number];

export async function updateTheme(theme: string) {
  if (!VALID_THEMES.includes(theme as ThemeId)) {
    return { error: "Invalid theme." };
  }

  await prisma.settings.upsert({
    where: { id: 1 },
    update: { theme },
    create: { id: 1, theme },
  });

  // "layout" tells Next.js to re-render the root layout too, not just the page
  revalidatePath("/", "layout");
  return { success: true };
}