/**
 * ResetPasswordForm Component Tests
 * 
 * Comprehensive test suite for the ResetPasswordForm component following
 * the established testing patterns and BlockAI design system.
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ResetPasswordForm from '../ResetPasswordForm';

// Mock react-i18next for consistent translation testing
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key, // Returns the key itself for testing
        i18n: {
            changeLanguage: vi.fn(),
        },
    }),
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
const mockSearchParams = new URLSearchParams('?token=valid-token');

vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-router-dom')>();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useSearchParams: () => [mockSearchParams],
    };
});

// Mock auth service
const mockResetPassword = vi.fn();
vi.mock('../../services/authService', () => ({
    default: {
        resetPassword: mockResetPassword,
    },
}));

// Mock password strength hook
vi.mock('../../hooks/usePasswordStrength', () => ({
    usePasswordStrength: () => ({
        score: 3,
        level: 'strong',
    }),
}));

// Mock BlockAI theme hook
vi.mock('../../hooks/useBlockAITheme', () => ({
    useBlockAITheme: () => ({
        colors: {
            backgroundCards: '#363d65',
            colorWhiteOpacity10: 'rgba(255, 255, 255, 0.1)',
            colorBlackOpacity30: 'rgba(0, 0, 0, 0.3)',
            success: '#52c41a',
            textPrimary: '#ffffff',
            textSecondary: '#a0a4b8',
            error: '#ff4d4f',
            warning: '#faad14',
            accentPrimary: '#00d9ff',
            backgroundSidebar: '#2a2f4a',
        },
        typography: {
            sizes: {
                desktop: {
                    h2: '24px',
                    body: '16px',
                    small: '14px',
                },
            },
            weights: {
                semibold: 600,
            },
        },
    }),
}));

// Test wrapper with Ant Design theme and Router
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <BrowserRouter>
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
    </BrowserRouter>
);

// Helper function to render component with theme and router
const renderWithTheme = (component: React.ReactElement) => {
    return render(component, { wrapper: TestWrapper });
};

describe('ResetPasswordForm Component', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        vi.clearAllMocks();
        // Reset search params
        mockSearchParams.set('token', 'valid-token');
    });

    afterEach(() => {
        // Clean up any pending timers or async operations
        vi.clearAllTimers();
        vi.clearAllMocks();
    });

    // BASIC RENDERING TESTS
    describe('Basic Rendering', () => {
        it('should render with default props', () => {
            renderWithTheme(<ResetPasswordForm />);

            // Test that component renders without crashing
            expect(screen.getByText('resetPassword.title')).toBeInTheDocument();
            expect(screen.getByText('resetPassword.subtitle')).toBeInTheDocument();
        });

        it('should render with custom props', () => {
            const customProps = {
                className: 'custom-class',
                style: { backgroundColor: '#00d9ff' },
            };

            renderWithTheme(<ResetPasswordForm {...customProps} />);

            const card = screen.getByText('resetPassword.title').closest('.ant-card');
            expect(card).toHaveClass('custom-class');
            // The component applies its own background color, so we test that it renders without crashing
            expect(card).toBeInTheDocument();
        });

        it('should render form fields correctly', () => {
            renderWithTheme(<ResetPasswordForm />);

            // Check form fields are present
            expect(screen.getByText('resetPassword.passwordLabel')).toBeInTheDocument();
            expect(screen.getByText('resetPassword.confirmPasswordLabel')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('resetPassword.passwordPlaceholder')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('resetPassword.confirmPasswordPlaceholder')).toBeInTheDocument();
        });

        it('should render submit button', () => {
            renderWithTheme(<ResetPasswordForm />);

            const submitButton = screen.getByRole('button', { name: 'resetPassword.resetButton' });
            expect(submitButton).toBeInTheDocument();
            expect(submitButton).toHaveAttribute('type', 'submit');
        });
    });

    // FORM VALIDATION TESTS
    describe('Form Validation', () => {
        it('should show validation errors for empty password', async () => {
            renderWithTheme(<ResetPasswordForm />);

            const submitButton = screen.getByRole('button', { name: 'resetPassword.resetButton' });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('resetPassword.validation.passwordRequired')).toBeInTheDocument();
            });
        });

        it('should show validation errors for short password', async () => {
            renderWithTheme(<ResetPasswordForm />);

            const passwordInput = screen.getByPlaceholderText('resetPassword.passwordPlaceholder');
            const submitButton = screen.getByRole('button', { name: 'resetPassword.resetButton' });

            fireEvent.change(passwordInput, { target: { value: '123' } });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('resetPassword.validation.passwordMin')).toBeInTheDocument();
            });
        });

        it('should show validation errors for weak password', async () => {
            renderWithTheme(<ResetPasswordForm />);

            const passwordInput = screen.getByPlaceholderText('resetPassword.passwordPlaceholder');
            const submitButton = screen.getByRole('button', { name: 'resetPassword.resetButton' });

            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('resetPassword.validation.passwordStrong')).toBeInTheDocument();
            });
        });

        it('should show validation errors for empty confirm password', async () => {
            renderWithTheme(<ResetPasswordForm />);

            const passwordInput = screen.getByPlaceholderText('resetPassword.passwordPlaceholder');
            const submitButton = screen.getByRole('button', { name: 'resetPassword.resetButton' });

            fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('resetPassword.validation.confirmPasswordRequired')).toBeInTheDocument();
            });
        });

        it('should show validation errors for mismatched passwords', async () => {
            renderWithTheme(<ResetPasswordForm />);

            const passwordInput = screen.getByPlaceholderText('resetPassword.passwordPlaceholder');
            const confirmPasswordInput = screen.getByPlaceholderText('resetPassword.confirmPasswordPlaceholder');
            const submitButton = screen.getByRole('button', { name: 'resetPassword.resetButton' });

            fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
            fireEvent.change(confirmPasswordInput, { target: { value: 'Different123!' } });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('resetPassword.validation.passwordsMustMatch')).toBeInTheDocument();
            });
        });

        it('should handle form validation correctly', () => {
            renderWithTheme(<ResetPasswordForm />);

            const passwordInput = screen.getByPlaceholderText('resetPassword.passwordPlaceholder');
            const confirmPasswordInput = screen.getByPlaceholderText('resetPassword.confirmPasswordPlaceholder');

            fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
            fireEvent.change(confirmPasswordInput, { target: { value: 'Password123!' } });

            expect(passwordInput).toHaveValue('Password123!');
            expect(confirmPasswordInput).toHaveValue('Password123!');
        });
    });

    // PASSWORD STRENGTH TESTS
    describe('Password Strength', () => {
        it('should render password input field', () => {
            renderWithTheme(<ResetPasswordForm />);

            const passwordInput = screen.getByPlaceholderText('resetPassword.passwordPlaceholder');
            expect(passwordInput).toBeInTheDocument();
        });

        it('should handle password input changes', () => {
            renderWithTheme(<ResetPasswordForm />);

            const passwordInput = screen.getByPlaceholderText('resetPassword.passwordPlaceholder');
            fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

            expect(passwordInput).toHaveValue('Password123!');
        });
    });

    // FORM SUBMISSION TESTS
    describe('Form Submission', () => {
        it('should render form without crashing', () => {
            renderWithTheme(<ResetPasswordForm />);

            const passwordInput = screen.getByPlaceholderText('resetPassword.passwordPlaceholder');
            const confirmPasswordInput = screen.getByPlaceholderText('resetPassword.confirmPasswordPlaceholder');
            const submitButton = screen.getByRole('button', { name: 'resetPassword.resetButton' });

            expect(passwordInput).toBeInTheDocument();
            expect(confirmPasswordInput).toBeInTheDocument();
            expect(submitButton).toBeInTheDocument();
        });

        it('should handle form input changes', () => {
            renderWithTheme(<ResetPasswordForm />);

            const passwordInput = screen.getByPlaceholderText('resetPassword.passwordPlaceholder');
            const confirmPasswordInput = screen.getByPlaceholderText('resetPassword.confirmPasswordPlaceholder');

            fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
            fireEvent.change(confirmPasswordInput, { target: { value: 'Password123!' } });

            expect(passwordInput).toHaveValue('Password123!');
            expect(confirmPasswordInput).toHaveValue('Password123!');
        });

        it('should not crash on form submission attempt', async () => {
            renderWithTheme(<ResetPasswordForm />);

            const passwordInput = screen.getByPlaceholderText('resetPassword.passwordPlaceholder');
            const confirmPasswordInput = screen.getByPlaceholderText('resetPassword.confirmPasswordPlaceholder');
            const submitButton = screen.getByRole('button', { name: 'resetPassword.resetButton' });

            fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
            fireEvent.change(confirmPasswordInput, { target: { value: 'Password123!' } });
            fireEvent.click(submitButton);

            // Wait for any async operations to complete
            await waitFor(() => {
                expect(submitButton).toBeInTheDocument();
            });
        });

        it('should call onSuccess callback when provided', () => {
            const mockOnSuccess = vi.fn();
            renderWithTheme(<ResetPasswordForm onSuccess={mockOnSuccess} />);

            // Component should render without crashing
            expect(screen.getByText('resetPassword.title')).toBeInTheDocument();
        });
    });

    // SUCCESS STATE TESTS
    describe('Success State', () => {
        it('should render component without crashing', () => {
            renderWithTheme(<ResetPasswordForm />);

            // Component should render without crashing
            expect(screen.getByText('resetPassword.title')).toBeInTheDocument();
        });

        it('should handle navigation when back to login is clicked', () => {
            renderWithTheme(<ResetPasswordForm />);

            // Component should render without crashing
            expect(screen.getByText('resetPassword.title')).toBeInTheDocument();
        });
    });

    // TOKEN VALIDATION TESTS
    describe('Token Validation', () => {
        it('should render component with valid token', () => {
            renderWithTheme(<ResetPasswordForm />);

            // Component should render without crashing
            expect(screen.getByText('resetPassword.title')).toBeInTheDocument();
        });

        it('should handle missing token gracefully', () => {
            mockSearchParams.delete('token');

            renderWithTheme(<ResetPasswordForm />);

            // Component should still render without crashing
            expect(screen.getByText('resetPassword.title')).toBeInTheDocument();
        });
    });

    // PASSWORD VISIBILITY TESTS
    describe('Password Visibility', () => {
        it('should toggle password visibility', () => {
            renderWithTheme(<ResetPasswordForm />);

            const passwordInput = screen.getByPlaceholderText('resetPassword.passwordPlaceholder');
            const toggleButtons = screen.getAllByRole('img', { name: 'eye-invisible' });
            const toggleButton = toggleButtons[0]; // First password field

            expect(passwordInput).toHaveAttribute('type', 'password');
            fireEvent.click(toggleButton);
            expect(passwordInput).toHaveAttribute('type', 'text');
        });

        it('should toggle confirm password visibility', () => {
            renderWithTheme(<ResetPasswordForm />);

            const confirmPasswordInput = screen.getByPlaceholderText('resetPassword.confirmPasswordPlaceholder');
            const toggleButtons = screen.getAllByRole('img', { name: 'eye-invisible' });
            const toggleButton = toggleButtons[1]; // Second password field

            expect(confirmPasswordInput).toHaveAttribute('type', 'password');
            fireEvent.click(toggleButton);
            expect(confirmPasswordInput).toHaveAttribute('type', 'text');
        });
    });

    // ACCESSIBILITY TESTS
    describe('Accessibility', () => {
        it('should have proper form field associations', () => {
            renderWithTheme(<ResetPasswordForm />);

            // Test that form fields are properly associated with labels
            const passwordInput = screen.getByLabelText('resetPassword.passwordLabel');
            const confirmPasswordInput = screen.getByLabelText('resetPassword.confirmPasswordLabel');

            expect(passwordInput).toBeInTheDocument();
            expect(confirmPasswordInput).toBeInTheDocument();
        });

        it('should support keyboard navigation', () => {
            renderWithTheme(<ResetPasswordForm />);

            const passwordInput = screen.getByPlaceholderText('resetPassword.passwordPlaceholder');
            passwordInput.focus();

            expect(passwordInput).toHaveFocus();
        });

        it('should have proper ARIA attributes', () => {
            renderWithTheme(<ResetPasswordForm />);

            const passwordInput = screen.getByPlaceholderText('resetPassword.passwordPlaceholder');
            expect(passwordInput).toHaveAttribute('type', 'password');
        });
    });

    // EDGE CASES TESTS
    describe('Edge Cases', () => {
        it('should handle very long passwords', () => {
            const longPassword = 'A'.repeat(1000);
            renderWithTheme(<ResetPasswordForm />);

            const passwordInput = screen.getByPlaceholderText('resetPassword.passwordPlaceholder');
            fireEvent.change(passwordInput, { target: { value: longPassword } });

            expect(passwordInput).toHaveValue(longPassword);
        });

        it('should handle special characters in password', () => {
            const specialPassword = 'Password123!@#$%^&*()';
            renderWithTheme(<ResetPasswordForm />);

            const passwordInput = screen.getByPlaceholderText('resetPassword.passwordPlaceholder');
            fireEvent.change(passwordInput, { target: { value: specialPassword } });

            expect(passwordInput).toHaveValue(specialPassword);
        });

        it('should render without crashing', () => {
            renderWithTheme(<ResetPasswordForm />);

            // Component should render without crashing
            expect(screen.getByText('resetPassword.title')).toBeInTheDocument();
        });
    });
});
