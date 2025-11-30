/**
 * Todo Component Tests
 *
 * Tests for the Todo component which displays a single todo item
 * and handles toggle/delete interactions via server actions.
 *
 * These tests mock the server actions since they can't run in jsdom,
 * and use waitFor() to handle useTransition async state updates.
 */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Todo } from "../todo";
import { toggleTodoAction, removeTodoAction } from "../actions";

// Mock the server actions - they can't actually run in jsdom
jest.mock("../actions", () => ({
  toggleTodoAction: jest.fn(),
  removeTodoAction: jest.fn(),
}));

// Mock react-confetti - jsdom doesn't support canvas
jest.mock("react-confetti", () => {
  return function MockConfetti() {
    return null;
  };
});

// Type assertion for mocked functions
const mockToggleTodoAction = toggleTodoAction as jest.MockedFunction<typeof toggleTodoAction>;
const mockRemoveTodoAction = removeTodoAction as jest.MockedFunction<typeof removeTodoAction>;

// Test fixtures - reusable mock data
const incompleteTodo = {
  id: 1,
  description: "Buy groceries",
  completed: false,
};

const completedTodo = {
  id: 2,
  description: "Walk the dog",
  completed: true,
};

describe("Todo Component", () => {
  // Reset mocks before each test for isolation
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    test("renders todo description text", () => {
      render(<Todo item={incompleteTodo} />);

      expect(screen.getByText("Buy groceries")).toBeInTheDocument();
    });

    test("displays line-through styling when completed is true", () => {
      render(<Todo item={completedTodo} />);

      const description = screen.getByText("Walk the dog");
      // Tailwind applies line-through class for completed todos
      expect(description).toHaveClass("line-through");
    });

    test("does not display line-through styling when completed is false", () => {
      render(<Todo item={incompleteTodo} />);

      const description = screen.getByText("Buy groceries");
      expect(description).not.toHaveClass("line-through");
    });

    test("shows checkmark icon when todo is completed", () => {
      render(<Todo item={completedTodo} />);

      // The checkbox button should have a different aria-label when completed
      expect(
        screen.getByRole("button", { name: /mark as incomplete/i })
      ).toBeInTheDocument();
    });

    test("shows empty checkbox when todo is incomplete", () => {
      render(<Todo item={incompleteTodo} />);

      expect(
        screen.getByRole("button", { name: /mark as complete/i })
      ).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    test("clicking checkbox calls toggleTodoAction with correct ID", async () => {
      const user = userEvent.setup();
      render(<Todo item={incompleteTodo} />);

      const toggleButton = screen.getByRole("button", {
        name: /mark as complete/i,
      });
      await user.click(toggleButton);

      // Wait for the async action to be called (useTransition)
      await waitFor(() => {
        expect(mockToggleTodoAction).toHaveBeenCalledWith(incompleteTodo.id);
      });
      expect(mockToggleTodoAction).toHaveBeenCalledTimes(1);
    });

    test("clicking delete button calls removeTodoAction with correct ID", async () => {
      const user = userEvent.setup();
      render(<Todo item={incompleteTodo} />);

      const deleteButton = screen.getByRole("button", { name: /delete/i });
      await user.click(deleteButton);

      // Wait for the async action to be called (useTransition)
      await waitFor(() => {
        expect(mockRemoveTodoAction).toHaveBeenCalledWith(incompleteTodo.id);
      });
      expect(mockRemoveTodoAction).toHaveBeenCalledTimes(1);
    });

    test("clicking completed todo checkbox calls toggleTodoAction", async () => {
      const user = userEvent.setup();
      render(<Todo item={completedTodo} />);

      const toggleButton = screen.getByRole("button", {
        name: /mark as incomplete/i,
      });
      await user.click(toggleButton);

      await waitFor(() => {
        expect(mockToggleTodoAction).toHaveBeenCalledWith(completedTodo.id);
      });
    });
  });

  describe("Accessibility", () => {
    // Note: We wrap Todo in <ul> because it renders an <li> element
    // which requires a list parent for valid HTML/accessibility
    test("has no accessibility violations for incomplete todo", async () => {
      const { container } = render(
        <ul>
          <Todo item={incompleteTodo} />
        </ul>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("has no accessibility violations for completed todo", async () => {
      const { container } = render(
        <ul>
          <Todo item={completedTodo} />
        </ul>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("toggle button has accessible name", () => {
      render(<Todo item={incompleteTodo} />);

      const toggleButton = screen.getByRole("button", {
        name: /mark as complete/i,
      });
      expect(toggleButton).toHaveAccessibleName();
    });

    test("delete button has accessible name", () => {
      render(<Todo item={incompleteTodo} />);

      const deleteButton = screen.getByRole("button", { name: /delete/i });
      expect(deleteButton).toHaveAccessibleName();
    });
  });
});
