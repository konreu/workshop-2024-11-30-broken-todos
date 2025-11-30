# AGENTS.md

## Context

This is a learning environment. The human you're working with may be new to
programming. Prioritize clarity over cleverness.

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

| Test Type     | Use For                              | Speed  | Command           |
| ------------- | ------------------------------------ | ------ | ----------------- |
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
