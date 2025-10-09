/**
 * COMPONENT TEST TEMPLATE - ControlFin Project
 * 
 * This template provides a standardized approach for testing React components
 * following the BlockAI design system and ControlFin patterns.
 * 
 * Usage:
 * 1. Copy this template to your component's __tests__ directory
 * 2. Replace [ComponentName] with your actual component name
 * 3. Update imports and test cases according to your component
 * 4. Follow the testing patterns established in this template
 * 
 * KEY LEARNINGS FROM REGISTERFORM TESTING:
 * ======================================
 * 
 * 1. TRANSLATION KEY MANAGEMENT
 *    - Always verify actual translation files (e.g., auth.json) when writing tests
 *    - Use exact keys from translation files, not assumed patterns
 *    - Example: Use 'register.title' not 'auth.register.title'
 * 
 * 2. FORM VALIDATION TESTING
 *    - CSS class checking is more reliable than text content checking
 *    - Use 'ant-form-item-has-error' class instead of specific error messages
 *    - Form validation messages may not appear in DOM during testing
 * 
 * 3. ELEMENT SELECTION BEST PRACTICES
 *    - Use specific selectors (IDs, data attributes) when multiple elements have similar roles
 *    - Example: document.querySelector('form[id="register"]') instead of getByRole('form')
 *    - Use getAllByRole() when multiple elements match the same criteria
 * 
 * 4. FORM SUBMISSION TESTING
 *    - Always include ALL required fields in form submission tests
 *    - Use strong passwords that meet validation requirements
 *    - Ensure proper form validation before testing submission
 * 
 * 5. COMPONENT BEHAVIOR TESTING
 *    - Test actual component behavior rather than assumptions
 *    - Example: Only submit button disabled during loading, not form inputs
 *    - Verify loading state button text changes (e.g., 'loadingregister.registering')
 * 
 * 6. MOCK MANAGEMENT
 *    - Always clear mocks in beforeEach to avoid test interference
 *    - Mock external dependencies consistently across all tests
 *    - Use vi.mocked() for TypeScript-safe mock assertions
 * 
 * 7. ASYNC TESTING
 *    - Use waitFor() for asynchronous operations
 *    - Be patient with form validation and submission timing
 *    - Consider using longer timeouts for complex interactions
 * 
 * 8. ACCESSIBILITY TESTING
 *    - Test ARIA attributes and labels properly
 *    - Verify keyboard navigation works correctly
 *    - Check for proper form field associations
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ConfigProvider } from 'antd';
import { [ComponentName] } from '../[ComponentName]';

// Mock react-i18next for consistent translation testing
// IMPORTANT: Always verify actual translation keys from translation files
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key, // Returns the key itself for testing
        i18n: {
            changeLanguage: vi.fn(),
        },
    }),
}));

// TRANSLATION TESTING HELPER
// Use this helper to test actual translation keys
const testTranslationKey = (key: string, expectedText: string) => {
    // This would be used with a real translation setup
    // For now, we test that the key is used correctly
    expect(screen.getByText(key)).toBeInTheDocument();
};

// Mock any external dependencies
vi.mock('@/services/api', () => ({
    apiService: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

// Test wrapper with Ant Design theme
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <ConfigProvider
        theme={{
            token: {
                colorPrimary: '#00d9ff',
                colorBgContainer: '#363d65',
                colorText: '#ffffff',
                colorTextSecondary: '#a0a4b8',
            },
        }}
    >
        {children}
    </ConfigProvider>
);

// Helper function to render component with theme
const renderWithTheme = (component: React.ReactElement) => {
    return render(component, { wrapper: TestWrapper });
};

describe('[ComponentName] Component', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        vi.clearAllMocks();
    });

    // BASIC RENDERING TESTS
    describe('Basic Rendering', () => {
        it('should render with default props', () => {
            renderWithTheme(< [ComponentName] />);

            // Test that component renders without crashing
            expect(screen.getByTestId('[component-name]')).toBeInTheDocument();
        });

        it('should render with custom props', () => {
            const customProps = {
                title: 'Test Title',
                description: 'Test Description',
            };

            renderWithTheme(< [ComponentName] { ...customProps } />);

            expect(screen.getByText('Test Title')).toBeInTheDocument();
            expect(screen.getByText('Test Description')).toBeInTheDocument();
        });

        it('should apply custom className', () => {
            renderWithTheme(< [ComponentName] className = "custom-class" />);

            const component = screen.getByTestId('[component-name]');
            expect(component).toHaveClass('custom-class');
        });

        it('should apply custom style', () => {
            const customStyle = { backgroundColor: '#00d9ff' };
            renderWithTheme(< [ComponentName] style = { customStyle } />);

            const component = screen.getByTestId('[component-name]');
            expect(component).toHaveStyle('background-color: rgb(0, 217, 255)');
        });
    });

    // INTERACTION TESTS
    describe('User Interactions', () => {
        it('should handle click events', () => {
            const handleClick = vi.fn();
            renderWithTheme(< [ComponentName] onClick = { handleClick } />);

            const clickableElement = screen.getByRole('button');
            fireEvent.click(clickableElement);

            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it('should handle form input changes', () => {
            const handleChange = vi.fn();
            renderWithTheme(< [ComponentName] onChange = { handleChange } />);

            const input = screen.getByRole('textbox');
            fireEvent.change(input, { target: { value: 'test value' } });

            expect(handleChange).toHaveBeenCalledWith('test value');
        });

        it('should handle keyboard events', () => {
            const handleKeyDown = vi.fn();
            renderWithTheme(< [ComponentName] onKeyDown = { handleKeyDown } />);

            const element = screen.getByTestId('[component-name]');
            fireEvent.keyDown(element, { key: 'Enter' });

            expect(handleKeyDown).toHaveBeenCalledWith(
                expect.objectContaining({ key: 'Enter' })
            );
        });
    });

    // FORM TESTING PATTERNS (Based on RegisterForm learnings)
    describe('Form Testing Patterns', () => {
        // Example: Testing form validation with CSS classes
        it('should show validation errors using CSS classes', async () => {
            renderWithTheme(< [ComponentName] />);

            const emailInput = screen.getByPlaceholderText('form.emailPlaceholder');
            const submitButton = screen.getByRole('button', { name: 'form.submitButton' });

            fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
            fireEvent.click(submitButton);

            // Check for validation state using CSS classes (more reliable than text)
            await waitFor(() => {
                expect(emailInput.closest('.ant-form-item')).toHaveClass('ant-form-item-has-error');
            });
        });

        // Example: Testing form submission with all required fields
        it('should submit form with all required fields', async () => {
            const mockSubmit = vi.fn().mockResolvedValue(undefined);

            renderWithTheme(< [ComponentName] onSubmit = { mockSubmit } />);

            // Fill ALL required fields (don't assume which are required)
            const firstNameInput = screen.getByPlaceholderText('form.firstNamePlaceholder');
            const lastNameInput = screen.getByPlaceholderText('form.lastNamePlaceholder');
            const emailInput = screen.getByPlaceholderText('form.emailPlaceholder');
            const passwordInput = screen.getByPlaceholderText('form.passwordPlaceholder');
            const termsCheckbox = screen.getByRole('checkbox');
            const submitButton = screen.getByRole('button', { name: 'form.submitButton' });

            fireEvent.change(firstNameInput, { target: { value: 'John' } });
            fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
            fireEvent.click(termsCheckbox);
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(mockSubmit).toHaveBeenCalledWith({
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'test@example.com',
                    password: 'Password123!',
                });
            });
        });

        // Example: Testing password visibility toggle
        it('should toggle password visibility', () => {
            renderWithTheme(< [ComponentName] />);

            const passwordInput = screen.getByPlaceholderText('form.passwordPlaceholder');
            const toggleButtons = screen.getAllByRole('img', { name: 'eye-invisible' });
            const toggleButton = toggleButtons[0]; // First password field

            expect(passwordInput).toHaveAttribute('type', 'password');
            fireEvent.click(toggleButton);
            expect(passwordInput).toHaveAttribute('type', 'text');
        });

        // Example: Testing loading states correctly
        it('should show loading state correctly', () => {
            renderWithTheme(< [ComponentName] loading />);

            // Only submit button should be disabled, not form inputs
            const submitButton = screen.getByRole('button', { name: 'loadingform.submitting' });
            expect(submitButton).toBeDisabled();

            // Form inputs should remain enabled for error correction
            const emailInput = screen.getByPlaceholderText('form.emailPlaceholder');
            expect(emailInput).not.toBeDisabled();
        });

        // Example: Testing element selection with specific selectors
        it('should use specific selectors for form elements', () => {
            renderWithTheme(< [ComponentName] />);

            // Use specific selectors when multiple elements have similar roles
            const form = document.querySelector('form[id="specific-form"]');
            expect(form).toBeInTheDocument();

            // Or use data attributes for more specific selection
            const specificInput = screen.getByTestId('specific-input');
            expect(specificInput).toBeInTheDocument();
        });
    });

    // STATE MANAGEMENT TESTS
    describe('State Management', () => {
        it('should update state correctly', async () => {
            renderWithTheme(< [ComponentName] />);

            const button = screen.getByRole('button');
            fireEvent.click(button);

            await waitFor(() => {
                expect(screen.getByText('Updated State')).toBeInTheDocument();
            });
        });

        it('should handle loading states', () => {
            renderWithTheme(< [ComponentName] loading />);

            expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
        });

        it('should handle error states', () => {
            renderWithTheme(< [ComponentName] error = "Test error message" />);

            expect(screen.getByText('Test error message')).toBeInTheDocument();
            expect(screen.getByText('Test error message')).toHaveClass('error-message');
        });
    });

    // TRANSLATION AND INTERNATIONALIZATION TESTS
    describe('Translation and i18n', () => {
        it('should use correct translation keys', () => {
            renderWithTheme(< [ComponentName] />);

            // ALWAYS verify actual translation keys from translation files
            // Example: Check that the component uses 'register.title' not 'auth.register.title'
            expect(screen.getByText('[component].title')).toBeInTheDocument();
            expect(screen.getByText('[component].subtitle')).toBeInTheDocument();
        });

        it('should handle missing translation keys gracefully', () => {
            // Test that component doesn't crash with missing keys
            renderWithTheme(< [ComponentName] />);

            // Component should render even if some translations are missing
            expect(screen.getByTestId('[component-name]')).toBeInTheDocument();
        });

        it('should use consistent translation key patterns', () => {
            renderWithTheme(< [ComponentName] />);

            // Verify that translation keys follow consistent patterns
            // Example: All form labels should use 'form.fieldName' pattern
            expect(screen.getByText('[component].emailLabel')).toBeInTheDocument();
            expect(screen.getByText('[component].passwordLabel')).toBeInTheDocument();
        });

        it('should handle validation message translations', () => {
            renderWithTheme(< [ComponentName] />);

            // Test that validation messages use correct translation keys
            // Example: 'register.validation.emailInvalid' not 'auth.register.validation.emailInvalid'
            const submitButton = screen.getByRole('button', { name: '[component].submitButton' });
            fireEvent.click(submitButton);

            // Validation messages should use proper translation keys
            expect(screen.getByText('[component].validation.required')).toBeInTheDocument();
        });
    });

    // ACCESSIBILITY TESTS
    describe('Accessibility', () => {
        it('should have proper ARIA labels', () => {
            renderWithTheme(< [ComponentName] ariaLabel = "Test component" />);

            const component = screen.getByLabelText('Test component');
            expect(component).toBeInTheDocument();
        });

        it('should support keyboard navigation', () => {
            renderWithTheme(< [ComponentName] />);

            const focusableElement = screen.getByRole('button');
            focusableElement.focus();

            expect(focusableElement).toHaveFocus();
        });

        it('should have proper color contrast', () => {
            renderWithTheme(< [ComponentName] />);

            const textElement = screen.getByText('Test Text');
            const computedStyle = window.getComputedStyle(textElement);

            // This would need a proper contrast checking utility
            expect(computedStyle.color).toBeDefined();
        });

        it('should have proper form field associations', () => {
            renderWithTheme(< [ComponentName] />);

            // Test that form fields are properly associated with labels
            const emailInput = screen.getByLabelText('[component].emailLabel');
            const passwordInput = screen.getByLabelText('[component].passwordLabel');

            expect(emailInput).toBeInTheDocument();
            expect(passwordInput).toBeInTheDocument();
            expect(emailInput).toHaveAttribute('aria-required', 'true');
            expect(passwordInput).toHaveAttribute('aria-required', 'true');
        });
    });

    // BLOCKAI THEME TESTS
    describe('BlockAI Theme Integration', () => {
        it('should apply BlockAI color scheme', () => {
            renderWithTheme(< [ComponentName] />);

            const component = screen.getByTestId('[component-name]');
            const computedStyle = window.getComputedStyle(component);

            // Test for BlockAI theme colors
            expect(computedStyle.backgroundColor).toMatch(/rgb\(54, 61, 101\)|#363d65/);
        });

        it('should use correct typography', () => {
            renderWithTheme(< [ComponentName] />);

            const heading = screen.getByRole('heading');
            const computedStyle = window.getComputedStyle(heading);

            expect(computedStyle.fontFamily).toContain('Inter');
            expect(computedStyle.fontWeight).toBe('600');
        });

        it('should apply proper spacing', () => {
            renderWithTheme(< [ComponentName] />);

            const container = screen.getByTestId('[component-name]');
            const computedStyle = window.getComputedStyle(container);

            // Test for 8px grid system spacing
            expect(computedStyle.padding).toMatch(/16px|24px|32px/);
        });
    });

    // EDGE CASES TESTS
    describe('Edge Cases', () => {
        it('should handle empty data gracefully', () => {
            renderWithTheme(< [ComponentName] data = { []} />);

            expect(screen.getByText('No data available')).toBeInTheDocument();
        });

        it('should handle null/undefined props', () => {
            renderWithTheme(< [ComponentName] data = { null} />);

            expect(screen.getByTestId('[component-name]')).toBeInTheDocument();
        });

        it('should handle very long text content', () => {
            const longText = 'A'.repeat(1000);
            renderWithTheme(< [ComponentName] text = { longText } />);

            expect(screen.getByText(longText)).toBeInTheDocument();
        });
    });

    // PERFORMANCE TESTS
    describe('Performance', () => {
        it('should not re-render unnecessarily', () => {
            const renderSpy = vi.fn();
            const TestComponent = () => {
                renderSpy();
                return < [ComponentName] />;
            };

            renderWithTheme(<TestComponent />);
            expect(renderSpy).toHaveBeenCalledTimes(1);
        });

        it('should handle large datasets efficiently', () => {
            const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
                id: i,
                name: `Item ${i}`,
            }));

            renderWithTheme(< [ComponentName] data = { largeDataset } />);

            // Should render without performance issues
            expect(screen.getByTestId('[component-name]')).toBeInTheDocument();
        });
    });

    // INTEGRATION TESTS
    describe('Integration', () => {
        it('should work with Zustand store', async () => {
            // Mock Zustand store
            const mockStore = {
                data: [],
                loading: false,
                fetchData: vi.fn(),
            };

            vi.mock('@/store/[storeName]', () => ({
                use[StoreName]Store: () => mockStore,
      }));

    renderWithTheme(< [ComponentName] />);

    await waitFor(() => {
        expect(mockStore.fetchData).toHaveBeenCalled();
    });
});

it('should integrate with API service', async () => {
    const mockApiService = {
        get: vi.fn().mockResolvedValue({ data: [] }),
    };

    vi.mocked(apiService.get).mockImplementation(mockApiService.get);

    renderWithTheme(< [ComponentName] />);

    await waitFor(() => {
        expect(mockApiService.get).toHaveBeenCalled();
    });
});
  });
});
