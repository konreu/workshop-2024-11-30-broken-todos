/**
 * Form Component Tests
 *
 * Tests for the Form component which handles adding new todos.
 * The Form uses React's form actions and useFormStatus for pending state.
 *
 * We mock the addTodo server action and verify it's called with
 * the correct FormData when the form is submitted.
 */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Form } from "../form";
import { addTodo } from "../actions";

// Mock the server action
jest.mock("../actions", () => ({
  addTodo: jest.fn(),
}));

const mockAddTodo = addTodo as jest.MockedFunction<typeof addTodo>;

describe("Form Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    test("renders input field", () => {
      render(<Form />);

      expect(
        screen.getByRole("textbox", { name: /description/i })
      ).toBeInTheDocument();
    });

    test("renders submit button", () => {
      render(<Form />);

      expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
    });

    test("input has placeholder text", () => {
      render(<Form />);

      expect(
        screen.getByPlaceholderText(/add a new todo/i)
      ).toBeInTheDocument();
    });

    test("input is required", () => {
      render(<Form />);

      const input = screen.getByRole("textbox", { name: /description/i });
      expect(input).toBeRequired();
    });
  });

  describe("Form submission", () => {
    test("submitting form calls addTodo with FormData containing description", async () => {
      const user = userEvent.setup();
      render(<Form />);

      const input = screen.getByRole("textbox", { name: /description/i });
      const submitButton = screen.getByRole("button", { name: /add/i });

      // Type a description
      await user.type(input, "New todo item");

      // Submit the form
      await user.click(submitButton);

      // Wait for the action to be called
      await waitFor(() => {
        expect(mockAddTodo).toHaveBeenCalled();
      });

      // Verify FormData contains the description
      const formDataArg = mockAddTodo.mock.calls[0][0];
      expect(formDataArg).toBeInstanceOf(FormData);
      expect(formDataArg.get("description")).toBe("New todo item");
    });

    test("can submit form by pressing Enter", async () => {
      const user = userEvent.setup();
      render(<Form />);

      const input = screen.getByRole("textbox", { name: /description/i });

      // Type and press Enter
      await user.type(input, "Press enter todo{Enter}");

      await waitFor(() => {
        expect(mockAddTodo).toHaveBeenCalled();
      });

      const formDataArg = mockAddTodo.mock.calls[0][0];
      expect(formDataArg.get("description")).toBe("Press enter todo");
    });

    test("clears input after successful submission", async () => {
      const user = userEvent.setup();
      // Make the mock resolve successfully
      mockAddTodo.mockResolvedValueOnce(undefined);

      render(<Form />);

      const input = screen.getByRole("textbox", {
        name: /description/i,
      }) as HTMLInputElement;

      await user.type(input, "Todo to clear");
      await user.click(screen.getByRole("button", { name: /add/i }));

      // Wait for form to reset
      await waitFor(() => {
        expect(input.value).toBe("");
      });
    });
  });

  describe("Input behavior", () => {
    test("input accepts text", async () => {
      const user = userEvent.setup();
      render(<Form />);

      const input = screen.getByRole("textbox", {
        name: /description/i,
      }) as HTMLInputElement;

      await user.type(input, "Test input");

      expect(input.value).toBe("Test input");
    });

    test("input is focused by default (autoFocus)", () => {
      render(<Form />);

      const input = screen.getByRole("textbox", { name: /description/i });
      expect(input).toHaveFocus();
    });
  });

  describe("Accessibility", () => {
    test("has no accessibility violations", async () => {
      const { container } = render(<Form />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("input has accessible label", () => {
      render(<Form />);

      const input = screen.getByRole("textbox", { name: /description/i });
      expect(input).toHaveAccessibleName();
    });

    test("submit button has accessible name", () => {
      render(<Form />);

      const button = screen.getByRole("button", { name: /add/i });
      expect(button).toHaveAccessibleName();
    });

    test("form has proper structure", () => {
      render(<Form />);

      // Form should contain input and button
      const form = screen.getByRole("textbox", { name: /description/i })
        .closest("form");
      expect(form).toBeInTheDocument();
      expect(form).toContainElement(
        screen.getByRole("button", { name: /add/i })
      );
    });
  });
});
