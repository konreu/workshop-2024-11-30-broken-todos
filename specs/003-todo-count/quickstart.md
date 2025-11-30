# Quickstart: Todo Count Display

**Feature**: 003-todo-count  
**Branch**: `003-todo-count`  
**Estimated Time**: 30-45 minutes

## Prerequisites

- Node.js and npm installed
- Repository cloned and dependencies installed (`npm install`)
- Development server runs without errors (`npm run dev`)

## What You're Building

A "X of Y completed" count display that:

1. Shows above the todo list
2. Updates instantly when todos are added/removed/toggled
3. Shows "Add your first todo!" when the list is empty
4. Is accessible to screen reader users

## Implementation Order

### Step 1: Write Failing Tests (RED)

Create `app/__tests__/todo-count.test.tsx`:

```bash
npm run test:unit -- --testPathPattern="todo-count"
# Should fail: Cannot find module '../todo-count'
```

### Step 2: Create TodoCount Component (GREEN)

Create `app/todo-count.tsx` with the component that makes tests pass.

```bash
npm run test:unit -- --testPathPattern="todo-count"
# Should pass
```

### Step 3: Integrate into TodoList

Modify `app/todo-list.tsx` to render `<TodoCount />` with `optimisticTodos`.

```bash
npm run test:unit
# All tests should pass
```

### Step 4: Verify in Browser

```bash
npm run dev
# Open http://localhost:3000
# Verify: count displays, updates on add/toggle/remove
```

### Step 5: Run E2E Tests

```bash
npm run test:e2e
# Verify end-to-end flow works
```

## Key Files

| File                                | Purpose                         |
| ----------------------------------- | ------------------------------- |
| `app/todo-count.tsx`                | NEW: Count display component    |
| `app/todo-list.tsx`                 | MODIFY: Add TodoCount rendering |
| `app/__tests__/todo-count.test.tsx` | NEW: Component tests            |
| `e2e/todo-count.spec.ts`            | NEW: E2E tests                  |

## Testing Commands

```bash
# Run all unit tests
npm run test:unit

# Run tests in watch mode (recommended during development)
npm run test:watch

# Run specific test file
npm run test:unit -- --testPathPattern="todo-count"

# Run E2E tests
npm run test:e2e

# Run linter before committing
npm run lint
```

## Definition of Done

- [ ] `TodoCount` component created with proper types
- [ ] Component has `aria-live="polite"` for accessibility
- [ ] Empty state shows "Add your first todo!"
- [ ] Count updates immediately on add/remove/toggle
- [ ] All unit tests pass
- [ ] All E2E tests pass
- [ ] No lint errors
- [ ] Manually verified in browser
