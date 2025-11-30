/**
 * Seed Functions for Test Data
 *
 * These functions are used in E2E tests to set up known database state
 * before each test. This ensures tests are isolated and reproducible.
 *
 * Why seed functions?
 * - Tests need predictable starting state
 * - Each test should start with a clean database
 * - Seed functions make test setup explicit and readable
 *
 * Usage in E2E tests:
 * ```typescript
 * import { clearTodos, seedTodos } from '../db/seeds/todos';
 *
 * test.beforeEach(async () => {
 *   await clearTodos();
 *   await seedTodos([{ description: 'Buy milk' }]);
 * });
 * ```
 *
 * @see contracts/test-api.md for full API documentation
 */

import { db } from "@/db";
import { todosTable } from "@/db/schema";

/**
 * Removes all todos from the database.
 *
 * Call this in beforeEach to ensure each test starts clean.
 * This prevents test pollution where one test's data affects another.
 *
 * @example
 * beforeEach(async () => {
 *   await clearTodos();
 * });
 */
export async function clearTodos(): Promise<void> {
  await db.delete(todosTable);
}

/**
 * Inserts multiple todos into the database.
 *
 * @param todos - Array of todo objects to insert
 * @param todos[].description - The todo text (required)
 * @param todos[].completed - Whether the todo is done (defaults to false)
 *
 * @example
 * await seedTodos([
 *   { description: 'Buy milk' },
 *   { description: 'Walk dog', completed: true }
 * ]);
 */
export async function seedTodos(
  todos: Array<{ description: string; completed?: boolean }>
): Promise<void> {
  if (todos.length === 0) return;

  // Map to include default completed: false
  const todosWithDefaults = todos.map((todo) => ({
    description: todo.description,
    completed: todo.completed ?? false,
  }));

  await db.insert(todosTable).values(todosWithDefaults);
}

/**
 * Inserts a single todo and returns it with its generated ID.
 *
 * Useful when you need the ID for assertions (e.g., clicking a specific todo).
 *
 * @param todo - The todo object to insert
 * @param todo.description - The todo text (required)
 * @param todo.completed - Whether the todo is done (defaults to false)
 * @returns The inserted todo with its generated ID
 *
 * @example
 * const todo = await seedTodo({ description: 'Test todo' });
 * console.log(todo.id); // 1 (or whatever ID was generated)
 */
export async function seedTodo(todo: {
  description: string;
  completed?: boolean;
}): Promise<{ id: number; description: string; completed: boolean }> {
  const result = await db
    .insert(todosTable)
    .values({
      description: todo.description,
      completed: todo.completed ?? false,
    })
    .returning();

  return result[0];
}
