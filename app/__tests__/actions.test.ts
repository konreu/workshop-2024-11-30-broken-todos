/**
 * Server Action Unit Tests
 *
 * These tests verify that our Server Actions correctly interact with
 * the database through Drizzle ORM. We mock the database to:
 * - Avoid hitting the real Turso database
 * - Run tests quickly without network calls
 * - Verify the exact operations being performed
 *
 * Key pattern: We import the mock functions to assert on them,
 * then call the real action functions which use the mocked db.
 */

import { revalidatePath } from "next/cache";

import { addTodo, removeTodoAction, toggleTodoAction, getTodos } from "../actions";

// Tell Jest to use our mock instead of the real database
// The mock is automatically loaded from db/__mocks__/index.ts
jest.mock("@/db");

// Import mock functions AFTER the jest.mock call so we get the mocked versions
// TypeScript doesn't know about Jest's mock system, so we ignore the type error
// @ts-expect-error - Jest mocks are not visible to TypeScript
import { mockInsert, mockSelect, mockUpdate, mockDelete, resetMocks } from "@/db";

describe("Server Actions", () => {
  // Reset mocks before each test to ensure test isolation
  // This prevents one test's mock setup from affecting another
  beforeEach(() => {
    resetMocks();
    jest.clearAllMocks();
  });

  describe("addTodo", () => {
    it("inserts a todo with the correct description from FormData", async () => {
      // Arrange: Create a FormData object like a real form submission
      const formData = new FormData();
      formData.set("description", "Buy milk");

      // Act: Call the server action
      await addTodo(formData);

      // Assert: Verify db.insert() was called
      expect(mockInsert).toHaveBeenCalled();

      // Assert: Verify .values() was called with correct data
      // The mock returns an object with a values method, so we check what that was called with
      const insertResult = mockInsert.mock.results[0].value;
      expect(insertResult.values).toHaveBeenCalledWith({
        description: "Buy milk",
      });
    });

    it("calls revalidatePath after inserting", async () => {
      // Arrange
      const formData = new FormData();
      formData.set("description", "Test todo");

      // Act
      await addTodo(formData);

      // Assert: Verify the cache is invalidated so the UI updates
      expect(revalidatePath).toHaveBeenCalledWith("/");
    });
  });

  describe("removeTodoAction", () => {
    it("deletes a todo with the correct ID", async () => {
      // Arrange: The ID of the todo to delete
      const todoId = 42;

      // Act: Call the server action
      await removeTodoAction(todoId);

      // Assert: Verify db.delete() was called
      expect(mockDelete).toHaveBeenCalled();

      // Assert: Verify .where() was called (the eq() condition is internal)
      const deleteResult = mockDelete.mock.results[0].value;
      expect(deleteResult.where).toHaveBeenCalled();
    });

    it("calls revalidatePath after deleting", async () => {
      // Act
      await removeTodoAction(1);

      // Assert: Cache should be invalidated
      expect(revalidatePath).toHaveBeenCalledWith("/");
    });
  });

  describe("toggleTodoAction", () => {
    it("updates a todo with the correct ID", async () => {
      // Arrange
      const todoId = 7;

      // Act
      await toggleTodoAction(todoId);

      // Assert: Verify db.update() was called
      expect(mockUpdate).toHaveBeenCalled();

      // Assert: Verify the chain .set().where() was called
      const updateResult = mockUpdate.mock.results[0].value;
      expect(updateResult.set).toHaveBeenCalled();

      const setResult = updateResult.set.mock.results[0].value;
      expect(setResult.where).toHaveBeenCalled();
    });

    it("calls revalidatePath after toggling", async () => {
      // Act
      await toggleTodoAction(1);

      // Assert
      expect(revalidatePath).toHaveBeenCalledWith("/");
    });
  });

  describe("getTodos", () => {
    it("selects from the todos table", async () => {
      // Arrange: Configure mock to return some todos
      mockSelect.mockReturnValue({
        from: jest.fn().mockResolvedValue([{ id: 1, description: "Test todo", completed: false }]),
      });

      // Act
      const todos = await getTodos();

      // Assert: Verify db.select() was called
      expect(mockSelect).toHaveBeenCalled();

      // Assert: Verify .from() was called
      const selectResult = mockSelect.mock.results[0].value;
      expect(selectResult.from).toHaveBeenCalled();

      // Assert: Verify we got the mocked data back
      expect(todos).toEqual([{ id: 1, description: "Test todo", completed: false }]);
    });

    it("returns empty array when no todos exist", async () => {
      // Arrange: Default mock returns empty array
      // (resetMocks already sets this up)

      // Act
      const todos = await getTodos();

      // Assert
      expect(todos).toEqual([]);
    });
  });

  // This test verifies our mocking strategy works correctly
  describe("Mock Database Verification", () => {
    it("intercepts all Drizzle operations (no real Turso calls)", async () => {
      // This test confirms that all database operations go through our mock.
      // If any operation hit the real database, it would either:
      // 1. Fail (no database connection in test environment)
      // 2. Not trigger our mock assertions

      const formData = new FormData();
      formData.set("description", "Verify mocking");

      // These should all complete without errors, proving they use mocks
      await addTodo(formData);
      await getTodos();
      await toggleTodoAction(1);
      await removeTodoAction(1);

      // All operations should have been intercepted
      expect(mockInsert).toHaveBeenCalledTimes(1);
      expect(mockSelect).toHaveBeenCalledTimes(1);
      expect(mockUpdate).toHaveBeenCalledTimes(1);
      expect(mockDelete).toHaveBeenCalledTimes(1);
    });
  });
});
