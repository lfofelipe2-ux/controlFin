import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/test-env.ts'],
    testTimeout: 120000, // 2 minutes for integration tests
    hookTimeout: 120000,
    teardownTimeout: 120000,
    // Run all tests even if some fail
    bail: 0,
    // Continue on errors
    passWithNoTests: true,
    // Run integration tests sequentially
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      }
    },
    // Include only integration tests
    include: ['tests/integration/**/*.test.ts', 'tests/security/**/*.test.ts', 'tests/performance/**/*.test.ts'],
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/',
        'scripts/'
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70
        }
      }
    }
  },
});
