/**
 * Jest Setup File
 *
 * This file runs after Jest is initialized but before tests run.
 * It sets up:
 * - Custom matchers from @testing-library/jest-dom (toBeInTheDocument, etc.)
 * - Accessibility matchers from jest-axe (toHaveNoViolations)
 * - Mocks for Next.js modules that don't work in jsdom
 *
 * @see https://testing-library.com/docs/react-testing-library/setup
 */

// Import jest-dom matchers for DOM assertions
// This adds matchers like toBeInTheDocument(), toHaveTextContent(), etc.
import "@testing-library/jest-dom";

// Import jest-axe matchers for accessibility testing
// This adds the toHaveNoViolations() matcher
import { toHaveNoViolations } from "jest-axe";
expect.extend(toHaveNoViolations);

// Mock next/cache module
// revalidatePath doesn't work outside of Next.js request context,
// so we mock it to verify it's called with correct arguments
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

// Mock next/navigation module
// These hooks don't work in jsdom environment
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => "/",
}));
