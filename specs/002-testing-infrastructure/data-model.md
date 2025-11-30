# Data Model: Testing Infrastructure

**Feature**: 002-testing-infrastructure  
**Date**: 2025-11-30

## Overview

This feature adds testing infrastructure but does not modify the existing data model. The primary "entities" are configuration and test-related concepts.

## Existing Entities (Unchanged)

### Todo (from `db/schema.ts`)

| Field         | Type                   | Constraints                 | Notes             |
| ------------- | ---------------------- | --------------------------- | ----------------- |
| `id`          | integer                | PRIMARY KEY, AUTO INCREMENT | Unique identifier |
| `description` | text                   | NOT NULL                    | Todo item text    |
| `completed`   | integer (boolean mode) | NOT NULL, DEFAULT false     | Completion status |

```typescript
// Existing schema - no changes
export const todosTable = sqliteTable("todos", {
  id: integer().primaryKey({ autoIncrement: true }),
  description: text().notNull(),
  completed: integer({ mode: "boolean" }).notNull().default(false),
});
```

## New Test Infrastructure Entities

### MockTodo (Test Fixture Type)

Used in unit tests to create mock todo items for testing components and actions.

```typescript
// Type derived from Drizzle schema inference
type MockTodo = {
  id: number;
  description: string;
  completed: boolean;
};

// Example fixtures
const incompleteTodo: MockTodo = { id: 1, description: "Buy milk", completed: false };
const completedTodo: MockTodo = { id: 2, description: "Walk dog", completed: true };
```

### SeedTodoInput (Seed Function Input)

Input type for seed functions that populate the database in E2E tests.

```typescript
type SeedTodoInput = {
  description: string;
  completed?: boolean; // Defaults to false
};

// Usage in E2E tests
await seedTodos([
  { description: "Buy groceries" },
  { description: "Finish report", completed: true },
]);
```

## Test Data States

### State: Empty List

```typescript
// No todos in database
await clearTodos();
```

### State: Single Incomplete Todo

```typescript
await seedTodos([{ description: "Buy milk", completed: false }]);
```

### State: Mixed Completion Status

```typescript
await seedTodos([
  { description: "Incomplete task", completed: false },
  { description: "Completed task", completed: true },
]);
```

### State: Multiple Todos

```typescript
await seedTodos([{ description: "Task 1" }, { description: "Task 2" }, { description: "Task 3" }]);
```

## Mock Database Operations

The mock database tracks the following operations for assertion:

| Operation                                     | Mock Function | Returns  |
| --------------------------------------------- | ------------- | -------- |
| `db.insert(table).values(data)`               | `mockInsert`  | `void`   |
| `db.select().from(table)`                     | `mockSelect`  | `Todo[]` |
| `db.update(table).set(data).where(condition)` | `mockUpdate`  | `void`   |
| `db.delete(table).where(condition)`           | `mockDelete`  | `void`   |

## Validation Rules

No new validation rules are added. Tests will verify existing validation behavior:

1. **Description**: Must be non-empty string (form validation)
2. **Completed**: Boolean, defaults to `false` when creating

## State Transitions

Tests will verify the following state transitions:

```
[Not Exists] --addTodo--> [Incomplete Todo] --toggleTodo--> [Completed Todo]
                                    ^                              |
                                    |--------toggleTodo------------|

[Any Todo] --removeTodo--> [Not Exists]
```
