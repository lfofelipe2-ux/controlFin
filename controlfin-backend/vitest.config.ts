import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/test-env.ts', './tests/setup.ts'],
    testTimeout: 10000,
    hookTimeout: 10000,
    teardownTimeout: 10000,
    // Run all tests even if some fail
    bail: 0,
    // Continue on errors
    passWithNoTests: true,
  },
});
