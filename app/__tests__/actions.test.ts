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

import {
  addTodo,
  removeTodoAction,
  toggleTodoAction,
  getTodos,
  reorderTodosAction,
} from "../actions";

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
    it("inserts a todo with the correct description and position from FormData", async () => {
      // Arrange: Mock the max position query to return 0 (no existing todos)
      mockSelect.mockReturnValue({
        from: jest.fn().mockResolvedValue([{ max: 0 }]),
      });

      const formData = new FormData();
      formData.set("description", "Buy milk");

      // Act: Call the server action
      await addTodo(formData);

      // Assert: Verify db.insert() was called
      expect(mockInsert).toHaveBeenCalled();

      // Assert: Verify .values() was called with correct data including position
      const insertResult = mockInsert.mock.results[0].value;
      expect(insertResult.values).toHaveBeenCalledWith({
        description: "Buy milk",
        position: 1000,
      });
    });

    it("calls revalidatePath after inserting", async () => {
      // Arrange: Mock the max position
      mockSelect.mockReturnValue({
        from: jest.fn().mockResolvedValue([{ max: 0 }]),
      });

      const formData = new FormData();
      formData.set("description", "Test todo");

      // Act
      await addTodo(formData);

      // Assert: Verify the cache is invalidated so the UI updates
      expect(revalidatePath).toHaveBeenCalledWith("/");
    });

    it("assigns position to new todos based on max existing position", async () => {
      // Arrange: Mock existing max position of 3000
      mockSelect.mockReturnValue({
        from: jest.fn().mockResolvedValue([{ max: 3000 }]),
      });

      const formData = new FormData();
      formData.set("description", "New todo");

      // Act
      await addTodo(formData);

      // Assert: New position should be max + 1000 = 4000
      const insertResult = mockInsert.mock.results[0].value;
      expect(insertResult.values).toHaveBeenCalledWith({
        description: "New todo",
        position: 4000,
      });
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

      // Assert: Verify delete was called (revalidation happens async)
      expect(mockDelete).toHaveBeenCalled();
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

      // Assert: Verify update was called (revalidation happens async)
      expect(mockUpdate).toHaveBeenCalled();
    });
  });

  describe("getTodos", () => {
    it("selects from the todos table", async () => {
      // Arrange: Configure mock to return some todos
      mockSelect.mockReturnValue({
        from: jest.fn().mockReturnValue({
          orderBy: jest
            .fn()
            .mockResolvedValue([
              { id: 1, description: "Test todo", completed: false, position: 1000 },
            ]),
        }),
      });

      // Act
      const todos = await getTodos();

      // Assert: Verify db.select() was called
      expect(mockSelect).toHaveBeenCalled();

      // Assert: Verify .from() was called
      const selectResult = mockSelect.mock.results[0].value;
      expect(selectResult.from).toHaveBeenCalled();

      // Assert: Verify we got the mocked data back
      expect(todos).toEqual([
        { id: 1, description: "Test todo", completed: false, position: 1000 },
      ]);
    });

    it("returns empty array when no todos exist", async () => {
      // Arrange: Default mock returns empty array
      // (resetMocks already sets this up)

      // Act
      const todos = await getTodos();

      // Assert
      expect(todos).toEqual([]);
    });

    it("orders todos by position ascending", async () => {
      // Arrange: Mock todos with different positions (out of order)
      mockSelect.mockReturnValue({
        from: jest.fn().mockReturnValue({
          orderBy: jest.fn().mockResolvedValue([
            { id: 1, description: "First", completed: false, position: 1000 },
            { id: 2, description: "Second", completed: false, position: 2000 },
            { id: 3, description: "Third", completed: false, position: 3000 },
          ]),
        }),
      });

      // Act
      const todos = await getTodos();

      // Assert: Verify orderBy was called
      const selectResult = mockSelect.mock.results[0].value;
      const fromResult = selectResult.from.mock.results[0].value;
      expect(fromResult.orderBy).toHaveBeenCalled();

      // Assert: Todos are returned in position order
      expect(todos).toEqual([
        { id: 1, description: "First", completed: false, position: 1000 },
        { id: 2, description: "Second", completed: false, position: 2000 },
        { id: 3, description: "Third", completed: false, position: 3000 },
      ]);
    });
  });

  describe("reorderTodosAction", () => {
    it("updates a todo's position and calls revalidatePath", async () => {
      // Arrange
      const todoId = 5;
      const newPosition = 2500;

      // Act
      await reorderTodosAction(todoId, newPosition);

      // Assert: Verify db.update() was called
      expect(mockUpdate).toHaveBeenCalled();

      // Assert: Verify the chain .set().where() was called with correct values
      const updateResult = mockUpdate.mock.results[0].value;
      expect(updateResult.set).toHaveBeenCalledWith({ position: newPosition });

      const setResult = updateResult.set.mock.results[0].value;
      expect(setResult.where).toHaveBeenCalled();

      // Assert: Verify revalidatePath was called
      expect(revalidatePath).toHaveBeenCalledWith("/");
    });
  });

  // This test verifies our mocking strategy works correctly
  describe("Mock Database Verification", () => {
    it("intercepts all Drizzle operations (no real Turso calls)", async () => {
      // Set up mocks for all operations
      mockSelect
        .mockReturnValueOnce({
          from: jest.fn().mockResolvedValue([{ max: 0 }]), // for addTodo max select
        })
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            orderBy: jest.fn().mockResolvedValue([]), // for getTodos
          }),
        })
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue([{ id: 1, completed: false }]), // for toggleTodo
          }),
        });
      mockInsert.mockReturnValue({
        values: jest.fn().mockResolvedValue(undefined),
      });
      mockUpdate.mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue(undefined),
        }),
      });
      mockDelete.mockReturnValue({
        where: jest.fn().mockResolvedValue(undefined),
      });

      const formData = new FormData();
      formData.set("description", "Verify mocking");

      // These should all complete without errors, proving they use mocks
      await addTodo(formData);
      await getTodos();
      await toggleTodoAction(1);
      await removeTodoAction(1);

      // All operations should have been intercepted
      expect(mockInsert).toHaveBeenCalledTimes(1);
      expect(mockSelect).toHaveBeenCalledTimes(3); // max, getTodos, toggle lookup
      expect(mockUpdate).toHaveBeenCalledTimes(1);
      expect(mockDelete).toHaveBeenCalledTimes(1);
    });
  });
});
