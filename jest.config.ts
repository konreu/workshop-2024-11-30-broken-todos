/**
 * Jest Configuration for Next.js 15 App Router
 *
 * This configuration uses the next/jest preset which handles:
 * - SWC transformation for TypeScript
 * - Path aliases from tsconfig.json
 * - Next.js-specific setup (Server Components, etc.)
 *
 * @see https://nextjs.org/docs/app/building-your-application/testing/jest
 */
import type { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({
  // Path to Next.js app for loading next.config.ts and .env files
  dir: "./",
});

const customConfig: Config = {
  // Use jsdom environment for testing React components in a browser-like environment
  testEnvironment: "jsdom",

  // Setup files to run after Jest is initialized (matchers, mocks)
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  // Module path aliases - matches tsconfig.json paths
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },

  // Test file patterns - only look in __tests__ directories
  testMatch: ["**/__tests__/**/*.test.{ts,tsx}"],

  // Coverage configuration - which files to include in coverage reports
  collectCoverageFrom: ["app/**/*.{ts,tsx}", "db/**/*.ts", "!**/*.d.ts", "!**/node_modules/**"],

  // Clear mocks between tests for isolation
  clearMocks: true,
};

export default createJestConfig(customConfig);
