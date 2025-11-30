/**
 * Mock Database Module for Unit Tests
 *
 * This mock intercepts all Drizzle ORM database operations so unit tests
 * can run without hitting the real Turso database.
 *
 * Why mock the database?
 * - Unit tests should be fast and isolated
 * - We don't want to modify real data during tests
 * - We can verify the exact operations being performed
 *
 * Usage in tests:
 * ```typescript
 * import { mockInsert, mockSelect } from '@/db';
 * jest.mock('@/db');
 *
 * test('addTodo inserts into database', async () => {
 *   await addTodo(formData);
 *   expect(mockInsert).toHaveBeenCalled();
 * });
 * ```
 *
 * @see contracts/test-api.md for full API documentation
 */

// Track mock function calls for assertions
// These are exported so tests can verify database operations

/**
 * Mock for db.insert(table).values(data)
 * Returns a chainable object with .values() method
 */
export const mockInsert = jest.fn().mockReturnValue({
  values: jest.fn().mockResolvedValue(undefined),
});

/**
 * Mock for db.select().from(table)
 * Returns a chainable object with .from() method
 * Default: returns empty array (no todos)
 */
export const mockSelect = jest.fn().mockReturnValue({
  from: jest.fn().mockResolvedValue([]),
});

/**
 * Mock for db.update(table).set(data).where(condition)
 * Returns a chainable object with .set() and .where() methods
 */
export const mockUpdate = jest.fn().mockReturnValue({
  set: jest.fn().mockReturnValue({
    where: jest.fn().mockResolvedValue(undefined),
  }),
});

/**
 * Mock for db.delete(table).where(condition)
 * Returns a chainable object with .where() method
 */
export const mockDelete = jest.fn().mockReturnValue({
  where: jest.fn().mockResolvedValue(undefined),
});

/**
 * Mock db object that matches the shape of the real Drizzle db client
 * When tests import { db } from '@/db', they get this mock instead
 */
export const db = {
  insert: mockInsert,
  select: mockSelect,
  update: mockUpdate,
  delete: mockDelete,
};

/**
 * Helper function to reset all mocks between tests
 * Call this in beforeEach() to ensure test isolation
 */
export function resetMocks(): void {
  mockInsert.mockClear();
  mockSelect.mockClear();
  mockUpdate.mockClear();
  mockDelete.mockClear();

  // Reset the return values to defaults
  mockInsert.mockReturnValue({
    values: jest.fn().mockResolvedValue(undefined),
  });
  mockSelect.mockReturnValue({
    from: jest.fn().mockResolvedValue([]),
  });
  mockUpdate.mockReturnValue({
    set: jest.fn().mockReturnValue({
      where: jest.fn().mockResolvedValue(undefined),
    }),
  });
  mockDelete.mockReturnValue({
    where: jest.fn().mockResolvedValue(undefined),
  });
}
