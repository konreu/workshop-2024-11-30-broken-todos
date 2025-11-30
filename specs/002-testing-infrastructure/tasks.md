# Tasks: Testing Infrastructure

**Input**: Design documents from `/specs/002-testing-infrastructure/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: This feature IS about testing infrastructure, so example tests are part of the deliverable (not optional).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and create base configuration files

- [x] T001 Install Jest and React Testing Library dependencies via npm (jest, @types/jest, jest-environment-jsdom, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, jest-axe, @types/jest-axe)
- [x] T002 Install Playwright dependency via npm (@playwright/test) and run `npx playwright install chromium`
- [x] T003 [P] Create Jest configuration in jest.config.ts (using next/jest preset per contracts/config-files.md)
- [x] T004 [P] Create Jest setup file in jest.setup.ts (jest-dom matchers, jest-axe, next/cache mock)
- [x] T005 [P] Create Playwright configuration in playwright.config.ts (webServer auto-start, Chromium only, retries: 0)
- [x] T006 Add test scripts to package.json (test, test:unit, test:e2e, test:watch, test:coverage per contracts/npm-scripts.md)
- [x] T007 [P] Update .gitignore with test artifacts (coverage/, playwright-report/, test-results/)

**Checkpoint**: `npm run test:unit` should run (with no tests yet) and `npm run test:e2e` should start dev server

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create database mocks and seed functions that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T008 Create database mock in db/**mocks**/index.ts (mockInsert, mockSelect, mockUpdate, mockDelete with chainable methods)
- [x] T009 Create seed functions in db/seeds/todos.ts (clearTodos, seedTodos, seedTodo per contracts/test-api.md)
- [x] T010 Create **tests** directory at app/**tests**/
- [x] T011 Create e2e/ directory at repository root

**Checkpoint**: Mock database ready for unit tests, seed functions ready for E2E tests

---

## Phase 3: User Story 1 - Server Action Unit Tests (Priority: P1) 🎯 MVP

**Goal**: Developer can write and run unit tests for server actions with mocked database

**Independent Test**: Run `npm run test:unit` and verify all action tests pass with mocked database

### Implementation for User Story 1

- [x] T012 [US1] Create server action tests in app/**tests**/actions.test.ts with tests for:
  - addTodo() inserts with correct description from FormData
  - removeTodoAction() deletes with correct ID
  - toggleTodoAction() updates with correct ID
  - getTodos() selects from todosTable
  - ✓ Include assertion that mock database intercepts all Drizzle operations (no real Turso calls)
  - ✓ Include assertion that revalidatePath is called after mutations

**Checkpoint**: `npm run test:unit` passes with ≥4 server action tests, all using mocked database

---

## Phase 4: User Story 2 - React Component Tests (Priority: P2)

**Goal**: Developer can test React components with React Testing Library and verify UI interactions

**Independent Test**: Run `npm run test:unit` and verify all component tests render correctly and respond to interactions

### Implementation for User Story 2

- [x] T013 [P] [US2] Create Todo component tests in app/**tests**/todo.test.tsx with tests for:
  - Renders todo description text
  - Displays line-through styling when completed: true
  - Clicking checkbox calls toggleTodoAction with correct ID
  - Clicking delete button calls removeTodoAction with correct ID
  - Has no accessibility violations (jest-axe)
  - ✓ Use waitFor() for useTransition async state updates
- [x] T014 [P] [US2] Create TodoList component tests in app/**tests**/todo-list.test.tsx with tests for:
  - Renders list of todo items
  - Renders empty state when no todos
  - Has no accessibility violations (jest-axe)
- [x] T015 [P] [US2] Create Form component tests in app/**tests**/form.test.tsx with tests for:
  - Renders input and submit button
  - Submitting form calls addTodo with FormData containing description
  - Has no accessibility violations (jest-axe)

**Checkpoint**: `npm run test:unit` passes with ≥7 component tests including accessibility checks

---

## Phase 5: User Story 3 - E2E Tests with Playwright (Priority: P2)

**Goal**: Developer can run end-to-end tests that auto-start dev server and test full user flows

**Independent Test**: Run `npm run test:e2e` and verify Playwright auto-starts server, runs tests, and shuts down

### Implementation for User Story 3

- [ ] T016 [US3] Create main E2E test file in e2e/todo-flow.spec.ts with:
  - beforeEach that clears database using clearTodos()
  - Test: home page loads and shows todo list
  - Test: can add a new todo (type, submit, verify appears)
  - Test: can toggle todo complete (click checkbox, verify line-through)
  - Test: can delete a todo (click delete, verify removed)
  - ✓ Verify webServer auto-starts and stops dev server (implicit via `npm run test:e2e`)
  - ✓ Use seedTodos()/seedTodo() in setup to verify seed functions work in E2E context

**Checkpoint**: `npm run test:e2e` passes with ≥4 E2E tests, server auto-managed

---

## Phase 6: User Story 4 - TDD Documentation (Priority: P3)

**Goal**: Developer has clear TDD workflow guidance in project documentation

**Independent Test**: Read AGENTS.md and constitution.md, follow documented workflow to add a feature

### Implementation for User Story 4

- [ ] T017 [P] [US4] Update AGENTS.md with TDD workflow section including:
  - Red-Green-Refactor cycle explanation
  - How to run tests in watch mode (`npm run test:watch`)
  - Example of writing a failing test first
  - When to use unit vs component vs E2E tests
- [ ] T018 [P] [US4] Update constitution.md (.specify/memory/constitution.md) with:
  - New principle "VI. Test-First Development"
  - Rationale for TDD in learning environment
  - Integration with existing principles

**Checkpoint**: New developer can follow docs to write their first test within 10 minutes

---

## Phase 7: User Story 5 - CI Integration (Priority: P3)

**Goal**: Tests automatically run on pull requests via GitHub Actions

**Independent Test**: Open a PR and see test results in GitHub Actions

### Implementation for User Story 5

- [ ] T019 [US5] Create GitHub Actions workflow in .github/workflows/test.yml with:
  - Trigger on pull_request and push to main
  - Setup Node.js and install dependencies
  - Run `npm run test:unit`
  - Run `npm run test:e2e` (install Playwright browsers in CI)
  - Report pass/fail status to PR

**Checkpoint**: Opening a PR triggers test workflow, shows green/red check

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Validation, cleanup, and documentation finalization

- [ ] T020 Run `npm run test:coverage` and verify coverage report generates in coverage/
- [ ] T021 Verify all tests complete in <30 seconds total (NFR-001: unit <10s)
- [ ] T022 Run quickstart.md validation - follow guide to write a new test
- [ ] T023 Verify database mock stays in sync with schema (mockInsert/Select/Update/Delete match Drizzle patterns)
- [ ] T024 Final code review: ensure test files follow Clarity Over Cleverness principle with explanatory comments

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) ─────────────────────┐
                                     v
Phase 2 (Foundational) ──────────────┤ BLOCKS ALL USER STORIES
                                     v
              ┌──────────────────────┼──────────────────────┐
              v                      v                      v
Phase 3 (US1)              Phase 4 (US2)           Phase 5 (US3)
Server Actions             Components              E2E Tests
[P1 - MVP]                 [P2]                    [P2]
              │                      │                      │
              v                      v                      v
              └──────────────────────┴──────────────────────┘
                                     │
              ┌──────────────────────┼──────────────────────┐
              v                      v                      v
         Phase 6 (US4)         Phase 7 (US5)          Phase 8
         TDD Docs              CI Integration         Polish
         [P3]                  [P3]
```

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Phase 2 (mocks) - No dependencies on other stories - **MVP**
- **User Story 2 (P2)**: Depends on Phase 2 - Can run parallel with US1 and US3
- **User Story 3 (P2)**: Depends on Phase 2 (seeds) - Can run parallel with US1 and US2
- **User Story 4 (P3)**: Depends on US1-3 being done (needs examples to reference)
- **User Story 5 (P3)**: Depends on US1-3 being done (needs tests to run in CI)

### Within Each User Story

- Implementation tasks in order listed
- Story complete before moving to next priority (unless parallelizing)

### Parallel Opportunities

**Setup (Phase 1)**:

- T003, T004, T005, T007 can run in parallel (different config files)

**User Stories (after Phase 2)**:

- US1, US2, US3 can run in parallel (different test directories/concerns)
- Within US2: T015, T016 can run in parallel (different component test files)
- Within US4: T021, T022 can run in parallel (different doc files)

---

## Parallel Example: User Story 2

```bash
# Launch all component tests in parallel:
Task T015: "Create Todo component tests in app/__tests__/todo.test.tsx"
Task T016: "Create Form component tests in app/__tests__/form.test.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T007)
2. Complete Phase 2: Foundational (T008-T011)
3. Complete Phase 3: User Story 1 (T012-T014)
4. **STOP and VALIDATE**: `npm run test:unit` passes with action tests
5. **MVP DELIVERED**: Developers can write unit tests for server actions

### Incremental Delivery

1. Setup + Foundational → Testing framework ready
2. Add US1 (Server Actions) → `npm run test:unit` works → **MVP!**
3. Add US2 (Components) → Component testing works
4. Add US3 (E2E) → `npm run test:e2e` works → **Full testing pyramid!**
5. Add US4 (Docs) → TDD workflow documented
6. Add US5 (CI) → Automated on PRs
7. Polish → Production-ready testing infrastructure

### Suggested MVP Scope

**Minimum**: Phase 1 + Phase 2 + Phase 3 (User Story 1)

- Delivers: Working Jest setup with server action tests and database mocking
- Validates: Core testing infrastructure works
- Time estimate: ~2 hours

---

## Summary

| Metric                     | Value                |
| -------------------------- | -------------------- |
| **Total Tasks**            | 24                   |
| **Phase 1 (Setup)**        | 7 tasks              |
| **Phase 2 (Foundational)** | 4 tasks              |
| **User Story 1 (P1)**      | 1 task               |
| **User Story 2 (P2)**      | 3 tasks              |
| **User Story 3 (P2)**      | 1 task               |
| **User Story 4 (P3)**      | 2 tasks              |
| **User Story 5 (P3)**      | 1 task               |
| **Phase 8 (Polish)**       | 5 tasks              |
| **Parallel Opportunities** | 10 tasks marked [P]  |
| **MVP Tasks**              | 12 tasks (T001-T012) |

---

## Notes

- [P] tasks = different files, no dependencies on each other
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Tests are part of deliverable (not optional) since this feature IS testing infrastructure
