# Feature Specification: Todo Count Display

**Feature Branch**: `003-todo-count`  
**Created**: November 30, 2025  
**Status**: Draft  
**Input**: User description: "Todo count - Display X of Y completed todos"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - View Completed Count (Priority: P1)

As a user managing my tasks, I want to see how many todos I've completed out of the total so I can track my progress at a glance.

**Why this priority**: This is the core functionality of the feature. Users need immediate visual feedback about their progress to stay motivated and understand their workload.

**Independent Test**: Can be fully tested by loading the page with existing todos and verifying the count displays correctly. Delivers immediate value by showing progress status.

**Acceptance Scenarios**:

1. **Given** I have 5 todos where 2 are completed, **When** I view the todo list, **Then** I see "2 of 5 completed" displayed prominently
2. **Given** I have no todos, **When** I view the todo list, **Then** I see "Add your first todo!" in place of the count
3. **Given** I have 3 todos and all are completed, **When** I view the todo list, **Then** I see "3 of 3 completed"

---

### User Story 2 - Count Updates When Toggling Completion (Priority: P1)

As a user completing tasks, I want the count to update immediately when I mark a todo as complete or incomplete, so I see real-time feedback on my progress.

**Why this priority**: Equal to P1 because without real-time updates, the count would be misleading and frustrating. This is essential for the feature to be useful.

**Independent Test**: Can be tested by toggling a single todo and observing the count change without page refresh.

**Acceptance Scenarios**:

1. **Given** I have 5 todos with 2 completed showing "2 of 5 completed", **When** I mark another todo as complete, **Then** the display immediately updates to "3 of 5 completed"
2. **Given** I have 5 todos with 3 completed showing "3 of 5 completed", **When** I mark a completed todo as incomplete, **Then** the display immediately updates to "2 of 5 completed"

---

### User Story 3 - Count Updates When Adding Todos (Priority: P2)

As a user adding new tasks, I want the count to update when I add a new todo, so I always see an accurate total.

**Why this priority**: Important but secondary to viewing and toggling. Users frequently add todos, and the count must stay accurate.

**Independent Test**: Can be tested by adding a new todo and verifying the total count increases.

**Acceptance Scenarios**:

1. **Given** I have 3 todos showing "1 of 3 completed", **When** I add a new todo, **Then** the display updates to "1 of 4 completed"
2. **Given** I have 0 todos showing "Add your first todo!", **When** I add a new todo, **Then** the display updates to "0 of 1 completed"

---

### User Story 4 - Count Updates When Removing Todos (Priority: P2)

As a user removing tasks, I want the count to update when I delete a todo, so I always see an accurate count.

**Why this priority**: Important but secondary. Users occasionally remove todos, and the count must stay accurate.

**Independent Test**: Can be tested by removing a todo and verifying both the total and completed counts adjust correctly.

**Acceptance Scenarios**:

1. **Given** I have 4 todos with 2 completed showing "2 of 4 completed", **When** I remove an incomplete todo, **Then** the display updates to "2 of 3 completed"
2. **Given** I have 4 todos with 2 completed showing "2 of 4 completed", **When** I remove a completed todo, **Then** the display updates to "1 of 3 completed"

---

### Edge Cases

- What happens when all todos are removed? Display switches to "Add your first todo!" message
- What happens during optimistic updates? Count should update immediately before server confirmation
- What happens if server action fails? Count should revert to accurate state (handled by optimistic UI revert)

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST display a count showing completed todos and total todos in the format "X of Y completed"
- **FR-002**: System MUST update the count immediately when a todo is marked complete or incomplete (optimistic update)
- **FR-003**: System MUST update the count immediately when a new todo is added
- **FR-004**: System MUST update the count immediately when a todo is removed
- **FR-005**: System MUST display the count inside the todo list card, at the top above the todo items
- **FR-006**: System MUST display "Add your first todo!" instead of the count when there are zero todos
- **FR-007**: System MUST calculate the count from the optimistic todo state to ensure real-time accuracy
- **FR-008**: System MUST NOT change the count when todos are reordered (drag-and-drop does not affect completion status)

### Key Entities

- **Todo**: Existing entity with `completed` boolean attribute used to calculate the count
- **Count Display**: A derived value (not stored) calculated as the sum of completed todos and total todos from the current optimistic state

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can see their completed count within 1 second of page load
- **SC-002**: Count updates appear instantly (within 100ms) after any todo action (add/remove/toggle)
- **SC-003**: Count accuracy is 100% - always matches the actual number of completed and total todos displayed
- **SC-004**: Feature works across Chromium-based browsers (Chrome, Edge) without visual glitches
- **SC-005**: Screen reader users can access the count via a live region (`aria-live="polite"`, `role="status"`) that politely announces changes

## Clarifications

### Session 2025-11-30

- Q: Where should the todo count be displayed in the UI? → A: Inside the todo list card, at the top above the todo items (rendered in `todo-list.tsx` component)
- Q: What should be displayed when there are zero todos? → A: Show alternative text "Add your first todo!" instead of the count
- Q: How should screen reader users access the count information? → A: Live region with polite announcements (aria-live="polite")
