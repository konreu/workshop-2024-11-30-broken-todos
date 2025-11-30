# Data Model: Todo Count Display

**Feature**: 003-todo-count  
**Date**: 2025-11-30

## Overview

This feature does NOT add new entities or modify the database schema. The count is a **derived value** computed client-side from existing data.

## Existing Entities (Unchanged)

### Todo

The existing `todosTable` schema remains unchanged:

| Field       | Type    | Description                  |
| ----------- | ------- | ---------------------------- |
| id          | integer | Primary key, auto-increment  |
| description | text    | Todo text content            |
| completed   | boolean | Whether the todo is done     |
| position    | integer | Sort order for drag-and-drop |

## Derived Values (New)

### TodoCount

A computed value, not stored in the database.

| Property  | Type   | Derivation                              |
| --------- | ------ | --------------------------------------- |
| completed | number | `todos.filter(t => t.completed).length` |
| total     | number | `todos.length`                          |

### Display Logic

```
if (total === 0) {
  display: "Add your first todo!"
} else {
  display: "{completed} of {total} completed"
}
```

## State Flow

```
Server (DB) → initialTodos → useOptimistic → optimisticTodos → TodoCount derivation → UI
```

The count always reflects the **optimistic** state, ensuring real-time updates before server confirmation.

## No Migration Required

This feature requires no database changes.
