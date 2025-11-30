# NPM Scripts Contract

**Feature**: 002-testing-infrastructure  
**Date**: 2025-11-30

## Overview

Defines the npm scripts that must be available after implementation.

## Scripts

### `test`

**Command**: `npm run test`  
**Description**: Run all test suites (unit + e2e)  
**Behavior**: Executes `npm run test:unit && npm run test:e2e` sequentially  
**Exit Code**: 0 if all tests pass, non-zero if any fail

### `test:unit`

**Command**: `npm run test:unit`  
**Description**: Run Jest unit and component tests  
**Behavior**: Executes `jest` on all `*.test.{ts,tsx}` files in `__tests__/` directories  
**Exit Code**: 0 if all tests pass, non-zero if any fail

### `test:e2e`

**Command**: `npm run test:e2e`  
**Description**: Run Playwright end-to-end tests  
**Behavior**:

1. Auto-starts Next.js dev server via `webServer` config
2. Executes all `*.spec.ts` files in `e2e/` directory
3. Shuts down dev server after tests complete  
   **Exit Code**: 0 if all tests pass, non-zero if any fail

### `test:watch`

**Command**: `npm run test:watch`  
**Description**: Run Jest in watch mode for TDD workflow  
**Behavior**: Executes `jest --watch`, re-running tests on file changes  
**Exit Code**: Interactive mode, no exit

### `test:coverage`

**Command**: `npm run test:coverage`  
**Description**: Run unit tests with coverage reporting  
**Behavior**: Executes `jest --coverage`, generates coverage report  
**Exit Code**: 0 if tests pass, non-zero if any fail  
**Output**: Coverage report in `coverage/` directory

## Package.json Changes

```json
{
  "scripts": {
    "test": "npm run test:unit && npm run test:e2e",
    "test:unit": "jest",
    "test:e2e": "playwright test",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## Dependencies to Add

### devDependencies

```json
{
  "devDependencies": {
    "jest": "^29.7.0",
    "@types/jest": "^29.5.12",
    "jest-environment-jsdom": "^29.7.0",
    "@testing-library/react": "^16.0.1",
    "@testing-library/jest-dom": "^6.4.8",
    "@testing-library/user-event": "^14.5.2",
    "jest-axe": "^9.0.0",
    "@types/jest-axe": "^3.5.9",
    "@playwright/test": "^1.48.0"
  }
}
```
