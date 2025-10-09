import { expect, test } from '@playwright/test';

test.describe('Transaction Management', () => {
    test.beforeEach(async ({ page }) => {
        // Mock authentication
        await page.route('**/api/auth/me', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    user: { id: '1', email: 'test@example.com' }
                })
            });
        });

        // Mock transactions data
        await page.route('**/api/transactions*', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    transactions: [
                        {
                            id: '1',
                            amount: 100.50,
                            description: 'Test Transaction',
                            type: 'expense',
                            date: '2025-01-01',
                            category: { name: 'Food' }
                        }
                    ],
                    total: 1
                })
            });
        });

        // Navigate to transactions page
        await page.goto('/transactions');
    });

    test('should display transaction list', async ({ page }) => {
        // Check if transaction list is visible
        await expect(page.locator('text=Transactions')).toBeVisible();
        await expect(page.locator('text=Test Transaction')).toBeVisible();
        await expect(page.locator('text=$100.50')).toBeVisible();
    });

    test('should open add transaction modal', async ({ page }) => {
        // Click add transaction button
        await page.click('button:has-text("Add Transaction")');

        // Check if modal is visible
        await expect(page.locator('text=Add Transaction')).toBeVisible();
        await expect(page.locator('input[name="amount"]')).toBeVisible();
        await expect(page.locator('input[name="description"]')).toBeVisible();
    });

    test('should create new transaction', async ({ page }) => {
        // Mock successful transaction creation
        await page.route('**/api/transactions', async route => {
            if (route.request().method() === 'POST') {
                await route.fulfill({
                    status: 201,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        id: '2',
                        amount: 50.00,
                        description: 'New Transaction',
                        type: 'expense'
                    })
                });
            }
        });

        // Open add transaction modal
        await page.click('button:has-text("Add Transaction")');

        // Fill in transaction details
        await page.fill('input[name="amount"]', '50.00');
        await page.fill('input[name="description"]', 'New Transaction');
        await page.selectOption('select[name="type"]', 'expense');

        // Submit form
        await page.click('button[type="submit"]');

        // Check if transaction was added
        await expect(page.locator('text=New Transaction')).toBeVisible();
        await expect(page.locator('text=$50.00')).toBeVisible();
    });

    test('should filter transactions by type', async ({ page }) => {
        // Click filter button
        await page.click('button:has-text("Filter")');

        // Select expense filter
        await page.click('text=Expense');

        // Check if only expense transactions are shown
        await expect(page.locator('text=Test Transaction')).toBeVisible();
    });

    test('should search transactions', async ({ page }) => {
        // Type in search box
        await page.fill('input[placeholder*="Search"]', 'Test');

        // Check if filtered results are shown
        await expect(page.locator('text=Test Transaction')).toBeVisible();
    });
});
