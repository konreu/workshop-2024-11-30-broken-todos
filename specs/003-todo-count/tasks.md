# Tasks: Todo Count Display

**Input**: Design documents from `/specs/003-todo-count/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Included per TDD approach (AGENTS.md) and workshop learning environment

**Organization**: Tasks grouped by user story for independent implementation and testing

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, etc.)
- Exact file paths included in descriptions

---

## Phase 1: Setup

**Purpose**: No setup needed - using existing project structure

This feature adds to an existing Next.js project. No new project initialization required.

**Tasks**: None - proceed directly to Phase 2

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the TodoCount component that all user stories depend on

**⚠️ CRITICAL**: User story validation cannot begin until this phase is complete

### Tests (TDD: Write first, verify they FAIL)

- [ ] T001 [P] Create component test file `app/__tests__/todo-count.test.tsx` with test setup and mocks
- [ ] T002 [P] Write test: renders "Add your first todo!" when todos array is empty
- [ ] T003 [P] Write test: renders "X of Y completed" format when todos exist
- [ ] T004 [P] Write test: calculates completed count correctly (filters by completed: true)
- [ ] T005 [P] Write test: has aria-live="polite" attribute for accessibility
- [ ] T006 [P] Write test: has role="status" attribute for accessibility

### Implementation

- [ ] T007 Create `app/todo-count.tsx` with TodoCountProps interface per contracts/components.md
- [ ] T008 Implement empty state rendering ("Add your first todo!") in `app/todo-count.tsx`
- [ ] T009 Implement count calculation and display ("{completed} of {total} completed") in `app/todo-count.tsx`
- [ ] T010 Add accessibility attributes (aria-live, role) to `app/todo-count.tsx`
- [ ] T011 Add Tailwind styling (text-sm text-slate-500, py-3 px-4, text-center) to `app/todo-count.tsx`
- [ ] T012 Run `npm run test:unit -- --testPathPattern="todo-count"` and verify all tests pass

**Checkpoint**: TodoCount component complete and tested in isolation

---

## Phase 3: User Story 1 - View Completion Progress (Priority: P1) 🎯 MVP

**Goal**: User sees completion count when viewing the todo list

**Independent Test**: Load page with existing todos → count displays correctly

### Integration

- [ ] T013 [US1] Import TodoCount component in `app/todo-list.tsx`
- [ ] T014 [US1] Render `<TodoCount todos={optimisticTodos} />` in `app/todo-list.tsx` after screen reader div, before empty state check
- [ ] T015 [US1] Run `npm run lint` to verify no lint errors
- [ ] T016 [US1] Manual browser test: verify count displays with existing todos

### Integration Tests

- [ ] T017 [P] [US1] Add test to `app/__tests__/todo-list.test.tsx`: TodoCount receives optimisticTodos prop
- [ ] T018 [US1] Run `npm run test:unit` and verify all tests pass

**Checkpoint**: User Story 1 complete - count displays on page load ✅

---

## Phase 4: User Story 2 - Count Updates When Toggling (Priority: P1)

**Goal**: Count updates immediately when user toggles todo completion

**Independent Test**: Toggle a todo → count changes without page refresh

### E2E Test (TDD: Write first)

- [ ] T019 [P] [US2] Create `e2e/todo-count.spec.ts` with Playwright test setup
- [ ] T020 [US2] Write E2E test: toggling incomplete todo increases completed count
- [ ] T021 [US2] Write E2E test: toggling completed todo decreases completed count

### Validation

- [ ] T022 [US2] Run `npm run test:e2e -- --grep "todo-count"` and verify tests pass
- [ ] T023 [US2] Manual browser test: toggle todo and verify count updates immediately

**Checkpoint**: User Story 2 complete - count updates on toggle ✅

---

## Phase 5: User Story 3 - Count Updates When Adding (Priority: P2)

**Goal**: Count updates immediately when user adds a new todo

**Independent Test**: Add a todo → total count increases

### E2E Tests

- [ ] T024 [US3] Write E2E test in `e2e/todo-count.spec.ts`: adding todo increases total count
- [ ] T025 [US3] Write E2E test: adding first todo transitions from empty state to "0 of 1 completed"

### Validation

- [ ] T026 [US3] Run `npm run test:e2e -- --grep "todo-count"` and verify tests pass
- [ ] T027 [US3] Manual browser test: add todo and verify count updates immediately

**Checkpoint**: User Story 3 complete - count updates on add ✅

---

## Phase 6: User Story 4 - Count Updates When Removing (Priority: P2)

**Goal**: Count updates immediately when user removes a todo

**Independent Test**: Remove a todo → both completed and total counts adjust correctly

### E2E Tests

- [ ] T028 [US4] Write E2E test in `e2e/todo-count.spec.ts`: removing incomplete todo decreases total only
- [ ] T029 [US4] Write E2E test: removing completed todo decreases both completed and total
- [ ] T030 [US4] Write E2E test: removing last todo transitions to empty state message

### Validation

- [ ] T031 [US4] Run `npm run test:e2e -- --grep "todo-count"` and verify tests pass
- [ ] T032 [US4] Manual browser test: remove todos and verify count updates correctly

**Checkpoint**: User Story 4 complete - count updates on remove ✅

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and documentation

- [ ] T033 [P] Run full test suite: `npm run test:unit && npm run test:e2e`
- [ ] T034 [P] Run linter: `npm run lint`
- [ ] T035 Accessibility check: verify screen reader announces count changes (manual test with VoiceOver/NVDA)
- [ ] T036 Cross-browser test: verify in Chrome, Firefox, Safari (if available)
- [ ] T037 Update `specs/003-todo-count/quickstart.md` Definition of Done section - mark all items complete

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)        → None needed
Phase 2 (Foundational) → Creates TodoCount component - BLOCKS all stories
Phase 3 (US1: View)    → Depends on Phase 2 - Integrates component
Phase 4 (US2: Toggle)  → Depends on Phase 3 - Adds E2E tests
Phase 5 (US3: Add)     → Depends on Phase 3 - Adds E2E tests
Phase 6 (US4: Remove)  → Depends on Phase 3 - Adds E2E tests
Phase 7 (Polish)       → Depends on all stories complete
```

### User Story Dependencies

| Story        | Depends On       | Can Parallel With |
| ------------ | ---------------- | ----------------- |
| US1 (View)   | Phase 2 complete | -                 |
| US2 (Toggle) | US1 complete     | US3, US4          |
| US3 (Add)    | US1 complete     | US2, US4          |
| US4 (Remove) | US1 complete     | US2, US3          |

### Parallel Opportunities

**Phase 2 (all [P] tasks can run together):**

```
T001, T002, T003, T004, T005, T006 → All test file creation in parallel
```

**After US1 complete (US2, US3, US4 can run in parallel):**

```
Developer A: T019-T023 (US2: Toggle)
Developer B: T024-T027 (US3: Add)
Developer C: T028-T032 (US4: Remove)
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only)

1. ✅ Phase 1: Setup (none needed)
2. Complete Phase 2: Foundational (T001-T012)
3. Complete Phase 3: US1 View (T013-T018)
4. Complete Phase 4: US2 Toggle (T019-T023)
5. **STOP and VALIDATE**: MVP delivers core value
6. Demo: User can see and update their progress count

### Full Implementation

1. Complete MVP above
2. Add Phase 5: US3 Add (T024-T027)
3. Add Phase 6: US4 Remove (T028-T032)
4. Complete Phase 7: Polish (T033-T037)

---

## Summary

| Phase        | Tasks          | Purpose                    |
| ------------ | -------------- | -------------------------- |
| Setup        | 0              | None needed                |
| Foundational | 12 (T001-T012) | Create TodoCount component |
| US1: View    | 6 (T013-T018)  | Integrate into TodoList    |
| US2: Toggle  | 5 (T019-T023)  | E2E tests for toggle       |
| US3: Add     | 4 (T024-T027)  | E2E tests for add          |
| US4: Remove  | 5 (T028-T032)  | E2E tests for remove       |
| Polish       | 5 (T033-T037)  | Final validation           |
| **Total**    | **37 tasks**   |                            |

**Parallel opportunities**: 11 tasks can run in parallel  
**Independent test criteria**: Each user story has browser validation step  
**MVP scope**: Phases 1-4 (US1 + US2) = 23 tasks
