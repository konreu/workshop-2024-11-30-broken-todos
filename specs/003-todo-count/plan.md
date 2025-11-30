# Implementation Plan: Todo Count Display

**Branch**: `003-todo-count` | **Date**: 2025-11-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-todo-count/spec.md`

## Summary

Display a "X of Y completed" count above the todo list that updates in real-time when todos are added, removed, or toggled. The count is a derived value calculated from the optimistic todo state, requiring no database changes. When there are zero todos, display "Add your first todo!" instead. The count uses `aria-live="polite"` for screen reader accessibility.

## Technical Context

**Language/Version**: TypeScript 5.x, React 19.x, Next.js 15.x  
**Primary Dependencies**: React (useOptimistic hook already in use), Tailwind CSS 4.x  
**Storage**: N/A (derived value from existing optimistic state, no persistence needed)  
**Testing**: Jest + React Testing Library (component tests), Playwright (e2e tests)  
**Target Platform**: Web (Vercel-deployed Next.js app)  
**Project Type**: Web application (Next.js App Router)  
**Performance Goals**: Count updates within 100ms of any todo action (per SC-002)  
**Constraints**: Must use optimistic state (not server state) for real-time accuracy  
**Scale/Scope**: Single component addition, ~20 lines of code

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                     | Status  | Notes                                                             |
| ----------------------------- | ------- | ----------------------------------------------------------------- |
| I. Clarity Over Cleverness    | ✅ Pass | Simple derived count, no complex logic                            |
| II. Server-First Architecture | ✅ Pass | Count is client-side derived value (appropriate for real-time UI) |
| III. Explicit Error Handling  | ✅ Pass | No error states needed (count is always computable)               |
| IV. Type Safety               | ✅ Pass | Will use existing `Todo` type from Drizzle                        |
| V. Pedagogical Intent         | ✅ Pass | Simple feature, teaches optimistic UI patterns                    |
| VI. Test-First Development    | ✅ Pass | Will write tests before implementation                            |

**Pre-Phase 0**: All gates pass ✅  
**Post-Phase 1 Re-check**: All gates still pass ✅ (design remains simple, no new violations)

## Project Structure

### Documentation (this feature)

```text
specs/003-todo-count/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── components.md    # Component interface contracts
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
app/
├── page.tsx             # Server Component (header section where count appears)
├── todo-list.tsx        # Client Component (owns optimistic state, renders count)
├── todo-count.tsx       # NEW: Client Component (displays count with aria-live)
└── __tests__/
    ├── todo-list.test.tsx   # UPDATE: Add count rendering tests
    └── todo-count.test.tsx  # NEW: Unit tests for count component

e2e/
└── todo-count.spec.ts   # NEW: E2E tests for count updates
```

**Structure Decision**: The count component will be a new client component (`todo-count.tsx`) rendered inside `todo-list.tsx` which already owns the `optimisticTodos` state. This keeps the count reactive to optimistic updates without prop drilling or context.

## Complexity Tracking

> No constitution violations. Table not needed.
