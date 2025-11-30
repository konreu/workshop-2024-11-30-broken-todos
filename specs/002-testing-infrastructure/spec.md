# Feature Specification: Testing Infrastructure

**Feature Branch**: `002-testing-infrastructure`  
**Created**: 2025-11-30  
**Status**: Draft  
**Input**: User description: "Add tests for UI and actions - Jest / Playwright / React Testing Library - Mock Drizzle/Turso - Add test commands to package.json script - Update constitution.md / AGENTS.md to use TDD red-green-refactor"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Developer Writes Unit Tests for Server Actions (Priority: P1)

A developer wants to write unit tests for server actions (`addTodo`, `removeTodoAction`, `toggleTodoAction`, `getTodos`) to verify business logic without hitting a real database.

**Why this priority**: Server actions contain the core business logic. Testing them in isolation ensures the foundation is solid. This is also the most common testing pattern developers need to learn.

**Independent Test**: Can be fully tested by running `npm run test:unit` and verifying all action tests pass with mocked database.

**Acceptance Scenarios**:

1. **Given** the test environment is configured, **When** I run `npm run test:unit`, **Then** Jest executes all `*.test.ts` files in `__tests__/` directories
2. **Given** a unit test imports a server action, **When** the test calls `addTodo()`, **Then** the database is mocked (not real Turso) and the test completes in <100ms
3. **Given** `addTodo()` is called with valid FormData, **When** the test runs, **Then** the mock database receives an insert with the correct description
4. **Given** `toggleTodoAction(id)` is called, **When** the test runs, **Then** the mock database receives an update toggling the `completed` field

---

### User Story 2 - Developer Writes Component Tests with React Testing Library (Priority: P2)

A developer wants to test React components (`Todo`, `TodoList`, `Form`) in isolation to verify UI rendering and user interactions.

**Why this priority**: UI components are the user-facing layer. Testing them ensures the interface works correctly before integration testing. This teaches component testing patterns.

**Independent Test**: Can be fully tested by running `npm run test:unit` and verifying all component tests render correctly and respond to user interactions.

**Acceptance Scenarios**:

1. **Given** a `Todo` component test, **When** I render a todo item, **Then** it displays the description text
2. **Given** a `Todo` component with `completed: true`, **When** I render it, **Then** it displays with line-through styling
3. **Given** a `Todo` component, **When** I click the checkbox, **Then** `toggleTodoAction` is called with the correct ID
4. **Given** a `Todo` component, **When** I click the delete button, **Then** `removeTodoAction` is called with the correct ID
5. **Given** the `Form` component, **When** I submit with text, **Then** `addTodo` is called with the form data

---

### User Story 3 - Developer Runs End-to-End Tests with Playwright (Priority: P2)

A developer wants to run end-to-end tests that simulate real user interactions in a browser, testing the complete flow from UI to database.

**Why this priority**: E2E tests validate the full stack works together. They catch integration issues that unit tests miss. Important for a learning environment to show the testing pyramid.

**Independent Test**: Can be fully tested by running `npm run test:e2e` with a local dev server (or test server) running.

**Acceptance Scenarios**:

1. **Given** the app is running, **When** I run `npm run test:e2e`, **Then** Playwright launches a browser and executes all `*.spec.ts` files in `e2e/`
2. **Given** the home page loads, **When** Playwright visits `/`, **Then** the todo list is visible
3. **Given** an empty input, **When** Playwright types "Buy milk" and submits, **Then** "Buy milk" appears in the todo list
4. **Given** a todo exists, **When** Playwright clicks the checkbox, **Then** the todo shows as completed (with confetti!)
5. **Given** a completed todo, **When** Playwright clicks delete, **Then** the todo is removed from the list

---

### User Story 4 - Developer Follows TDD Workflow (Priority: P3)

A developer wants clear guidance on the "red-green-refactor" TDD workflow, with documentation that explains how to write tests first, then implementation.

**Why this priority**: This is the pedagogical payoff—teaching TDD. Less urgent than having tests work, but essential for the learning environment's goals.

**Independent Test**: Can be validated by reading AGENTS.md/constitution.md and following the documented workflow to add a new feature.

**Acceptance Scenarios**:

1. **Given** AGENTS.md is updated, **When** I read it, **Then** I find clear TDD workflow instructions
2. **Given** constitution.md is updated, **When** I read it, **Then** I find a new principle about "Test-First Development"
3. **Given** I want to add a new feature, **When** I follow the docs, **Then** I know to write a failing test first, then make it pass, then refactor

---

### User Story 5 - CI Runs Tests on Pull Requests (Priority: P3)

Tests should automatically run when a pull request is opened, ensuring no broken code is merged.

**Why this priority**: CI integration is important but builds on the testing foundation. It's a "nice to have" once tests exist.

**Independent Test**: Can be validated by opening a PR and seeing test results in GitHub Actions.

**Acceptance Scenarios**:

1. **Given** a PR is opened, **When** GitHub Actions runs, **Then** `npm run test` executes
2. **Given** any test fails, **When** the workflow completes, **Then** the PR shows a failed check
3. **Given** all tests pass, **When** the workflow completes, **Then** the PR shows a green check

---

### Edge Cases

- What happens when a test imports a client component that uses `window`? (Jest needs jsdom environment)
- How do we handle `useTransition` and async state in component tests? (May need `act()` wrapper)
- What happens when Playwright tests run but the dev server isn't started? (Need clear error or auto-start)
- How do we test server actions that call `revalidatePath`? (Needs mocking)
- What if database mocks get out of sync with the real schema? (Need schema-aware mocks)

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST support running unit tests via `npm run test:unit` using Jest
- **FR-002**: System MUST support running E2E tests via `npm run test:e2e` using Playwright
- **FR-003**: System MUST provide a combined `npm run test` that runs all test suites
- **FR-004**: System MUST mock Drizzle database operations in unit tests (no real Turso calls)
- **FR-005**: System MUST support React Testing Library for component testing
- **FR-006**: System MUST configure Jest with TypeScript support and path aliases (`@/`)
- **FR-007**: System MUST configure Jest with jsdom environment for client components
- **FR-008**: System MUST provide test coverage reporting via `npm run test:coverage`
- **FR-009**: System MUST include at least one example test for server actions demonstrating mocking
- **FR-010**: System MUST include at least one example test for React components
- **FR-011**: System MUST include at least one example E2E test with Playwright
- **FR-012**: System MUST update AGENTS.md with TDD workflow guidance
- **FR-013**: System MUST update constitution.md with Test-First Development principle
- **FR-014**: System MUST include accessibility tests using jest-axe for component tests
- **FR-015**: System MUST provide seed functions in `db/seeds/` for E2E test data setup
- **FR-016**: System MUST provide `npm run test:watch` for TDD development workflow

### Non-Functional Requirements

- **NFR-001**: Unit tests MUST complete in <10 seconds for the initial test suite
- **NFR-002**: Test setup MUST work in the existing devcontainer without additional system dependencies
- **NFR-003**: Mocking approach MUST be maintainable as the schema evolves

### Key Entities _(include if feature involves data)_

- **Test Suite**: A collection of test files organized by type (unit, e2e)
- **Mock Database**: A Jest mock of the Drizzle ORM that tracks calls without hitting Turso
- **Test Config**: Jest and Playwright configuration files at the project root

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: `npm run test:unit` passes with ≥1 server action test and ≥1 component test
- **SC-002**: `npm run test:e2e` passes with ≥1 end-to-end user flow test
- **SC-003**: `npm run test:coverage` produces a coverage report showing tested files
- **SC-004**: All tests complete in <30 seconds total (unit + e2e)
- **SC-005**: A new developer can follow AGENTS.md to write their first test within 10 minutes
- **SC-006**: Database mock correctly intercepts all Drizzle operations (insert, select, update, delete)

## Decisions

1. **Snapshot testing**: Skip for now—brittle and noisy for a learning environment
2. **E2E database strategy**: Use a local SQLite test database (Turso is SQLite-compatible). Seed data via `db/seeds/` directory for known test states. No MSW needed for E2E—we want true end-to-end testing.
3. **Test fixtures**: Yes, create `db/seeds/` with seed functions for common todo states
4. **Visual regression**: Out of scope for v1
5. **GitHub Actions**: Include basic workflow in this spec (P3)
6. **Accessibility testing**: Include `jest-axe` for automated a11y checks in component tests
7. **Test file organization**: `app/__tests__/` for unit/component tests, `e2e/` at root for Playwright
8. **Watch mode**: Document `npm run test:watch` for TDD workflow

## Technology Choices

| Category          | Choice                      | Rationale                                              |
| ----------------- | --------------------------- | ------------------------------------------------------ |
| Unit Test Runner  | Jest                        | Industry standard, excellent TS support, good mocking  |
| Component Testing | React Testing Library       | Encourages accessible, user-centric tests              |
| E2E Testing       | Playwright                  | Modern, fast, good DX, cross-browser                   |
| Mocking           | Jest mocks                  | Native Jest mocking for DB in unit tests               |
| E2E Database      | SQLite (local file)         | Turso-compatible, seedable via `db/seeds/`             |
| Coverage          | Jest built-in               | `--coverage` flag, no extra deps                       |
| Accessibility     | jest-axe                    | Automated a11y checks in component tests               |

## Dependencies

- `jest` - Test runner
- `@types/jest` - TypeScript types
- `ts-jest` - TypeScript transformer for Jest
- `jest-environment-jsdom` - Browser-like environment for component tests
- `@testing-library/react` - Component testing utilities
- `@testing-library/jest-dom` - Custom matchers for DOM assertions
- `@testing-library/user-event` - Simulate user interactions
- `jest-axe` - Accessibility testing matchers
- `@playwright/test` - E2E testing framework

## File Structure

```
app/
├── __tests__/                    # Unit and component tests
│   ├── actions.test.ts           # Server action tests
│   ├── todo.test.tsx             # Todo component tests
│   └── form.test.tsx             # Form component tests
db/
├── seeds/                        # Test data seeders
│   └── todos.ts                  # Seed functions for todo states
e2e/                              # Playwright E2E tests
├── todo-flow.spec.ts             # Main user flow test
jest.config.ts                    # Jest configuration
playwright.config.ts              # Playwright configuration
```

## NPM Scripts

```json
{
  "test": "npm run test:unit && npm run test:e2e",
  "test:unit": "jest",
  "test:e2e": "playwright test",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```
