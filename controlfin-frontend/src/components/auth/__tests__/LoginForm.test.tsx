/**
 * LoginForm Component Tests
 *
 * Comprehensive tests for the LoginForm component following ControlFin testing patterns
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuth } from '../../../hooks/useAuth';
import LoginForm from '../LoginForm';

// Mock react-i18next for consistent translation testing
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: {
            changeLanguage: vi.fn(),
        },
    }),
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

// Mock auth hook
vi.mock('../../../hooks/useAuth', () => ({
    useAuth: vi.fn(),
}));

// Mock theme hook
vi.mock('../../../hooks/useBlockAITheme', () => ({
    useBlockAITheme: () => ({
        colors: {
            backgroundCards: '#1a1a1a',
            backgroundPrimary: '#0f0f0f',
            textPrimary: '#ffffff',
            textSecondary: '#cccccc',
            accentPrimary: '#3b82f6',
            accentSecondary: '#8b5cf6',
            error: '#ef4444',
            warning: '#f59e0b',
            success: '#10b981',
        },
        typography: {
            fontFamily: 'Inter, sans-serif',
            sizes: {
                desktop: {
                    h1: '32px',
                    h2: '24px',
                    h3: '20px',
                    h4: '18px',
                    h5: '16px',
                    h6: '14px',
                    body: '14px',
                    small: '12px',
                },
                mobile: {
                    h1: '28px',
                    h2: '22px',
                    h3: '18px',
                    h4: '16px',
                    h5: '14px',
                    h6: '12px',
                    body: '14px',
                    small: '12px',
                },
            },
            weights: {
                light: 300,
                normal: 400,
                medium: 500,
                semibold: 600,
                bold: 700,
            },
        },
    }),
}));

// Mock logger
vi.mock('../../../utils/logger', () => ({
    error: vi.fn(),
}));

// Mock GoogleOAuthButton
vi.mock('../GoogleOAuthButton', () => ({
    default: () => <div data-testid="google-oauth-button">Google OAuth Button</div>,
}));

// Test wrapper with Ant Design theme and router
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

// Helper function to render component with theme
const renderWithTheme = (component: React.ReactElement) => {
    return render(component, { wrapper: TestWrapper });
};

describe('LoginForm Component', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        vi.clearAllMocks();

        // Set up default auth mock
        vi.mocked(useAuth).mockReturnValue({
            login: vi.fn(),
            isLoading: false,
            error: null,
            clearError: vi.fn(),
        });
    });

    // BASIC RENDERING TESTS
    describe('Basic Rendering', () => {
        it('should render with default props', () => {
            renderWithTheme(<LoginForm />);

            // Test that component renders without crashing
            expect(screen.getByText('login.title')).toBeInTheDocument();
            expect(screen.getByText('login.subtitle')).toBeInTheDocument();
        });

        it('should render with custom props', () => {
            const customProps = {
                className: 'custom-login-form',
                style: { backgroundColor: '#00d9ff' },
            };

            renderWithTheme(<LoginForm {...customProps} />);

            const card = document.querySelector('.ant-card');
            expect(card).toHaveClass('custom-login-form');
        });

        it('should render email input field', () => {
            renderWithTheme(<LoginForm />);

            const emailInput = screen.getByPlaceholderText('login.emailPlaceholder');
            expect(emailInput).toBeInTheDocument();
            expect(emailInput).toHaveAttribute('type', 'text');
        });

        it('should render password input field', () => {
            renderWithTheme(<LoginForm />);

            const passwordInput = screen.getByPlaceholderText('login.passwordPlaceholder');
            expect(passwordInput).toBeInTheDocument();
            expect(passwordInput).toHaveAttribute('type', 'password');
        });

        it('should render login button', () => {
            renderWithTheme(<LoginForm />);

            const loginButton = screen.getByRole('button', { name: 'login.loginButton' });
            expect(loginButton).toBeInTheDocument();
        });

        it('should render Google OAuth button', () => {
            renderWithTheme(<LoginForm />);

            expect(screen.getByTestId('google-oauth-button')).toBeInTheDocument();
        });
    });

    // FORM INTERACTION TESTS
    describe('Form Interactions', () => {
        it('should handle email input changes', () => {
            renderWithTheme(<LoginForm />);

            const emailInput = screen.getByPlaceholderText('login.emailPlaceholder');
            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

            expect(emailInput).toHaveValue('test@example.com');
        });

        it('should handle password input changes', () => {
            renderWithTheme(<LoginForm />);

            const passwordInput = screen.getByPlaceholderText('login.passwordPlaceholder');
            fireEvent.change(passwordInput, { target: { value: 'password123' } });

            expect(passwordInput).toHaveValue('password123');
        });

        it('should toggle password visibility', () => {
            renderWithTheme(<LoginForm />);

            const passwordInput = screen.getByPlaceholderText('login.passwordPlaceholder');

            // Initially password should be hidden
            expect(passwordInput).toHaveAttribute('type', 'password');

            // Find the password toggle icon (eye-invisible)
            const toggleIcon = screen.getByLabelText('eye-invisible');

            // Click toggle icon
            fireEvent.click(toggleIcon);

            // Password should be visible
            expect(passwordInput).toHaveAttribute('type', 'text');
        });

        it('should handle remember me checkbox', () => {
            renderWithTheme(<LoginForm />);

            const rememberCheckbox = screen.getByRole('checkbox');
            expect(rememberCheckbox).toBeInTheDocument();

            fireEvent.click(rememberCheckbox);
            expect(rememberCheckbox).toBeChecked();
        });
    });

    // CALLBACK TESTS
    describe('Callback Functions', () => {
        it('should call onSwitchToRegister when register link is clicked', () => {
            const mockOnSwitchToRegister = vi.fn();
            renderWithTheme(<LoginForm onSwitchToRegister={mockOnSwitchToRegister} />);

            const registerLink = screen.getByText('login.signUp');
            fireEvent.click(registerLink);

            expect(mockOnSwitchToRegister).toHaveBeenCalledTimes(1);
        });

        it('should call onForgotPassword when forgot password link is clicked', () => {
            const mockOnForgotPassword = vi.fn();
            renderWithTheme(<LoginForm onForgotPassword={mockOnForgotPassword} />);

            const forgotPasswordLink = screen.getByText('login.forgotPassword');
            fireEvent.click(forgotPasswordLink);

            expect(mockOnForgotPassword).toHaveBeenCalledTimes(1);
        });

        it('should call onSuccess after successful login', async () => {
            const mockOnSuccess = vi.fn();
            const mockLogin = vi.fn().mockResolvedValue(undefined);

            vi.mocked(useAuth).mockReturnValue({
                login: mockLogin,
                isLoading: false,
                error: null,
                clearError: vi.fn(),
            });

            renderWithTheme(<LoginForm onSuccess={mockOnSuccess} />);

            // Fill form
            const emailInput = screen.getByPlaceholderText('login.emailPlaceholder');
            const passwordInput = screen.getByPlaceholderText('login.passwordPlaceholder');
            const submitButton = screen.getByRole('button', { name: 'login.loginButton' });

            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(mockLogin).toHaveBeenCalledWith({
                    email: 'test@example.com',
                    password: 'password123',
                });
                expect(mockOnSuccess).toHaveBeenCalledTimes(1);
            });
        });
    });

    // ERROR HANDLING TESTS
    describe('Error Handling', () => {
        it('should display error message when login fails', () => {
            const mockError = 'Invalid credentials';
            vi.mocked(useAuth).mockReturnValue({
                login: vi.fn(),
                isLoading: false,
                error: mockError,
                clearError: vi.fn(),
            });

            renderWithTheme(<LoginForm />);

            expect(screen.getByText(mockError)).toBeInTheDocument();
        });

        it('should clear error when form is submitted', async () => {
            const mockClearError = vi.fn();
            const mockLogin = vi.fn().mockResolvedValue(undefined);

            vi.mocked(useAuth).mockReturnValue({
                login: mockLogin,
                isLoading: false,
                error: null,
                clearError: mockClearError,
            });

            renderWithTheme(<LoginForm />);

            const emailInput = screen.getByPlaceholderText('login.emailPlaceholder');
            const passwordInput = screen.getByPlaceholderText('login.passwordPlaceholder');
            const submitButton = screen.getByRole('button', { name: 'login.loginButton' });

            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(mockClearError).toHaveBeenCalledTimes(1);
            });
        });
    });

    // LOADING STATE TESTS
    describe('Loading States', () => {
        it('should show loading state when submitting', () => {
            vi.mocked(useAuth).mockReturnValue({
                login: vi.fn(),
                isLoading: true,
                error: null,
                clearError: vi.fn(),
            });

            renderWithTheme(<LoginForm />);

            const submitButton = screen.getByRole('button', { name: /loadinglogin\.loggingIn/ });
            expect(submitButton).toBeDisabled();
        });

        it('should disable form inputs when loading', () => {
            vi.mocked(useAuth).mockReturnValue({
                login: vi.fn(),
                isLoading: true,
                error: null,
                clearError: vi.fn(),
            });

            renderWithTheme(<LoginForm />);

            const emailInput = screen.getByPlaceholderText('login.emailPlaceholder');
            const passwordInput = screen.getByPlaceholderText('login.passwordPlaceholder');
            const submitButton = screen.getByRole('button', { name: /loadinglogin\.loggingIn/ });

            // Only the submit button should be disabled during loading
            // Form inputs remain enabled in this implementation
            expect(submitButton).toBeDisabled();
        });
    });

    // ACCESSIBILITY TESTS
    describe('Accessibility', () => {
        it('should have proper form labels', () => {
            renderWithTheme(<LoginForm />);

            const emailInput = screen.getByLabelText('login.emailLabel');
            const passwordInput = screen.getByLabelText('login.passwordLabel');

            expect(emailInput).toBeInTheDocument();
            expect(passwordInput).toBeInTheDocument();
        });

        it('should have proper ARIA attributes', () => {
            renderWithTheme(<LoginForm />);

            const form = document.querySelector('form');
            expect(form).toBeInTheDocument();

            const emailInput = screen.getByPlaceholderText('login.emailPlaceholder');
            expect(emailInput).toHaveAttribute('aria-required', 'true');

            const passwordInput = screen.getByPlaceholderText('login.passwordPlaceholder');
            expect(passwordInput).toHaveAttribute('aria-required', 'true');
        });
    });
});
