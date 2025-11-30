# Research: Todo Count Display

**Feature**: 003-todo-count  
**Date**: 2025-11-30  
**Purpose**: Resolve technical unknowns before design phase

## Research Tasks

### 1. How does the existing optimistic state work?

**Context**: The count must derive from `optimisticTodos` to update in real-time.

**Finding**: The `todo-list.tsx` component uses React 19's `useOptimistic` hook:

```tsx
const [optimisticTodos, setOptimisticTodos] = useOptimistic<
  Todo[],
  { action: "add" | "remove" | "toggle" | "reorder"; todo: Todo; newIndex?: number }
>(initialTodos, (state, { action, todo, newIndex }) => {
  // handles add, remove, toggle, reorder actions
});
```

**Decision**: The count component will receive `optimisticTodos` as a prop and compute the count directly. No state management changes needed.

**Rationale**: This is the simplest approach—count is a pure derivation of existing state.

### 2. Where should the count be rendered in the component tree?

**Context**: Spec says "above the todo list, in the header area below 'My Todos' title."

**Finding**: Two options identified:

- **Option A**: Render in `page.tsx` (Server Component) - Would require passing count from server
- **Option B**: Render inside `todo-list.tsx` (Client Component) - Has access to optimistic state

**Decision**: Render inside `todo-list.tsx`, above the todo items but inside the card.

**Rationale**: The count must update optimistically. Only `todo-list.tsx` has access to `optimisticTodos`. Rendering in `page.tsx` would only show server state and not update until revalidation.

**Alternatives considered**:

- Using React Context to share state: Rejected—adds complexity for no benefit
- Lifting state to page.tsx: Rejected—would break server component pattern

### 3. Best practices for aria-live regions in React

**Context**: SC-005 requires screen reader announcements via `aria-live="polite"`.

**Finding**: The codebase already has an aria-live region pattern in `todo-list.tsx`:

```tsx
{
  /* Screen reader announcements */
}
<div aria-live="polite" aria-atomic="true" className="sr-only"></div>;
```

**Decision**: The count display will use `aria-live="polite"` directly on the visible element, not a hidden announcer. This is appropriate because:

1. The count is always visible (not a transient notification)
2. Changes are non-urgent (polite, not assertive)
3. The element content IS the announcement

**Rationale**: Simpler than managing a separate announcer; follows WCAG best practices for status messages.

### 4. Styling approach for count display

**Context**: Must fit visually with existing header design.

**Finding**: Current header in `page.tsx`:

```tsx
<p className="text-lg text-slate-500">Stay organized, get things done</p>
```

**Decision**: Use similar styling for consistency: `text-sm text-slate-500` with slightly smaller text since it's secondary information. Place inside the card, at the top, with subtle styling.

**Rationale**: Maintains visual hierarchy—title is primary, subtitle is secondary, count is tertiary.

## Summary of Decisions

| Question        | Decision                                      |
| --------------- | --------------------------------------------- |
| State source    | Derive from `optimisticTodos` prop            |
| Render location | Inside `todo-list.tsx`, above todo items      |
| Accessibility   | `aria-live="polite"` on visible count element |
| Styling         | `text-sm text-slate-500`, inside card header  |

## Unresolved Items

None. All technical questions resolved.
