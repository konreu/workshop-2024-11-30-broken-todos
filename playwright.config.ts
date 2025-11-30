/**
 * Playwright Configuration for E2E Tests
 *
 * This configuration:
 * - Auto-starts the Next.js dev server before tests
 * - Uses only Chromium (as specified in requirements)
 * - Has 0 retries (flaky tests should be fixed, not retried)
 * - Collects traces and screenshots on failure for debugging
 *
 * @see https://playwright.dev/docs/test-configuration
 */
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  // Test directory - all E2E tests live here
  testDir: "./e2e",

  // Test file pattern
  testMatch: "**/*.spec.ts",

  // Run tests in parallel for speed
  fullyParallel: true,

  // Fail the build on CI if test.only is left in source
  // (prevents accidentally committing focused tests)
  forbidOnly: !!process.env.CI,

  // No retries - flaky tests should be fixed, not masked
  retries: 0,

  // Number of workers - 1 in CI for consistency, auto in dev
  workers: process.env.CI ? 1 : undefined,

  // Reporter configuration - HTML report + console list
  reporter: [["html", { open: "never" }], ["list"]],

  // Shared settings for all projects
  use: {
    // Base URL for navigation (page.goto('/') goes to localhost:3000)
    baseURL: "http://localhost:3000",

    // Collect trace on first retry for debugging
    trace: "on-first-retry",

    // Screenshot on failure for debugging
    screenshot: "only-on-failure",
  },

  // Configure browser projects - Chromium only per spec
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // Web server configuration - auto-start Next.js dev server
  // This means you don't need to manually run 'npm run dev' before tests
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    // In CI, always start fresh; in dev, reuse existing server if running
    reuseExistingServer: !process.env.CI,
    // 2 minutes timeout for server startup (Turbopack is fast but give margin)
    timeout: 120 * 1000,
  },
});
