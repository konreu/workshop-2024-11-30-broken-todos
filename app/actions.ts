"use server";

import { revalidatePath } from "next/cache";
import { eq, asc, sql } from "drizzle-orm";

import { db } from "@/db";
import { todosTable } from "@/db/schema";

export async function addTodo(formData: FormData) {
  const description = formData.get("description") as string;

  const [maxPosition] = await db.select({ max: sql`MAX(position)` }).from(todosTable);
  const newPosition = (maxPosition?.max ?? 0) + 1000;

  await db.insert(todosTable).values({
    description,
    position: newPosition,
  });

  revalidatePath("/");
}

export async function removeTodoAction(id: number) {
  // Remove the todo from database
  db.delete(todosTable).where(eq(todosTable.id, id));
}

export async function toggleTodoAction(id: number) {
  // Get current state and toggle it
  const todo = await db.select().from(todosTable).where(eq(todosTable.id, id));
  if (todo.length === 0) return;

  const newCompleted = !todo[0].completed;

  // Update the todo
  db.update(todosTable).set({ completed: newCompleted }).where(eq(todosTable.id, id));
}

export async function getTodos() {
  return await db.select().from(todosTable).orderBy(asc(todosTable.position), asc(todosTable.id));
}

export async function reorderTodosAction(todoId: number, newPosition: number) {
  await db.update(todosTable).set({ position: newPosition }).where(eq(todosTable.id, todoId));

  revalidatePath("/");
}
