# Component Contracts: Todo Count Display

**Feature**: 003-todo-count  
**Date**: 2025-11-30

## Components

### TodoCount

A presentational component that displays the completion count or empty state message.

**Location**: `app/todo-count.tsx`

**Props Interface**:

```typescript
interface TodoCountProps {
  /** Array of todos to count (from optimistic state) */
  todos: Array<{ completed: boolean }>;
}
```

**Behavior**:

| Input State          | Output                                     |
| -------------------- | ------------------------------------------ |
| `todos.length === 0` | Renders "Add your first todo!"             |
| `todos.length > 0`   | Renders "{completed} of {total} completed" |

**Accessibility**:

- Root element MUST have `aria-live="polite"` for screen reader announcements
- Root element MUST have `role="status"` for semantic meaning

**Styling**:

- Uses `text-sm text-slate-500` for consistent secondary text appearance
- Centered text alignment to match header section
- Padding for visual spacing: `py-3 px-4`

### TodoList (Modified)

**Location**: `app/todo-list.tsx`

**Changes**:

- Import and render `<TodoCount todos={optimisticTodos} />` above the todo items
- Position between the empty state check and the DndContext

**Render Order**:

```
1. Screen reader announcements (existing)
2. TodoCount (NEW) - always visible
3. Empty state OR Todo items (existing)
4. Form (existing)
```

## No Server Actions

This feature does not require new server actions. The count is derived entirely client-side from the existing `optimisticTodos` state.
