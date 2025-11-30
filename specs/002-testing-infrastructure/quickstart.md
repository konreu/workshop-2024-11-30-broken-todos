# Quickstart: Testing Infrastructure

**Feature**: 002-testing-infrastructure  
**Date**: 2025-11-30

## Prerequisites

- Node.js and npm installed (via devcontainer)
- Project dependencies installed (`npm install`)
- Turso database configured (existing `.env` setup)

## Running Tests

### Run All Tests

```bash
npm run test
```

This runs unit tests first, then E2E tests.

### Run Unit/Component Tests Only

```bash
npm run test:unit
```

### Run E2E Tests Only

```bash
npm run test:e2e
```

Playwright automatically starts the dev server before running tests.

### TDD Watch Mode

```bash
npm run test:watch
```

Jest re-runs tests when files change. Perfect for red-green-refactor workflow.

### Coverage Report

```bash
npm run test:coverage
```

View report at `coverage/lcov-report/index.html`.

---

## Writing Your First Unit Test

### Testing a Server Action

```typescript
// app/__tests__/actions.test.ts
import { addTodo, getTodos } from "../actions";
import { mockInsert, mockSelect } from "@/db";

// Mock the database
jest.mock("@/db");

describe("addTodo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("inserts todo with description from FormData", async () => {
    const formData = new FormData();
    formData.set("description", "Buy milk");

    await addTodo(formData);

    expect(mockInsert).toHaveBeenCalled();
    // Verify the values passed to insert
    const valuesCall = mockInsert.mock.results[0].value.values;
    expect(valuesCall).toHaveBeenCalledWith({
      description: "Buy milk",
    });
  });
});
```

### Testing a React Component

```typescript
// app/__tests__/todo.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Todo } from '../todo'
import { toggleTodoAction, removeTodoAction } from '../actions'

// Mock the server actions
jest.mock('../actions', () => ({
  toggleTodoAction: jest.fn(),
  removeTodoAction: jest.fn(),
}))

const mockTodo = {
  id: 1,
  description: 'Test todo',
  completed: false,
}

describe('Todo', () => {
  test('renders todo description', () => {
    render(<Todo item={mockTodo} />)
    expect(screen.getByText('Test todo')).toBeInTheDocument()
  })

  test('clicking checkbox calls toggleTodoAction', async () => {
    const user = userEvent.setup()
    render(<Todo item={mockTodo} />)

    await user.click(screen.getByRole('button', { name: /mark as complete/i }))

    expect(toggleTodoAction).toHaveBeenCalledWith(1)
  })
})
```

### Accessibility Testing

```typescript
// app/__tests__/todo.test.tsx
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

test('Todo component has no accessibility violations', async () => {
  const { container } = render(<Todo item={mockTodo} />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

---

## Writing Your First E2E Test

```typescript
// e2e/todo-flow.spec.ts
import { test, expect } from "@playwright/test";
import { clearTodos, seedTodos } from "../db/seeds/todos";

test.describe("Todo App", () => {
  test.beforeEach(async () => {
    // Clear database before each test
    await clearTodos();
  });

  test("can add a new todo", async ({ page }) => {
    await page.goto("/");

    // Type in the input and submit
    await page.fill('input[name="description"]', "Buy milk");
    await page.click('button[type="submit"]');

    // Verify todo appears
    await expect(page.getByText("Buy milk")).toBeVisible();
  });

  test("can toggle a todo complete", async ({ page }) => {
    // Seed a todo first
    await seedTodos([{ description: "Walk the dog" }]);

    await page.goto("/");

    // Click the checkbox
    await page.click('button[aria-label="Mark as complete"]');

    // Verify it shows as completed (line-through style)
    const todoText = page.locator("span", { hasText: "Walk the dog" });
    await expect(todoText).toHaveCSS("text-decoration-line", "line-through");
  });

  test("can delete a todo", async ({ page }) => {
    await seedTodos([{ description: "Buy groceries" }]);

    await page.goto("/");

    // Hover to reveal delete button, then click
    const todoItem = page.getByRole("listitem").filter({ hasText: "Buy groceries" });
    await todoItem.hover();
    await todoItem.getByRole("button", { name: /delete/i }).click();

    // Verify todo is removed
    await expect(page.getByText("Buy groceries")).not.toBeVisible();
  });
});
```

---

## TDD Workflow (Red-Green-Refactor)

### 1. RED: Write a Failing Test

```typescript
test('todo shows confetti when completed', async () => {
  const user = userEvent.setup()
  render(<Todo item={{ id: 1, description: 'Test', completed: false }} />)

  await user.click(screen.getByRole('button', { name: /mark as complete/i }))

  // This test expects confetti to appear
  expect(screen.getByTestId('confetti')).toBeInTheDocument()
})
```

Run the test: `npm run test:watch`

### 2. GREEN: Make It Pass

Add the minimum code to make the test pass.

### 3. REFACTOR: Improve the Code

Clean up the implementation while keeping tests green.

---

## File Structure Reference

```
app/
├── __tests__/                    # Unit and component tests
│   ├── actions.test.ts           # Server action tests
│   ├── todo.test.tsx             # Todo component tests
│   └── form.test.tsx             # Form component tests
db/
├── __mocks__/                    # Jest mocks
│   └── index.ts                  # Mock db implementation
└── seeds/                        # Test data seeders
    └── todos.ts                  # Seed functions
e2e/                              # Playwright E2E tests
└── todo-flow.spec.ts             # Main user flow test
jest.config.ts                    # Jest configuration
jest.setup.ts                     # Jest setup file
playwright.config.ts              # Playwright configuration
```

---

## Common Issues

### "Cannot find module '@/db'"

Ensure Jest is using the path alias. Check `jest.config.ts` has:

```typescript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/$1',
}
```

### "ReferenceError: window is not defined"

Ensure the test file is using jsdom environment. Check `jest.config.ts` has:

```typescript
testEnvironment: "jsdom";
```

### "Server Actions cannot be called from client"

Mock the server actions in your test file:

```typescript
jest.mock("../actions", () => ({
  toggleTodoAction: jest.fn(),
}));
```

### Playwright times out waiting for server

Increase the timeout in `playwright.config.ts`:

```typescript
webServer: {
  timeout: 180 * 1000, // 3 minutes
}
```
