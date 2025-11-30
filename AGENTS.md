# AGENTS.md

## Context

This is a learning environment. The human you're working with may be new to
programming. Prioritize clarity over cleverness.

---

## ⚠️ GIT SAFETY RULES (CRITICAL) ⚠️

**These rules are NON-NEGOTIABLE. Violating them can cause data loss.**

### 🚫 NEVER Force Push

**NEVER run `git push --force` or `git push --force-with-lease`.**

- Always let the Human perform force pushes themselves
- Force pushes rewrite remote history and can wipe out others' work
- If a force push is needed, explain why and let the Human execute it

### 🛡️ Always Create Backup Branches Before Rebasing

Before ANY rebase operation, create a timestamped backup branch:

```bash
# Format: {branch-name}_backup_YYYYMMDD_HHMM
git checkout -b my-feature_backup_20251130_1430
git checkout my-feature
git rebase main
```

This ensures you can always restore from the backup if the rebase goes wrong.

### ✅ Safe Git Operations (AI can do these)

- `git status`, `git log`, `git diff`
- `git add`, `git commit`
- `git push` (regular push, NOT force)
- `git fetch`, `git pull` (when no conflicts expected)
- `git branch`, `git checkout`, `git switch`
- Creating backup branches

### ⛔ Dangerous Git Operations (Human must do these)

- `git push --force` / `git push --force-with-lease`
- `git reset --hard`
- `git clean -fd`
- `git rebase` (AI can do this, but MUST create backup first)
- Deleting remote branches

### 🧪 Pre-Commit Checklist

**ALWAYS run lint and tests before committing.** Never break CI/CD.

```bash
npm run lint && npm run test:unit
```

### 🔧 When Debugging/Fixing Bugs

**Get HITL (Human-in-the-Loop) confirmation before committing.**

Don't just make changes and assume "this probably fixes it" → commit → push.
Instead: make changes → ask Human to verify → if fixed, commit/push.

### 🆕 When Building Net-New Features

**OK to commit incrementally** as you complete each todo step.
QA with Human at the end of the feature, not after every commit.
This keeps progress visible and avoids commits piling up locally.

---

## Working Style

- **Think out loud.** Explain your reasoning before writing code.
- **Commit early and often.** Use small, logical commits with descriptive messages.
- **Never commit broken code.** Run tests and linters before every commit.
- **Ask clarifying questions.** If the task is ambiguous, ask before assuming.

## Code Standards

- Follow existing patterns in the codebase
- Prefer explicit over implicit
- Add comments explaining _why_, not just _what_
- Handle errors gracefully—no silent failures

## When Stuck

- Create a minimal reproduction of the problem
- Bisect: isolate where the issue starts
- Explain what you've tried before asking for help

## Teaching Mode

- When explaining, assume the human is smart but unfamiliar
- Use analogies when helpful
- After fixing something, explain _why_ it was broken and _why_ the fix works

## Test-Driven Development (TDD)

This project uses a test-first approach. Writing tests before implementation helps you:

1. **Think through requirements** before writing code
2. **Catch bugs early** when they're cheapest to fix
3. **Document expected behavior** through executable specifications

### The Red-Green-Refactor Cycle

```
1. RED    → Write a failing test (describes what you want)
2. GREEN  → Write minimal code to make it pass
3. REFACTOR → Clean up while keeping tests green
```

### Running Tests

```bash
# Run all unit & component tests once
npm run test:unit

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run end-to-end tests (auto-starts dev server)
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

### Example: Writing a Failing Test First

```typescript
// 1. RED: Write the test for behavior you want
test("should format date as MM/DD/YYYY", () => {
  const result = formatDate(new Date("2025-11-30"));
  expect(result).toBe("11/30/2025");
});

// 2. GREEN: Implement minimal code to pass
function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US");
}

// 3. REFACTOR: Improve if needed (add edge cases, etc.)
```

### When to Use Each Test Type

| Test Type     | Use For                              | Speed  | Command             |
| ------------- | ------------------------------------ | ------ | ------------------- |
| **Unit**      | Server actions, pure functions       | Fast   | `npm run test:unit` |
| **Component** | React components, user interactions  | Medium | `npm run test:unit` |
| **E2E**       | Full user flows, multi-page journeys | Slow   | `npm run test:e2e`  |

**Rule of thumb**: Test at the lowest level that gives you confidence. Unit tests run faster and pinpoint failures better. E2E tests verify the whole system works together.

### Test File Locations

```
app/__tests__/          # Unit & component tests (Jest + RTL)
  actions.test.ts       # Server action tests
  todo.test.tsx         # Component tests
e2e/                    # End-to-end tests (Playwright)
  todo-flow.spec.ts     # User flow tests
```
