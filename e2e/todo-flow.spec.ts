/**
 * E2E Tests: Todo Application User Flows
 *
 * These tests verify the complete user experience of the todo app
 * using Playwright. The dev server is auto-started via webServer config.
 *
 * Test Strategy:
 * - Each test starts with a clean database state (clearTodos)
 * - Tests cover the main user journeys: view, add, toggle, delete
 * - We use seed functions to set up specific test scenarios
 */
import { test, expect } from "@playwright/test";
import { clearTodos, seedTodos, seedTodo } from "../db/seeds/todos";

test.describe("Todo Application", () => {
  // Clear the database before each test for isolation
  test.beforeEach(async () => {
    await clearTodos();
  });

  test("home page loads and shows todo list", async ({ page }) => {
    // Navigate to the app
    await page.goto("/");

    // Verify the page loaded (check for heading or main content)
    await expect(page).toHaveTitle(/todo/i);

    // The empty state should show when no todos exist
    await expect(page.getByText(/no todos yet/i)).toBeVisible();
  });

  test("can add a new todo", async ({ page }) => {
    await page.goto("/");

    // Type in the input field
    const input = page.getByRole("textbox", { name: /description/i });
    await input.fill("Buy groceries");

    // Submit the form
    await page.getByRole("button", { name: /add/i }).click();

    // Verify the todo appears in the list
    await expect(page.getByText("Buy groceries")).toBeVisible();

    // Empty state should no longer be visible
    await expect(page.getByText(/no todos yet/i)).not.toBeVisible();
  });

  test("can toggle a todo complete", async ({ page }) => {
    // Seed a todo first
    await seedTodo({ description: "Walk the dog" });

    await page.goto("/");

    // Verify the todo is initially incomplete (no line-through)
    const todoText = page.getByText("Walk the dog");
    await expect(todoText).toBeVisible();
    await expect(todoText).not.toHaveCSS("text-decoration-line", "line-through");

    // Click the toggle button to mark as complete
    const toggleButton = page.getByRole("button", { name: /mark as complete/i });
    await toggleButton.click();

    // Verify it now shows as completed (line-through style)
    await expect(todoText).toHaveCSS("text-decoration-line", "line-through");

    // The button label should change
    await expect(page.getByRole("button", { name: /mark as incomplete/i })).toBeVisible();
  });

  test("can delete a todo", async ({ page }) => {
    // Seed a todo
    await seedTodo({ description: "Finish homework" });

    await page.goto("/");

    // Verify the todo exists
    await expect(page.getByText("Finish homework")).toBeVisible();

    // Find and click the delete button
    // The delete button may be hidden until hover, so we force click
    const deleteButton = page.getByRole("button", { name: /delete/i });
    await deleteButton.click({ force: true });

    // Verify the todo is removed
    await expect(page.getByText("Finish homework")).not.toBeVisible();

    // Empty state should appear since we deleted the only todo
    await expect(page.getByText(/no todos yet/i)).toBeVisible();
  });

  test("can add multiple todos and see them all", async ({ page }) => {
    await page.goto("/");

    // Add first todo
    await page.getByRole("textbox", { name: /description/i }).fill("First task");
    await page.getByRole("button", { name: /add/i }).click();
    await expect(page.getByText("First task")).toBeVisible();

    // Add second todo
    await page.getByRole("textbox", { name: /description/i }).fill("Second task");
    await page.getByRole("button", { name: /add/i }).click();
    await expect(page.getByText("Second task")).toBeVisible();

    // Both should be visible
    await expect(page.getByText("First task")).toBeVisible();
    await expect(page.getByText("Second task")).toBeVisible();
  });

  test("seed functions work correctly in E2E context", async ({ page }) => {
    // This test verifies that seedTodos() properly populates the database
    // and the app correctly displays the seeded data
    await seedTodos([
      { description: "Seeded task 1", completed: false },
      { description: "Seeded task 2", completed: true },
      { description: "Seeded task 3", completed: false },
    ]);

    await page.goto("/");

    // All three todos should be visible
    await expect(page.getByText("Seeded task 1")).toBeVisible();
    await expect(page.getByText("Seeded task 2")).toBeVisible();
    await expect(page.getByText("Seeded task 3")).toBeVisible();

    // The completed todo should have line-through styling
    const completedTodo = page.getByText("Seeded task 2");
    await expect(completedTodo).toHaveCSS("text-decoration-line", "line-through");
  });

  test("toggling completed todo back to incomplete works", async ({ page }) => {
    // Seed a completed todo
    await seedTodo({ description: "Already done", completed: true });

    await page.goto("/");

    // Verify it starts as completed
    const todoText = page.getByText("Already done");
    await expect(todoText).toHaveCSS("text-decoration-line", "line-through");

    // Click to toggle back to incomplete
    const toggleButton = page.getByRole("button", { name: /mark as incomplete/i });
    await toggleButton.click();

    // Verify it's now incomplete
    await expect(todoText).not.toHaveCSS("text-decoration-line", "line-through");
  });
});
