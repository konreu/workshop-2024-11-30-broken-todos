# Configuration Files Contract

**Feature**: 002-testing-infrastructure  
**Date**: 2025-11-30

## Overview

Defines the configuration files that must be created for Jest and Playwright.

---

## Jest Configuration (`jest.config.ts`)

```typescript
import type { Config } from 'jest'
import nextJest from 'next/jest'

const createJestConfig = nextJest({
  // Path to Next.js app for loading next.config.ts and .env files
  dir: './',
})

const customConfig: Config = {
  // Test environment
  testEnvironment: 'jsdom',
  
  // Setup files to run after jest is initialized
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  
  // Module path aliases (matches tsconfig.json)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  
  // Test file patterns
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}'],
  
  // Coverage configuration
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'db/**/*.ts',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  
  // Clear mocks between tests
  clearMocks: true,
}

export default createJestConfig(customConfig)
```

---

## Jest Setup (`jest.setup.ts`)

```typescript
// Import jest-dom matchers
import '@testing-library/jest-dom'

// Import jest-axe matchers
import { toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

// Mock next/cache (for revalidatePath)
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}))

// Mock next/navigation (for useRouter, etc.)
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/',
}))
```

---

## Playwright Configuration (`playwright.config.ts`)

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  // Test directory
  testDir: './e2e',
  
  // Test file pattern
  testMatch: '**/*.spec.ts',
  
  // Run tests in parallel
  fullyParallel: true,
  
  // Fail the build on CI if test.only is left in source
  forbidOnly: !!process.env.CI,
  
  // No retries - flaky tests should be fixed
  retries: 0,
  
  // Number of workers
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter configuration
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],
  
  // Shared settings for all projects
  use: {
    // Base URL for navigation
    baseURL: 'http://localhost:3000',
    
    // Collect trace on failure
    trace: 'on-first-retry',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
  },
  
  // Configure projects - Chromium only per spec
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  
  // Web server configuration - auto-start dev server
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutes for server startup
  },
})
```

---

## TypeScript Configuration Updates

No changes required to `tsconfig.json`. Jest uses `next/jest` which handles TypeScript transformation via SWC.

For test-specific types, Jest's `@types/jest` provides global type definitions.

---

## ESLint Configuration Updates

Add Jest and Playwright globals to ESLint config if needed:

```javascript
// eslint.config.mjs (if Jest globals cause issues)
import jest from 'eslint-plugin-jest'

export default [
  // ...existing config
  {
    files: ['**/__tests__/**/*.{ts,tsx}', 'e2e/**/*.ts'],
    plugins: { jest },
    languageOptions: {
      globals: {
        jest: 'readonly',
        describe: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
    },
  },
]
```

---

## .gitignore Updates

Add test artifacts to `.gitignore`:

```gitignore
# Test artifacts
coverage/
playwright-report/
test-results/
```
