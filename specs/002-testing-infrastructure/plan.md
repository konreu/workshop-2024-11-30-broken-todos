# Implementation Plan: Testing Infrastructure

**Branch**: `002-testing-infrastructure` | **Date**: 2025-11-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-testing-infrastructure/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Add comprehensive testing infrastructure (Jest + React Testing Library for unit/component tests, Playwright for E2E) with mocked Drizzle/Turso database, seed functions for test data, and TDD workflow documentation in AGENTS.md/constitution.md.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js (devcontainer)  
**Primary Dependencies**: Next.js 15.3, React 19, Drizzle ORM 0.44, Turso/libSQL  
**Storage**: Turso (libSQL/SQLite-compatible) for production, SQLite local file for E2E tests  
**Testing**: Jest (unit/component), React Testing Library (component), Playwright (E2E), jest-axe (a11y)  
**Target Platform**: Web (Next.js App Router), devcontainer Linux  
**Project Type**: Web application (Next.js full-stack)  
**Performance Goals**: Unit tests <10s, total test suite <30s  
**Constraints**: Must work in existing devcontainer without additional system dependencies  
**Scale/Scope**: Small todo app (~5 components, 4 server actions, 1 database table)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                         | Status  | Notes                                                                                            |
| --------------------------------- | ------- | ------------------------------------------------------------------------------------------------ |
| **I. Clarity Over Cleverness**    | ✅ PASS | Tests will be explicit with clear assertions; example tests demonstrate patterns for learners    |
| **II. Server-First Architecture** | ✅ PASS | Server Actions are tested in isolation; component tests verify client/server boundary is correct |
| **III. Explicit Error Handling**  | ✅ PASS | Tests will verify error handling behavior; no silent test failures                               |
| **IV. Type Safety**               | ✅ PASS | Jest configured with TypeScript; test types will be explicit                                     |
| **V. Pedagogical Intent**         | ✅ PASS | Testing infrastructure teaches TDD workflow; example tests are learning materials                |

**Gate Status**: ✅ PASSED - All constitution principles are supported by this feature

## Project Structure

### Documentation (this feature)

```text
specs/002-testing-infrastructure/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Next.js App Router structure (existing)
app/
├── __tests__/                    # Unit and component tests (NEW)
│   ├── actions.test.ts           # Server action tests
│   ├── todo.test.tsx             # Todo component tests
│   └── form.test.tsx             # Form component tests
├── actions.ts                    # Server Actions (existing)
├── form.tsx                      # Form component (existing)
├── todo.tsx                      # Todo component (existing)
├── todo-list.tsx                 # TodoList component (existing)
└── ...

db/
├── index.ts                      # Database client (existing)
├── schema.ts                     # Drizzle schema (existing)
├── __mocks__/                    # Jest mocks for db module (NEW)
│   └── index.ts                  # Mock db implementation
└── seeds/                        # Test data seeders (NEW)
    └── todos.ts                  # Seed functions for todo states

e2e/                              # Playwright E2E tests (NEW)
└── todo-flow.spec.ts             # Main user flow test

# Config files at root (NEW)
jest.config.ts                    # Jest configuration
jest.setup.ts                     # Jest setup (jsdom, testing-library)
playwright.config.ts              # Playwright configuration
```

**Structure Decision**: Next.js App Router web application. Tests colocated with source in `app/__tests__/` following Next.js conventions. E2E tests in separate `e2e/` directory at root. Database mocks in `db/__mocks__/` following Jest conventions. Seed functions in `db/seeds/` for both unit test fixtures and E2E test data setup.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations. All constitution principles are supported by this feature.

## Post-Design Constitution Check

_Re-evaluation after Phase 1 design completion._

| Principle                         | Status  | Design Validation                                                                                 |
| --------------------------------- | ------- | ------------------------------------------------------------------------------------------------- |
| **I. Clarity Over Cleverness**    | ✅ PASS | Example tests in quickstart.md are explicit and well-commented; mock patterns are straightforward |
| **II. Server-First Architecture** | ✅ PASS | Design separates server action tests (mocked DB) from client component tests (mocked actions)     |
| **III. Explicit Error Handling**  | ✅ PASS | Test contracts include error case testing; no silent failures in test setup                       |
| **IV. Type Safety**               | ✅ PASS | All contracts define TypeScript types; jest.config.ts uses type-safe configuration                |
| **V. Pedagogical Intent**         | ✅ PASS | quickstart.md teaches TDD workflow; example tests are learning materials with comments            |

**Post-Design Gate Status**: ✅ PASSED - Design artifacts align with constitution principles

## Generated Artifacts

| Artifact              | Path                                                         | Description                            |
| --------------------- | ------------------------------------------------------------ | -------------------------------------- |
| Implementation Plan   | `specs/002-testing-infrastructure/plan.md`                   | This file                              |
| Research              | `specs/002-testing-infrastructure/research.md`               | Technology research and decisions      |
| Data Model            | `specs/002-testing-infrastructure/data-model.md`             | Test data structures and mock patterns |
| Quickstart Guide      | `specs/002-testing-infrastructure/quickstart.md`             | How to write and run tests             |
| NPM Scripts Contract  | `specs/002-testing-infrastructure/contracts/npm-scripts.md`  | Required npm scripts                   |
| Test API Contract     | `specs/002-testing-infrastructure/contracts/test-api.md`     | Seed functions and mock utilities      |
| Config Files Contract | `specs/002-testing-infrastructure/contracts/config-files.md` | Jest and Playwright configuration      |
