# workshop-2024-11-30-broken-todos Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-11-30

## Active Technologies
- Turso (libSQL/SQLite-compatible) for production, SQLite local file for E2E tests (002-testing-infrastructure)
- TypeScript 5.x (strict mode) + Next.js 15.x, React 19.x, @dnd-kit/core (drag-and-drop library) (001-drag-reorder)
- Turso (libSQL/SQLite) via Drizzle ORM (001-drag-reorder)
- TypeScript 5.x, React 19.x, Next.js 15.x + React (useOptimistic hook already in use), Tailwind CSS 4.x (003-todo-count)
- N/A (derived value from existing optimistic state, no persistence needed) (003-todo-count)

- TypeScript 5.x, Node.js (devcontainer) + Next.js 15.3, React 19, Drizzle ORM 0.44, Turso/libSQL (002-testing-infrastructure)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript 5.x, Node.js (devcontainer): Follow standard conventions

## Recent Changes
- 003-todo-count: Added TypeScript 5.x, React 19.x, Next.js 15.x + React (useOptimistic hook already in use), Tailwind CSS 4.x
- 001-drag-reorder: Added TypeScript 5.x (strict mode) + Next.js 15.x, React 19.x, @dnd-kit/core (drag-and-drop library)
- 002-testing-infrastructure: Added TypeScript 5.x, Node.js (devcontainer) + Next.js 15.3, React 19, Drizzle ORM 0.44, Turso/libSQL


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
