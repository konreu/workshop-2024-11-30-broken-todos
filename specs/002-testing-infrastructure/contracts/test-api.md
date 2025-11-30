# Test API Contract

**Feature**: 002-testing-infrastructure  
**Date**: 2025-11-30

## Overview

Defines the API for seed functions and mock utilities used in tests.

---

## Seed Functions (`db/seeds/todos.ts`)

### `clearTodos()`

Removes all todos from the database.

```typescript
export async function clearTodos(): Promise<void>
```

**Usage**:
```typescript
beforeEach(async () => {
  await clearTodos()
})
```

---

### `seedTodos()`

Inserts todos into the database.

```typescript
export async function seedTodos(
  todos: Array<{ description: string; completed?: boolean }>
): Promise<void>
```

**Parameters**:
- `todos`: Array of todo objects to insert
  - `description` (required): Todo text
  - `completed` (optional): Completion status, defaults to `false`

**Usage**:
```typescript
beforeEach(async () => {
  await clearTodos()
  await seedTodos([
    { description: 'Buy milk' },
    { description: 'Walk dog', completed: true },
  ])
})
```

---

### `seedTodo()`

Inserts a single todo and returns it with its generated ID.

```typescript
export async function seedTodo(
  todo: { description: string; completed?: boolean }
): Promise<{ id: number; description: string; completed: boolean }>
```

**Usage**:
```typescript
const todo = await seedTodo({ description: 'Test todo' })
// todo.id is now available for assertions
```

---

## Mock Database (`db/__mocks__/index.ts`)

### Mock Exports

```typescript
// Mock functions for assertions
export const mockInsert: jest.Mock
export const mockSelect: jest.Mock
export const mockUpdate: jest.Mock
export const mockDelete: jest.Mock

// Mock db object
export const db: {
  insert: typeof mockInsert
  select: typeof mockSelect
  update: typeof mockUpdate
  delete: typeof mockDelete
}

// Helper to reset all mocks
export function resetMocks(): void
```

### Mock Behavior

| Method | Default Return | Chainable Methods |
|--------|----------------|-------------------|
| `db.insert()` | `{ values: jest.fn() }` | `.values(data)` |
| `db.select()` | `{ from: jest.fn().mockResolvedValue([]) }` | `.from(table)` |
| `db.update()` | `{ set: jest.fn().mockReturnValue({ where: jest.fn() }) }` | `.set(data).where(condition)` |
| `db.delete()` | `{ where: jest.fn() }` | `.where(condition)` |

### Configuring Mock Returns

```typescript
import { mockSelect } from '@/db'

// Configure mock to return specific data
mockSelect.mockReturnValue({
  from: jest.fn().mockResolvedValue([
    { id: 1, description: 'Test todo', completed: false }
  ])
})
```

### Asserting Mock Calls

```typescript
import { mockInsert } from '@/db'

test('addTodo inserts into database', async () => {
  const formData = new FormData()
  formData.set('description', 'New todo')
  
  await addTodo(formData)
  
  expect(mockInsert).toHaveBeenCalled()
  // Access the values passed to .values()
  const valuesCall = mockInsert.mock.results[0].value.values
  expect(valuesCall).toHaveBeenCalledWith({ description: 'New todo' })
})
```

---

## Jest Custom Matchers

### `toHaveNoViolations` (from jest-axe)

Asserts that a rendered component has no accessibility violations.

```typescript
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

test('component is accessible', async () => {
  const { container } = render(<Component />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

### DOM Matchers (from @testing-library/jest-dom)

Available matchers after setup:

- `toBeInTheDocument()`
- `toHaveTextContent(text)`
- `toHaveAttribute(attr, value?)`
- `toBeVisible()`
- `toBeDisabled()`
- `toHaveClass(className)`
- `toHaveStyle(css)`
- `toBeChecked()`

```typescript
expect(element).toBeInTheDocument()
expect(element).toHaveTextContent('Buy milk')
expect(button).toBeDisabled()
```

---

## Playwright Test Utilities

### Page Object Pattern (Optional)

```typescript
// e2e/pages/todo-page.ts
import { Page, expect } from '@playwright/test'

export class TodoPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/')
  }

  async addTodo(description: string) {
    await this.page.fill('input[name="description"]', description)
    await this.page.click('button[type="submit"]')
  }

  async toggleTodo(description: string) {
    const todoItem = this.page.getByRole('listitem').filter({ hasText: description })
    await todoItem.getByRole('button', { name: /mark as complete/i }).click()
  }

  async deleteTodo(description: string) {
    const todoItem = this.page.getByRole('listitem').filter({ hasText: description })
    await todoItem.getByRole('button', { name: /delete/i }).click()
  }

  async expectTodoVisible(description: string) {
    await expect(this.page.getByText(description)).toBeVisible()
  }

  async expectTodoCompleted(description: string) {
    const todoItem = this.page.getByRole('listitem').filter({ hasText: description })
    await expect(todoItem.locator('span')).toHaveCSS('text-decoration-line', 'line-through')
  }
}
```
