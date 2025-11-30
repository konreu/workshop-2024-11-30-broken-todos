# Research: Testing Infrastructure

**Feature**: 002-testing-infrastructure  
**Date**: 2025-11-30  
**Status**: Complete

## Research Tasks

### 1. Jest with Next.js 15 App Router

**Question**: How to configure Jest for Next.js 15 with App Router, TypeScript, and path aliases?

**Decision**: Use `next/jest` preset with custom configuration

**Rationale**:

- `next/jest` handles SWC transformation, path aliases (`@/`), and Next.js-specific setup automatically
- Provides proper handling of Server Components vs Client Components
- Built-in support for TypeScript without additional configuration

**Alternatives Considered**:

- Manual ts-jest configuration: Rejected because it requires manual path alias setup and doesn't handle Next.js specifics
- Vitest: Rejected because Jest is specified in requirements and has better ecosystem for React Testing Library

**Configuration**:

```typescript
// jest.config.ts
import type { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({ dir: "./" });

const customConfig: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: ["**/__tests__/**/*.test.{ts,tsx}"],
};

export default createJestConfig(customConfig);
```

---

### 2. Mocking Drizzle ORM Database Operations

**Question**: How to mock Drizzle ORM in unit tests without hitting the real Turso database?

**Decision**: Use Jest's manual mocks (`db/__mocks__/index.ts`) to intercept all database operations

**Rationale**:

- Jest's `__mocks__` directory pattern provides clean separation of mock from real implementation
- Mock can track calls for assertion purposes
- No changes needed to production code

**Alternatives Considered**:

- MSW (Mock Service Worker): Rejected because Drizzle doesn't use HTTP—it uses direct database connection
- In-memory SQLite: Rejected for unit tests (adds complexity); used for E2E instead
- Dependency injection: Rejected because it requires refactoring production code

**Mock Implementation**:

```typescript
// db/__mocks__/index.ts
export const mockInsert = jest.fn().mockReturnValue({ values: jest.fn() });
export const mockSelect = jest.fn().mockReturnValue({ from: jest.fn().mockResolvedValue([]) });
export const mockUpdate = jest
  .fn()
  .mockReturnValue({ set: jest.fn().mockReturnValue({ where: jest.fn() }) });
export const mockDelete = jest.fn().mockReturnValue({ where: jest.fn() });

export const db = {
  insert: mockInsert,
  select: mockSelect,
  update: mockUpdate,
  delete: mockDelete,
};
```

---

### 3. Testing Server Actions with `revalidatePath`

**Question**: How to test Server Actions that call `revalidatePath`?

**Decision**: Mock `next/cache` module to intercept `revalidatePath` calls

**Rationale**:

- `revalidatePath` is a Next.js internal that can't be executed outside of a Next.js request context
- Mocking allows us to verify it's called with correct arguments
- Keeps tests fast and isolated

**Implementation**:

```typescript
// In test file or jest.setup.ts
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));
```

---

### 4. React Testing Library with Next.js Server Components

**Question**: How to test components that mix Server and Client components?

**Decision**: Test Client Components directly; Server Components are tested via E2E or by testing their data-fetching separately

**Rationale**:

- Server Components run on the server and can't be rendered directly in jsdom
- Client Components (marked with `"use client"`) can be tested with React Testing Library
- The components in this codebase (`Todo`, `Form`, `TodoList`) are all Client Components

**Pattern**:

```typescript
// app/__tests__/todo.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Todo } from "../todo";

// Mock the server actions
jest.mock("../actions", () => ({
  toggleTodoAction: jest.fn(),
  removeTodoAction: jest.fn(),
}));
```

---

### 5. Playwright E2E with Auto-Start Dev Server

**Question**: How to configure Playwright to automatically start the Next.js dev server?

**Decision**: Use Playwright's `webServer` configuration option

**Rationale**:

- Built-in Playwright feature, no custom scripts needed
- Handles server startup, readiness check, and shutdown automatically
- Works with `npm run dev` (Turbopack)

**Configuration**:

```typescript
// playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
  use: {
    baseURL: "http://localhost:3000",
  },
});
```

---

### 6. E2E Test Database Strategy

**Question**: How should E2E tests handle database state—separate test database or production database?

**Decision**: Use the same Turso database but with seed/cleanup functions in `beforeEach`

**Rationale**:

- Turso is SQLite-compatible, so no schema differences between test and production
- Seed functions provide explicit, readable test data setup
- Clearing database in `beforeEach` ensures test isolation
- Simpler than maintaining separate database infrastructure

**Alternatives Considered**:

- Separate test database: Rejected because it adds infrastructure complexity for a learning project
- Local SQLite file: Partially viable but Turso-specific features might differ

**Implementation**:

```typescript
// db/seeds/todos.ts
import { db } from "@/db";
import { todosTable } from "@/db/schema";

export async function clearTodos() {
  await db.delete(todosTable);
}

export async function seedTodos(todos: Array<{ description: string; completed?: boolean }>) {
  await db.insert(todosTable).values(todos);
}
```

---

### 7. Accessibility Testing with jest-axe

**Question**: How to integrate automated accessibility testing?

**Decision**: Use `jest-axe` for component-level a11y checks

**Rationale**:

- Catches common accessibility issues (missing labels, invalid ARIA, etc.)
- Integrates seamlessly with React Testing Library
- Provides clear violation messages for learning

**Implementation**:

```typescript
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

test('Todo component has no accessibility violations', async () => {
  const { container } = render(<Todo item={mockTodo} />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

---

### 8. Testing `useTransition` and Async State

**Question**: How to handle `useTransition` in component tests?

**Decision**: Use `act()` wrapper and `waitFor()` for async state updates

**Rationale**:

- `useTransition` creates pending states that React Testing Library's `act()` handles
- `waitFor()` allows assertions on eventual state changes
- `userEvent` library handles most timing issues automatically

**Pattern**:

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

test('clicking checkbox calls toggleTodoAction', async () => {
  const user = userEvent.setup()
  render(<Todo item={mockTodo} />)

  await user.click(screen.getByRole('button', { name: /mark as complete/i }))

  await waitFor(() => {
    expect(toggleTodoAction).toHaveBeenCalledWith(mockTodo.id)
  })
})
```

---

## Resolved Clarifications

All "NEEDS CLARIFICATION" items from Technical Context have been resolved:

| Item                                        | Resolution                                |
| ------------------------------------------- | ----------------------------------------- |
| Jest configuration for Next.js 15           | Use `next/jest` preset                    |
| Drizzle mocking strategy                    | Jest `__mocks__` directory pattern        |
| Server Action testing with `revalidatePath` | Mock `next/cache` module                  |
| Playwright dev server startup               | Use `webServer` config option             |
| E2E database handling                       | Same Turso DB with seed/cleanup functions |
| `useTransition` testing                     | `act()` + `waitFor()` pattern             |

## Dependencies Confirmed

All dependencies from spec are compatible and available:

| Package                       | Version | Purpose                                 |
| ----------------------------- | ------- | --------------------------------------- |
| `jest`                        | ^29.x   | Test runner                             |
| `@types/jest`                 | ^29.x   | TypeScript types                        |
| `jest-environment-jsdom`      | ^29.x   | Browser environment for component tests |
| `@testing-library/react`      | ^16.x   | Component testing utilities             |
| `@testing-library/jest-dom`   | ^6.x    | Custom DOM matchers                     |
| `@testing-library/user-event` | ^14.x   | User interaction simulation             |
| `jest-axe`                    | ^9.x    | Accessibility testing                   |
| `@playwright/test`            | ^1.x    | E2E testing                             |
