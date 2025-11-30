/**
 * TodoList Component Tests
 *
 * Tests for the TodoList component which displays a list of todos
 * and handles empty state rendering.
 *
 * The TodoList uses useOptimistic for optimistic updates, but we test
 * the initial render state since optimistic updates are handled by React.
 */
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { TodoList } from "../todo-list";

// Mock the child components to isolate TodoList testing
// We test Todo and Form components separately
jest.mock("../todo", () => ({
  Todo: ({ item }: { item: { id: number; description: string } }) => (
    <li data-testid={`todo-${item.id}`}>{item.description}</li>
  ),
}));

jest.mock("../form", () => ({
  Form: () => <div data-testid="form">Mock Form</div>,
}));

// Mock server actions (required by Form, even though Form is mocked)
jest.mock("../actions", () => ({
  addTodo: jest.fn(),
  toggleTodoAction: jest.fn(),
  removeTodoAction: jest.fn(),
}));

// Test fixtures
const multipleTodos = [
  { id: 1, description: "Buy groceries", completed: false },
  { id: 2, description: "Walk the dog", completed: true },
  { id: 3, description: "Read a book", completed: false },
];

const singleTodo = [{ id: 1, description: "Only todo", completed: false }];

const emptyTodos: Array<{
  id: number;
  description: string;
  completed: boolean;
}> = [];

describe("TodoList Component", () => {
  describe("Rendering list items", () => {
    test("renders list of todo items", () => {
      render(<TodoList initialTodos={multipleTodos} />);

      // Check each todo is rendered
      expect(screen.getByText("Buy groceries")).toBeInTheDocument();
      expect(screen.getByText("Walk the dog")).toBeInTheDocument();
      expect(screen.getByText("Read a book")).toBeInTheDocument();
    });

    test("renders correct number of todo items", () => {
      render(<TodoList initialTodos={multipleTodos} />);

      const todoItems = screen.getAllByTestId(/^todo-/);
      expect(todoItems).toHaveLength(3);
    });

    test("renders single todo item", () => {
      render(<TodoList initialTodos={singleTodo} />);

      expect(screen.getByText("Only todo")).toBeInTheDocument();
      expect(screen.getAllByTestId(/^todo-/)).toHaveLength(1);
    });
  });

  describe("Empty state", () => {
    test("renders empty state when no todos", () => {
      render(<TodoList initialTodos={emptyTodos} />);

      // Check for empty state message
      expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
    });

    test("displays helpful prompt in empty state", () => {
      render(<TodoList initialTodos={emptyTodos} />);

      // Should show prompt to add a todo
      expect(screen.getByText(/add one below/i)).toBeInTheDocument();
    });

    test("does not show empty state when todos exist", () => {
      render(<TodoList initialTodos={multipleTodos} />);

      expect(screen.queryByText(/no todos yet/i)).not.toBeInTheDocument();
    });
  });

  describe("Form integration", () => {
    test("renders the Form component", () => {
      render(<TodoList initialTodos={emptyTodos} />);

      expect(screen.getByTestId("form")).toBeInTheDocument();
    });

    test("Form is present with todos", () => {
      render(<TodoList initialTodos={multipleTodos} />);

      expect(screen.getByTestId("form")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    test("has no accessibility violations with todos", async () => {
      const { container } = render(<TodoList initialTodos={multipleTodos} />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("has no accessibility violations in empty state", async () => {
      const { container } = render(<TodoList initialTodos={emptyTodos} />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
