import { expect, test } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the application
        await page.goto('/');
    });

    test('should display login page', async ({ page }) => {
        // Check if login page elements are visible
        await expect(page).toHaveTitle(/ControlFin/);

        // Check for login form elements
        await expect(page.locator('text=Login')).toBeVisible();
        await expect(page.locator('text=Email')).toBeVisible();
        await expect(page.locator('text=Password')).toBeVisible();
    });

    test('should show validation errors for empty form', async ({ page }) => {
        // Try to submit empty form
        await page.click('button[type="submit"]');

        // Check for validation errors
        await expect(page.locator('text=Email is required')).toBeVisible();
        await expect(page.locator('text=Password is required')).toBeVisible();
    });

    test('should show error for invalid credentials', async ({ page }) => {
        // Fill in invalid credentials
        await page.fill('input[type="email"]', 'invalid@example.com');
        await page.fill('input[type="password"]', 'wrongpassword');

        // Submit form
        await page.click('button[type="submit"]');

        // Check for error message
        await expect(page.locator('text=Invalid credentials')).toBeVisible();
    });

    test('should navigate to dashboard after successful login', async ({ page }) => {
        // Mock successful login
        await page.route('**/api/auth/login', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    token: 'mock-token',
                    user: { id: '1', email: 'test@example.com' }
                })
            });
        });

        // Fill in valid credentials
        await page.fill('input[type="email"]', 'test@example.com');
        await page.fill('input[type="password"]', 'password123');

        // Submit form
        await page.click('button[type="submit"]');

        // Check navigation to dashboard
        await expect(page).toHaveURL('/dashboard');
        await expect(page.locator('text=Dashboard')).toBeVisible();
    });
});
