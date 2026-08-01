"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { Status } from "@prisma/client";

type TaskInput = {
  title: string;
  description: string;
  dueDate: string; // comes in as a string from a date input, e.g. "2026-08-15"
  topic: string;
};

export async function createTask(input: TaskInput) {
  const title = input.title.trim();
  const topic = input.topic.trim();

  if (!title) return { error: "Title is required." };
  if (!topic) return { error: "Topic is required." };
  if (!input.dueDate) return { error: "Due date is required." };

  await prisma.task.create({
    data: {
      title,
      description: input.description.trim(),
      dueDate: new Date(input.dueDate),
      topic,
    },
  });

  revalidatePath("/dashboard/tasks");
  return { success: true };
}

export async function updateTask(id: number, input: TaskInput & { status: Status }) {
  const title = input.title.trim();
  const topic = input.topic.trim();

  if (!title) return { error: "Title is required." };
  if (!topic) return { error: "Topic is required." };
  if (!input.dueDate) return { error: "Due date is required." };

  await prisma.task.update({
    where: { id },
    data: {
      title,
      description: input.description.trim(),
      dueDate: new Date(input.dueDate),
      topic,
      status: input.status,
    },
  });

  revalidatePath("/dashboard/tasks");
  return { success: true };
}

export async function archiveTask(id: number) {
  await prisma.task.update({
    where: { id },
    data: { archived: true },
  });

  revalidatePath("/dashboard/tasks");
  return { success: true };
}

export async function unarchiveTask(id: number) {
  await prisma.task.update({
    where: { id },
    data: { archived: false },
  });

  revalidatePath("/dashboard/tasks");
  return { success: true };
}