/**
 * TEST CONFIGURATION - ControlFin Project
 * 
 * This file provides standardized test configurations for Vitest and Playwright
 * following the ControlFin testing patterns and BlockAI theme requirements.
 */

import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

// Vitest Configuration
export const vitestConfig = defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./tests/setup.ts'],

        // Run all tests even if some fail
        bail: 0,

        // Continue on errors
        passWithNoTests: true,

        // Enable parallel execution for 4x speed improvement
        pool: 'threads',
        poolOptions: {
            threads: {
                singleThread: false,
                minThreads: 1,
                maxThreads: 4,
            },
        },

        // Test timeout
        testTimeout: 10000,

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
                'coverage/',
                'src/test-setup.ts',
                'src/main.tsx',
                'src/vite-env.d.ts',
            ],
            thresholds: {
                global: {
                    branches: 70,
                    functions: 70,
                    lines: 70,
                    statements: 70,
                },
            },
        },

        // Test file patterns
        include: [
            'src/**/*.{test,spec}.{js,ts,jsx,tsx}',
            'tests/unit/**/*.{test,spec}.{js,ts,jsx,tsx}',
        ],

        // Exclude patterns
        exclude: [
            'node_modules/',
            'dist/',
            'coverage/',
            'tests/e2e/',
        ],
    },

    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
            '@/components': resolve(__dirname, './src/components'),
            '@/services': resolve(__dirname, './src/services'),
            '@/store': resolve(__dirname, './src/store'),
            '@/utils': resolve(__dirname, './src/utils'),
            '@/types': resolve(__dirname, './src/types'),
            '@/styles': resolve(__dirname, './src/styles'),
            '@/assets': resolve(__dirname, './src/assets'),
        },
    },
});

// Playwright Configuration
export const playwrightConfig = {
    testDir: './tests/e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [
        ['html'],
        ['json', { outputFile: 'test-results/results.json' }],
        ['junit', { outputFile: 'test-results/results.xml' }],
    ],

    use: {
        baseURL: 'http://localhost:3000',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
        {
            name: 'Mobile Chrome',
            use: { ...devices['Pixel 5'] },
        },
        {
            name: 'Mobile Safari',
            use: { ...devices['iPhone 12'] },
        },
    ],

    webServer: {
        command: 'npm run dev:frontend',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
    },

    globalSetup: require.resolve('./tests/e2e/global-setup.ts'),
    globalTeardown: require.resolve('./tests/e2e/global-teardown.ts'),
};

// Test Setup Configuration
export const testSetupConfig = {
    // Mock window.matchMedia
    matchMedia: () => ({
        matches: false,
        addListener: () => { },
        removeListener: () => { },
    }),

    // Mock IntersectionObserver
    IntersectionObserver: class IntersectionObserver {
        constructor() { }
        observe() { }
        disconnect() { }
        unobserve() { }
    },

    // Mock ResizeObserver
    ResizeObserver: class ResizeObserver {
        constructor() { }
        observe() { }
        disconnect() { }
        unobserve() { }
    },

    // Mock localStorage
    localStorage: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
    },

    // Mock sessionStorage
    sessionStorage: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
    },

    // Mock fetch
    fetch: vi.fn(),

    // Mock console methods
    console: {
        log: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
    },
};

// ESLint Configuration for Tests
export const testESLintConfig = {
    env: {
        'vitest-globals/env': true,
    },
    extends: [
        'plugin:vitest-globals/recommended',
        'plugin:testing-library/react',
        'plugin:jest-dom/recommended',
    ],
    rules: {
        // Allow test files to use any
        '@typescript-eslint/no-explicit-any': 'off',

        // Allow unused variables in tests
        '@typescript-eslint/no-unused-vars': 'off',

        // Allow console in tests
        'no-console': 'off',

        // Allow empty functions in tests
        '@typescript-eslint/no-empty-function': 'off',

        // Allow non-null assertions in tests
        '@typescript-eslint/no-non-null-assertion': 'off',
    },
};

// Jest DOM Matchers Configuration
export const jestDomConfig = {
    // Custom matchers for BlockAI theme testing
    customMatchers: {
        toHaveBlockAIColors: (element: HTMLElement) => {
            const computedStyle = window.getComputedStyle(element);
            const hasBlockAIBackground =
                computedStyle.backgroundColor.includes('54, 61, 101') ||
                computedStyle.backgroundColor.includes('45, 52, 112') ||
                computedStyle.backgroundColor.includes('31, 35, 71');

            return {
                pass: hasBlockAIBackground,
                message: () => `Expected element to have BlockAI colors`,
            };
        },

        toHaveBlockAITypography: (element: HTMLElement) => {
            const computedStyle = window.getComputedStyle(element);
            const hasInterFont = computedStyle.fontFamily.includes('Inter');
            const hasBlockAITextColor =
                computedStyle.color.includes('255, 255, 255') ||
                computedStyle.color.includes('160, 164, 184');

            return {
                pass: hasInterFont && hasBlockAITextColor,
                message: () => `Expected element to have BlockAI typography`,
            };
        },
    },
};

// Test Environment Variables
export const testEnvVars = {
    NODE_ENV: 'test',
    VITE_API_BASE_URL: 'http://localhost:3000/api',
    VITE_GOOGLE_CLIENT_ID: 'test-google-client-id',
    VITE_APP_NAME: 'ControlFin Test',
    VITE_APP_VERSION: '1.0.0-test',
};

// Mock Data Configuration
export const mockDataConfig = {
    // Default test user
    defaultUser: {
        id: 'test-user-123',
        email: 'test@controlfin.com',
        name: 'Test User',
        avatar: null,
    },

    // Default test space
    defaultSpace: {
        id: 'test-space-456',
        name: 'Test Financial Space',
        members: [
            {
                userId: 'test-user-123',
                role: 'owner',
                joinedAt: new Date().toISOString(),
            },
        ],
    },

    // Default test transaction
    defaultTransaction: {
        id: 'test-transaction-789',
        spaceId: 'test-space-456',
        userId: 'test-user-123',
        type: 'expense',
        amount: 15050, // R$ 150.50 in cents
        categoryId: 'test-category-1',
        description: 'Test Transaction',
        date: new Date().toISOString(),
        paymentMethod: 'credit_card',
        status: 'completed',
    },

    // Default test categories
    defaultCategories: [
        {
            id: 'test-category-1',
            name: 'Food',
            icon: 'ShoppingCartOutlined',
            color: '#00d9ff',
            type: 'expense',
            isDefault: true,
        },
        {
            id: 'test-category-2',
            name: 'Transport',
            icon: 'CarOutlined',
            color: '#2196f3',
            type: 'expense',
            isDefault: true,
        },
        {
            id: 'test-category-3',
            name: 'Salary',
            icon: 'DollarCircleOutlined',
            color: '#00ff88',
            type: 'income',
            isDefault: true,
        },
    ],
};

// Test Performance Configuration
export const performanceConfig = {
    // Maximum render time for components (in milliseconds)
    maxRenderTime: 100,

    // Maximum API response time (in milliseconds)
    maxApiResponseTime: 300,

    // Maximum page load time (in milliseconds)
    maxPageLoadTime: 3000,

    // Memory usage thresholds (in MB)
    maxMemoryUsage: 100,

    // Bundle size thresholds (in KB)
    maxBundleSize: 500,
};

// Test Accessibility Configuration
export const accessibilityConfig = {
    // Required ARIA attributes
    requiredAriaAttributes: ['role', 'aria-label'],

    // Color contrast ratios
    minContrastRatio: 4.5,
    minLargeTextContrastRatio: 3.0,

    // Keyboard navigation
    requiredKeyboardSupport: ['Tab', 'Enter', 'Escape', 'ArrowKeys'],

    // Focus management
    requireFocusManagement: true,
    requireFocusIndicators: true,
};

// Test Coverage Configuration
export const coverageConfig = {
    // Minimum coverage thresholds
    thresholds: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70,
        },
        // Higher thresholds for critical modules
        critical: {
            branches: 85,
            functions: 85,
            lines: 85,
            statements: 85,
        },
    },

    // Critical modules that require higher coverage
    criticalModules: [
        'src/services/auth.service.ts',
        'src/services/transaction.service.ts',
        'src/store/authStore.ts',
        'src/store/transactionStore.ts',
        'src/utils/formatters.ts',
        'src/utils/validators.ts',
    ],

    // Excluded files from coverage
    excludedFiles: [
        'src/main.tsx',
        'src/vite-env.d.ts',
        'src/test-setup.ts',
        '**/*.d.ts',
        '**/*.config.*',
        '**/node_modules/**',
    ],
};

// Export all configurations
export default {
    vitestConfig,
    playwrightConfig,
    testSetupConfig,
    testESLintConfig,
    jestDomConfig,
    testEnvVars,
    mockDataConfig,
    performanceConfig,
    accessibilityConfig,
    coverageConfig,
};
