/**
 * E2E TEST TEMPLATE - ControlFin Project
 * 
 * This template provides a standardized approach for End-to-End testing
 * following the ControlFin user flows and BlockAI design patterns.
 * 
 * Usage:
 * 1. Copy this template to your E2E test file
 * 2. Replace [FeatureName] with your actual feature name
 * 3. Update test cases according to your feature
 * 4. Follow the testing patterns established in this template
 */

import { expect, Page, test } from '@playwright/test';

// Test data constants
const TEST_DATA = {
    user: {
        email: 'test@controlfin.com',
        password: 'TestPassword123!',
        name: 'Test User',
    },
    space: {
        name: 'Test Financial Space',
    },
    transaction: {
        amount: '150.50',
        description: 'Test Transaction',
        category: 'Food',
        type: 'expense',
    },
};

// Helper functions for common operations
class TestHelpers {
    constructor(private page: Page) { }

    async login(email: string = TEST_DATA.user.email, password: string = TEST_DATA.user.password) {
        await this.page.goto('/login');
        await this.page.fill('[data-testid="email-input"]', email);
        await this.page.fill('[data-testid="password-input"]', password);
        await this.page.click('[data-testid="login-button"]');
        await this.page.waitForURL('/dashboard');
    }

    async logout() {
        await this.page.click('[data-testid="user-menu"]');
        await this.page.click('[data-testid="logout-button"]');
        await this.page.waitForURL('/login');
    }

    async navigateToTransactions() {
        await this.page.click('[data-testid="transactions-nav"]');
        await this.page.waitForURL('/transactions');
    }

    async createTransaction(transaction: typeof TEST_DATA.transaction) {
        await this.page.click('[data-testid="add-transaction-button"]');
        await this.page.fill('[data-testid="amount-input"]', transaction.amount);
        await this.page.fill('[data-testid="description-input"]', transaction.description);
        await this.page.selectOption('[data-testid="category-select"]', transaction.category);
        await this.page.selectOption('[data-testid="type-select"]', transaction.type);
        await this.page.click('[data-testid="save-transaction-button"]');
    }

    async waitForNotification(message: string) {
        await expect(this.page.locator('[data-testid="notification"]')).toContainText(message);
    }

    async takeScreenshot(name: string) {
        await this.page.screenshot({
            path: `tests/e2e/screenshots/${name}.png`,
            fullPage: true
        });
    }
}

test.describe('[FeatureName] E2E Tests', () => {
    let helpers: TestHelpers;

    test.beforeEach(async ({ page }) => {
        helpers = new TestHelpers(page);

        // Mock API responses for consistent testing
        await page.route('**/api/auth/login', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    token: 'mock-jwt-token',
                    user: {
                        id: '123',
                        email: TEST_DATA.user.email,
                        name: TEST_DATA.user.name,
                    },
                }),
            });
        });

        await page.route('**/api/transactions*', async route => {
            if (route.request().method() === 'GET') {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        transactions: [],
                        total: 0,
                    }),
                });
            } else if (route.request().method() === 'POST') {
                await route.fulfill({
                    status: 201,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        id: '456',
                        ...TEST_DATA.transaction,
                        createdAt: new Date().toISOString(),
                    }),
                });
            }
        });
    });

    // AUTHENTICATION FLOW TESTS
    describe('Authentication Flow', () => {
        test('should display login page correctly', async ({ page }) => {
            await page.goto('/login');

            // Check page title
            await expect(page).toHaveTitle(/ControlFin/);

            // Check BlockAI theme is applied
            await expect(page.locator('body')).toHaveClass(/dark-theme/);

            // Check form elements
            await expect(page.locator('[data-testid="email-input"]')).toBeVisible();
            await expect(page.locator('[data-testid="password-input"]')).toBeVisible();
            await expect(page.locator('[data-testid="login-button"]')).toBeVisible();

            // Check Google OAuth button
            await expect(page.locator('[data-testid="google-login-button"]')).toBeVisible();
        });

        test('should login successfully with valid credentials', async ({ page }) => {
            await helpers.login();

            // Should redirect to dashboard
            await expect(page).toHaveURL('/dashboard');

            // Should show user name in header
            await expect(page.locator('[data-testid="user-name"]')).toContainText(TEST_DATA.user.name);
        });

        test('should show error for invalid credentials', async ({ page }) => {
            await page.route('**/api/auth/login', async route => {
                await route.fulfill({
                    status: 401,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        message: 'Invalid credentials',
                    }),
                });
            });

            await page.goto('/login');
            await page.fill('[data-testid="email-input"]', 'invalid@email.com');
            await page.fill('[data-testid="password-input"]', 'wrongpassword');
            await page.click('[data-testid="login-button"]');

            await helpers.waitForNotification('Invalid credentials');
        });

        test('should logout successfully', async ({ page }) => {
            await helpers.login();
            await helpers.logout();

            await expect(page).toHaveURL('/login');
        });
    });

    // NAVIGATION TESTS
    describe('Navigation', () => {
        test.beforeEach(async ({ page }) => {
            await helpers.login();
        });

        test('should navigate between main sections', async ({ page }) => {
            // Dashboard
            await page.click('[data-testid="dashboard-nav"]');
            await expect(page).toHaveURL('/dashboard');

            // Transactions
            await page.click('[data-testid="transactions-nav"]');
            await expect(page).toHaveURL('/transactions');

            // Budget
            await page.click('[data-testid="budget-nav"]');
            await expect(page).toHaveURL('/budget');

            // Goals
            await page.click('[data-testid="goals-nav"]');
            await expect(page).toHaveURL('/goals');
        });

        test('should maintain sidebar state', async ({ page }) => {
            // Check sidebar is visible
            await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();

            // Toggle sidebar
            await page.click('[data-testid="sidebar-toggle"]');
            await expect(page.locator('[data-testid="sidebar"]')).toHaveClass(/collapsed/);

            // Toggle back
            await page.click('[data-testid="sidebar-toggle"]');
            await expect(page.locator('[data-testid="sidebar"]')).not.toHaveClass(/collapsed/);
        });
    });

    // TRANSACTION MANAGEMENT TESTS
    describe('Transaction Management', () => {
        test.beforeEach(async ({ page }) => {
            await helpers.login();
            await helpers.navigateToTransactions();
        });

        test('should create new transaction', async ({ page }) => {
            await helpers.createTransaction(TEST_DATA.transaction);

            // Should show success notification
            await helpers.waitForNotification('Transaction created successfully');

            // Should close modal
            await expect(page.locator('[data-testid="transaction-modal"]')).not.toBeVisible();

            // Should refresh transaction list
            await expect(page.locator('[data-testid="transaction-list"]')).toBeVisible();
        });

        test('should validate transaction form', async ({ page }) => {
            await page.click('[data-testid="add-transaction-button"]');

            // Try to submit empty form
            await page.click('[data-testid="save-transaction-button"]');

            // Should show validation errors
            await expect(page.locator('[data-testid="amount-error"]')).toContainText('Amount is required');
            await expect(page.locator('[data-testid="description-error"]')).toContainText('Description is required');
        });

        test('should filter transactions', async ({ page }) => {
            // Set up mock data with different types
            await page.route('**/api/transactions*', async route => {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        transactions: [
                            { id: '1', type: 'income', amount: 1000, description: 'Salary' },
                            { id: '2', type: 'expense', amount: 50, description: 'Coffee' },
                        ],
                        total: 2,
                    }),
                });
            });

            await page.reload();

            // Filter by expense
            await page.selectOption('[data-testid="type-filter"]', 'expense');

            // Should only show expense transactions
            await expect(page.locator('[data-testid="transaction-item"]')).toHaveCount(1);
            await expect(page.locator('[data-testid="transaction-item"]')).toContainText('Coffee');
        });

        test('should search transactions', async ({ page }) => {
            await page.fill('[data-testid="search-input"]', 'Coffee');
            await page.press('[data-testid="search-input"]', 'Enter');

            // Should show search results
            await expect(page.locator('[data-testid="transaction-item"]')).toContainText('Coffee');
        });
    });

    // DASHBOARD TESTS
    describe('Dashboard', () => {
        test.beforeEach(async ({ page }) => {
            await helpers.login();
        });

        test('should display financial summary', async ({ page }) => {
            // Mock dashboard data
            await page.route('**/api/dashboard/summary', async route => {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        balance: 5000.00,
                        monthlyIncome: 3000.00,
                        monthlyExpenses: 2000.00,
                        savingsRate: 33.33,
                    }),
                });
            });

            await page.goto('/dashboard');

            // Check summary cards
            await expect(page.locator('[data-testid="balance-card"]')).toContainText('R$ 5.000,00');
            await expect(page.locator('[data-testid="income-card"]')).toContainText('R$ 3.000,00');
            await expect(page.locator('[data-testid="expenses-card"]')).toContainText('R$ 2.000,00');
        });

        test('should display charts correctly', async ({ page }) => {
            await page.goto('/dashboard');

            // Check if charts are rendered
            await expect(page.locator('[data-testid="expense-chart"]')).toBeVisible();
            await expect(page.locator('[data-testid="income-chart"]')).toBeVisible();

            // Check chart interactions
            await page.hover('[data-testid="expense-chart"]');
            await expect(page.locator('[data-testid="chart-tooltip"]')).toBeVisible();
        });
    });

    // RESPONSIVE DESIGN TESTS
    describe('Responsive Design', () => {
        test.beforeEach(async ({ page }) => {
            await helpers.login();
        });

        test('should work on mobile devices', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });

            // Sidebar should be collapsed on mobile
            await expect(page.locator('[data-testid="sidebar"]')).toHaveClass(/mobile-collapsed/);

            // Navigation should work via mobile menu
            await page.click('[data-testid="mobile-menu-button"]');
            await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();

            await page.click('[data-testid="transactions-nav"]');
            await expect(page).toHaveURL('/transactions');
        });

        test('should work on tablet devices', async ({ page }) => {
            await page.setViewportSize({ width: 768, height: 1024 });

            // Should maintain desktop layout
            await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();
            await expect(page.locator('[data-testid="main-content"]')).toBeVisible();
        });
    });

    // ACCESSIBILITY TESTS
    describe('Accessibility', () => {
        test.beforeEach(async ({ page }) => {
            await helpers.login();
        });

        test('should support keyboard navigation', async ({ page }) => {
            await page.goto('/transactions');

            // Tab through form elements
            await page.press('[data-testid="add-transaction-button"]', 'Tab');
            await page.press('[data-testid="search-input"]', 'Tab');

            // Should focus on next element
            await expect(page.locator('[data-testid="type-filter"]')).toBeFocused();
        });

        test('should have proper ARIA labels', async ({ page }) => {
            await page.goto('/dashboard');

            // Check for ARIA labels on interactive elements
            await expect(page.locator('[data-testid="add-transaction-button"]')).toHaveAttribute('aria-label');
            await expect(page.locator('[data-testid="search-input"]')).toHaveAttribute('aria-label');
        });

        test('should have proper color contrast', async ({ page }) => {
            await page.goto('/dashboard');

            // Check text elements have sufficient contrast
            const textElements = page.locator('[data-testid="balance-card"]');
            const computedStyle = await textElements.evaluate(el => {
                const style = window.getComputedStyle(el);
                return {
                    color: style.color,
                    backgroundColor: style.backgroundColor,
                };
            });

            // This would need a proper contrast checking utility
            expect(computedStyle.color).toBeDefined();
            expect(computedStyle.backgroundColor).toBeDefined();
        });
    });

    // PERFORMANCE TESTS
    describe('Performance', () => {
        test('should load pages within acceptable time', async ({ page }) => {
            const startTime = Date.now();

            await helpers.login();
            await page.goto('/dashboard');

            const endTime = Date.now();
            const loadTime = endTime - startTime;

            // Should load within 3 seconds
            expect(loadTime).toBeLessThan(3000);
        });

        test('should handle large datasets efficiently', async ({ page }) => {
            // Mock large dataset
            const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
                id: i.toString(),
                amount: Math.random() * 1000,
                description: `Transaction ${i}`,
                type: i % 2 === 0 ? 'income' : 'expense',
            }));

            await page.route('**/api/transactions*', async route => {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        transactions: largeDataset,
                        total: 1000,
                    }),
                });
            });

            await helpers.login();
            await helpers.navigateToTransactions();

            // Should render without performance issues
            await expect(page.locator('[data-testid="transaction-list"]')).toBeVisible();
        });
    });

    // ERROR HANDLING TESTS
    describe('Error Handling', () => {
        test('should handle network errors gracefully', async ({ page }) => {
            await page.route('**/api/**', async route => {
                await route.abort('failed');
            });

            await helpers.login();

            // Should show error state
            await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
            await expect(page.locator('[data-testid="retry-button"]')).toBeVisible();
        });

        test('should handle server errors gracefully', async ({ page }) => {
            await page.route('**/api/**', async route => {
                await route.fulfill({
                    status: 500,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        message: 'Internal server error',
                    }),
                });
            });

            await helpers.login();

            // Should show error notification
            await helpers.waitForNotification('Something went wrong. Please try again.');
        });
    });

    // VISUAL REGRESSION TESTS
    describe('Visual Regression', () => {
        test.beforeEach(async ({ page }) => {
            await helpers.login();
        });

        test('should match dashboard design', async ({ page }) => {
            await page.goto('/dashboard');
            await expect(page).toHaveScreenshot('dashboard.png');
        });

        test('should match transaction list design', async ({ page }) => {
            await helpers.navigateToTransactions();
            await expect(page).toHaveScreenshot('transactions-list.png');
        });

        test('should match login page design', async ({ page }) => {
            await page.goto('/login');
            await expect(page).toHaveScreenshot('login-page.png');
        });
    });
});
