# Flight Simulator Workshop

**Date**: Sunday, Nov 30, 2025 | 12:00-2:00pm ET  
**Goal**: Learn to debug with AI assistance—think before typing, verify everything.

## Features

| Status | Feature                                                | Difficulty | Workshop Role              |
| ------ | ------------------------------------------------------ | ---------- | -------------------------- |
| [!]    | **Drag to reorder** - Manual ordering with persistence | Mid-Senior | 🔍 Conroy debugs live      |
| [!]    | **Todo count** - "X of Y completed" display            | Junior     | 🛠️ Participants debug + PR |
| [ ]    | **Edit todos** - Click to edit inline                  | Junior-Mid | 🏗️ Build together (live)   |
| [ ]    | **Show/hide completed** - Filter toggle                | Junior-Mid | 📚 Homework                |
| [ ]    | **Search todos** - Filter by text                      | Mid        | 📚 Homework                |

**Legend**:

- `[ ]` = Not yet implemented
- `[x]` = Implemented and working
- `[!]` = Implemented but BROKEN (intentional bug for debugging practice)

---

## Workshop Agenda

### 🧭 Orientation (12:00-12:20)

- [ ] Explore the codebase with AI
- [ ] Understand what's working vs broken
- [ ] Review the constitution and coding standards

### 🔍 Live Debug Demo (12:20-12:45)

- [ ] Conroy debugs "drag to reorder" bug live
- [ ] Think-aloud: How to reason about the problem
- [ ] The bug: Optimistic UI works, but changes don't persist (refresh shows old order)
- [ ] Lesson: "Always verify persistence"—check network tab, server logs, DB state

### 🛠️ Hands-On Debugging (12:45-1:30)

- [ ] Participants fix "todo count" bug
- [ ] The bug: Count shows correctly on load, but doesn't update after add/remove
- [ ] Create a branch, make the fix, open a PR
- [ ] Use AI to help, but verify everything

### 🏗️ Build Together (1:30-1:50)

- [ ] `/speckit.specify` the "edit todos" feature together
- [ ] Implement inline editing as a group
- [ ] Demonstrate spec-driven development (no bugs—happy path!)

### 🎓 Debrief (1:50-2:00)

- [ ] What did we learn?
- [ ] Introduce homework features (show/hide, search)
- [ ] How to submit PRs for review

---

## Post-Workshop (2:00-4:00pm or async)

For those who want to keep going:

1. Pick one of the homework features:
   - **Show/hide completed** - Add a toggle to filter the todo list
   - **Search todos** - Add a search input to filter by text
2. Write a spec using `/speckit.specify`
3. Implement it
4. Open a PR for feedback

I'll review all PRs and provide feedback!

---

## Quick Reference

**Start the dev server**:

```bash
npm run dev
```

**Database commands**:

```bash
npm run db:studio    # Open Drizzle Studio
npm run db:migrate   # Run migrations
```

**Linting**:

```bash
npm run lint
```

**Key files**:

- `app/actions.ts` - Server Actions (data mutations)
- `app/todo.tsx` - Todo component (client)
- `app/todo-list.tsx` - Todo list with optimistic UI
- `db/schema.ts` - Database schema
