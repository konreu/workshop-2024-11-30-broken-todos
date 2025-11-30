<!--
Sync Impact Report:
- Version change: 0.0.0 → 1.0.0 (MAJOR: Initial constitution for workshop project)
- Added principles: Clarity Over Cleverness, Server-First Architecture, Explicit Error Handling, Type Safety, Pedagogical Intent
- Added sections: Technology Stack, Development Workflow
- Templates requiring updates: ✅ Reviewed (no updates needed - templates are generic)
- Follow-up TODOs: None
-->

# Flight Simulator Constitution

A learning environment for teaching developers to reason about code in the age of AI.

## Core Principles

### I. Clarity Over Cleverness

Code MUST prioritize readability and understanding over brevity or sophistication.

- Prefer explicit over implicit in all cases
- Add comments explaining _why_, not just _what_
- Use descriptive variable and function names (no abbreviations unless universally understood)
- When explaining code, assume the reader is smart but unfamiliar with the codebase

**Rationale**: This is a teaching environment. Every line of code is a potential learning opportunity. Clever code creates barriers; clear code creates bridges.

### II. Server-First Architecture

Follow Next.js 15 App Router patterns with Server Components as the default.

- Server Components MUST be the default; use `"use client"` only when necessary (interactivity, hooks, browser APIs)
- Server Actions MUST handle all data mutations via `"use server"` functions
- Data fetching MUST happen on the server using Drizzle ORM queries
- Client components MUST receive data as props from server parents, not fetch directly

**Rationale**: Server-first reduces client bundle size, improves initial load performance, and keeps sensitive logic server-side. It's also the direction React and Next.js are moving in 2025.

### III. Explicit Error Handling

Errors MUST be handled gracefully with clear feedback—no silent failures.

- Server Actions MUST wrap database operations in try/catch and return structured results
- Client components MUST display meaningful error states to users
- Form validation MUST happen both client-side (for UX) and server-side (for security)
- Use error boundaries for unexpected failures; use explicit error UI for expected failures

**Rationale**: Silent failures are debugging nightmares and terrible UX. Users deserve to know what went wrong; developers deserve stack traces.

### IV. Type Safety

TypeScript MUST be used throughout with strict mode enabled.

- All function parameters and return types MUST be explicitly typed
- Database schemas MUST use Drizzle's type inference (`InferSelectModel`, `InferInsertModel`)
- Avoid `any` type; use `unknown` with type guards when type is truly unknown
- Props interfaces MUST be defined for all components

**Rationale**: TypeScript catches bugs at compile time that would otherwise appear at runtime. In a learning environment, type errors are teaching moments.

### V. Pedagogical Intent

Every feature and bug exists to teach something specific.

- Features MUST be small enough to understand in isolation
- Intentional bugs MUST span difficulty levels (junior → mid → senior)
- Code patterns MUST demonstrate real-world scenarios developers will encounter
- The codebase MUST support the "think before typing" workshop philosophy

**Rationale**: This isn't a production app—it's a curriculum. Every decision should serve the learning objectives.

### VI. Test-First Development

Tests MUST be written before implementation code (TDD approach).

- New features MUST have a failing test before any implementation code is written
- Server Actions MUST have unit tests that mock the database layer
- React Components MUST have component tests verifying user interactions
- Critical user flows MUST have end-to-end tests using Playwright
- Tests MUST serve as executable documentation—readable by humans, not just machines

**Rationale**: In a learning environment, tests are doubly valuable. They catch bugs AND teach expected behavior. Writing tests first forces you to think about _what_ the code should do before worrying about _how_. This mirrors the workshop philosophy of "think before typing."

## Technology Stack

**Runtime & Framework**:

- Next.js 15.x with App Router and Turbopack
- React 19.x with Server Components
- TypeScript 5.x in strict mode

**Database**:

- Turso (libSQL) for SQLite-compatible edge database
- Drizzle ORM for type-safe queries and migrations
- Schema defined in `db/schema.ts`; migrations in `migrations/`

**Styling**:

- Tailwind CSS 4.x for utility-first styling
- CSS variables for theming (defined in `app/globals.css`)

**Development**:

- ESLint 9.x with `eslint-config-next`
- Prettier for code formatting
- Git with conventional commits

**Deployment**:

- Vercel-ready (no custom server)
- Environment variables: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`

## Development Workflow

### Commit Standards

- Commits MUST be small and logical—one concept per commit
- Commit messages MUST follow conventional commits: `type(scope): description`
  - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Never commit broken code—run `npm run lint` before every commit

### Code Review Checklist

Before merging, verify:

- [ ] Types are explicit and correct
- [ ] Errors are handled with user feedback
- [ ] Server/client boundary is appropriate
- [ ] Code is clear enough for a newcomer to understand
- [ ] No silent failures or swallowed errors

### File Organization

```
app/                    # Next.js App Router pages and layouts
  actions.ts            # Server Actions (data mutations)
  page.tsx              # Route components (Server Components by default)
  *.tsx                 # UI components (colocated with routes)
db/
  index.ts              # Database client initialization
  schema.ts             # Drizzle schema definitions
migrations/             # Drizzle migration files
specs/                  # Feature specifications (spec-kit)
```

## Governance

This constitution defines the non-negotiable standards for the Flight Simulator project. All code contributions MUST comply.

- **Amendments**: Require documentation of the change, rationale, and impact on existing code
- **Exceptions**: MUST be documented inline with `// EXCEPTION: <reason>` comments
- **Compliance**: PRs MUST pass lint checks and manual review against these principles
- **Guidance**: See `AGENTS.md` for AI collaboration guidelines and `CLAUDE.md` for project context

**Version**: 1.0.0 | **Ratified**: 2025-11-30 | **Last Amended**: 2025-11-30
