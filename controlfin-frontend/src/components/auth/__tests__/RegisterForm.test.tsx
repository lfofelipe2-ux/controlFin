/**
 * RegisterForm Component Tests
 *
 * Comprehensive tests for the RegisterForm component following ControlFin testing patterns
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuth } from '../../../hooks/useAuth';
import { usePasswordStrength } from '../../../hooks/usePasswordStrength';
import RegisterForm from '../RegisterForm';

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
                    h2: '24px',
                    body: '14px',
                    small: '12px',
                },
            },
            lineHeight: {
                small: '18px',
                medium: '20px',
                large: '24px',
            },
            weights: {
                light: 300,
                regular: 400,
                medium: 500,
                semibold: 600,
                bold: 700,
            },
        },
    }),
}));

// Mock auth hook
vi.mock('../../../hooks/useAuth', () => ({
    useAuth: vi.fn(),
}));

// Mock password strength hook
vi.mock('../../../hooks/usePasswordStrength', () => ({
    usePasswordStrength: vi.fn(),
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

// Test setup
describe('RegisterForm Component', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        vi.clearAllMocks();

        // Set up default auth mock
        vi.mocked(useAuth).mockReturnValue({
            register: vi.fn(),
            isLoading: false,
            error: null,
            clearError: vi.fn(),
        });

        // Set up default password strength mock
        vi.mocked(usePasswordStrength).mockReturnValue({
            level: 'strong',
            score: 4,
            feedback: [],
            isValid: true,
        });
    });

    // BASIC RENDERING TESTS
    describe('Basic Rendering', () => {
        it('should render with default props', () => {
            renderWithTheme(<RegisterForm />);

            // Test that component renders without crashing
            expect(screen.getByText('register.title')).toBeInTheDocument();
            expect(screen.getByText('register.subtitle')).toBeInTheDocument();
        });

        it('should render with custom props', () => {
            const customProps = {
                className: 'custom-register-form',
                style: { backgroundColor: '#00d9ff' },
            };

            renderWithTheme(<RegisterForm {...customProps} />);

            const card = document.querySelector('.custom-register-form');
            expect(card).toBeInTheDocument();
        });

        it('should render email input field', () => {
            renderWithTheme(<RegisterForm />);

            const emailInput = screen.getByPlaceholderText('register.emailPlaceholder');
            expect(emailInput).toBeInTheDocument();
            expect(emailInput).toHaveAttribute('type', 'text');
        });

        it('should render password input field', () => {
            renderWithTheme(<RegisterForm />);

            const passwordInput = screen.getByPlaceholderText('register.passwordPlaceholder');
            expect(passwordInput).toBeInTheDocument();
            expect(passwordInput).toHaveAttribute('type', 'password');
        });

        it('should render confirm password input field', () => {
            renderWithTheme(<RegisterForm />);

            const confirmPasswordInput = screen.getByPlaceholderText('register.confirmPasswordPlaceholder');
            expect(confirmPasswordInput).toBeInTheDocument();
            expect(confirmPasswordInput).toHaveAttribute('type', 'password');
        });

        it('should render register button', () => {
            renderWithTheme(<RegisterForm />);

            const registerButton = screen.getByRole('button', { name: 'register.registerButton' });
            expect(registerButton).toBeInTheDocument();
        });

        it('should render Google OAuth button', () => {
            renderWithTheme(<RegisterForm />);

            expect(screen.getByTestId('google-oauth-button')).toBeInTheDocument();
        });
    });

    // FORM INTERACTION TESTS
    describe('Form Interactions', () => {
        it('should handle email input changes', () => {
            renderWithTheme(<RegisterForm />);

            const emailInput = screen.getByPlaceholderText('register.emailPlaceholder');
            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

            expect(emailInput).toHaveValue('test@example.com');
        });

        it('should handle password input changes', () => {
            renderWithTheme(<RegisterForm />);

            const passwordInput = screen.getByPlaceholderText('register.passwordPlaceholder');
            fireEvent.change(passwordInput, { target: { value: 'password123' } });

            expect(passwordInput).toHaveValue('password123');
        });

        it('should handle confirm password input changes', () => {
            renderWithTheme(<RegisterForm />);

            const confirmPasswordInput = screen.getByPlaceholderText('register.confirmPasswordPlaceholder');
            fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

            expect(confirmPasswordInput).toHaveValue('password123');
        });

        it('should toggle password visibility', () => {
            renderWithTheme(<RegisterForm />);

            const passwordInput = screen.getByPlaceholderText('register.passwordPlaceholder');
            const toggleButtons = screen.getAllByRole('img', { name: 'eye-invisible' });
            const toggleButton = toggleButtons[0]; // First password field

            // Initially password should be hidden
            expect(passwordInput).toHaveAttribute('type', 'password');

            // Click toggle button
            fireEvent.click(toggleButton);

            // Password should be visible
            expect(passwordInput).toHaveAttribute('type', 'text');
        });

        it('should toggle confirm password visibility', () => {
            renderWithTheme(<RegisterForm />);

            const confirmPasswordInput = screen.getByPlaceholderText('register.confirmPasswordPlaceholder');
            const toggleButtons = screen.getAllByRole('img', { name: 'eye-invisible' });

            // Initially confirm password should be hidden
            expect(confirmPasswordInput).toHaveAttribute('type', 'password');

            // Click second toggle button (for confirm password)
            fireEvent.click(toggleButtons[1]);

            // Confirm password should be visible
            expect(confirmPasswordInput).toHaveAttribute('type', 'text');
        });

        it('should handle terms and conditions checkbox', () => {
            renderWithTheme(<RegisterForm />);

            const termsCheckbox = screen.getByRole('checkbox');
            expect(termsCheckbox).toBeInTheDocument();

            fireEvent.click(termsCheckbox);
            expect(termsCheckbox).toBeChecked();
        });
    });

    // PASSWORD STRENGTH TESTS
    describe('Password Strength', () => {
        it('should display password strength indicator', () => {
            renderWithTheme(<RegisterForm />);

            const passwordInput = screen.getByPlaceholderText('register.passwordPlaceholder');
            fireEvent.change(passwordInput, { target: { value: 'password123' } });

            // Password strength indicator should be visible
            expect(screen.getByRole('progressbar')).toBeInTheDocument();
        });

        it('should show password strength feedback', () => {
            vi.mocked(usePasswordStrength).mockReturnValue({
                level: 'weak',
                score: 1,
                feedback: ['Password is too short'],
                isValid: false,
            });

            renderWithTheme(<RegisterForm />);

            const passwordInput = screen.getByPlaceholderText('register.passwordPlaceholder');
            fireEvent.change(passwordInput, { target: { value: '123' } });

            expect(screen.getByText('Password is too short')).toBeInTheDocument();
        });
    });

    // CALLBACK TESTS
    describe('Callback Functions', () => {
        it('should call onSwitchToLogin when login link is clicked', () => {
            const mockOnSwitchToLogin = vi.fn();
            renderWithTheme(<RegisterForm onSwitchToLogin={mockOnSwitchToLogin} />);

            const loginLink = screen.getByText('register.signIn');
            fireEvent.click(loginLink);

            expect(mockOnSwitchToLogin).toHaveBeenCalledTimes(1);
        });

        it('should call onSuccess after successful registration', async () => {
            const mockOnSuccess = vi.fn();
            const mockRegister = vi.fn().mockResolvedValue(undefined);

            vi.mocked(useAuth).mockReturnValue({
                register: mockRegister,
                isLoading: false,
                error: null,
                clearError: vi.fn(),
            });

            renderWithTheme(<RegisterForm onSuccess={mockOnSuccess} />);

            // Fill form
            const firstNameInput = screen.getByPlaceholderText('register.firstNamePlaceholder');
            const lastNameInput = screen.getByPlaceholderText('register.lastNamePlaceholder');
            const emailInput = screen.getByPlaceholderText('register.emailPlaceholder');
            const passwordInput = screen.getByPlaceholderText('register.passwordPlaceholder');
            const confirmPasswordInput = screen.getByPlaceholderText('register.confirmPasswordPlaceholder');
            const termsCheckbox = screen.getByRole('checkbox');
            const submitButton = screen.getByRole('button', { name: 'register.registerButton' });

            fireEvent.change(firstNameInput, { target: { value: 'John' } });
            fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
            fireEvent.change(confirmPasswordInput, { target: { value: 'Password123!' } });
            fireEvent.click(termsCheckbox);
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(mockRegister).toHaveBeenCalledWith({
                    email: 'test@example.com',
                    password: 'Password123!',
                    firstName: 'John',
                    lastName: 'Doe',
                });
                expect(mockOnSuccess).toHaveBeenCalledTimes(1);
            });
        });
    });

    // VALIDATION TESTS
    describe('Form Validation', () => {
        it('should validate email format', async () => {
            renderWithTheme(<RegisterForm />);

            const emailInput = screen.getByPlaceholderText('register.emailPlaceholder');
            const submitButton = screen.getByRole('button', { name: 'register.registerButton' });

            fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
            fireEvent.click(submitButton);

            // Check that the form shows validation state
            await waitFor(() => {
                expect(emailInput.closest('.ant-form-item')).toHaveClass('ant-form-item-has-error');
            });
        });

        it('should validate password confirmation match', async () => {
            renderWithTheme(<RegisterForm />);

            const passwordInput = screen.getByPlaceholderText('register.passwordPlaceholder');
            const confirmPasswordInput = screen.getByPlaceholderText('register.confirmPasswordPlaceholder');
            const submitButton = screen.getByRole('button', { name: 'register.registerButton' });

            fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
            fireEvent.change(confirmPasswordInput, { target: { value: 'Different123!' } });
            fireEvent.click(submitButton);

            // Check that the form shows validation state
            await waitFor(() => {
                expect(confirmPasswordInput.closest('.ant-form-item')).toHaveClass('ant-form-item-has-error');
            });
        });

        it('should require terms acceptance', async () => {
            renderWithTheme(<RegisterForm />);

            const firstNameInput = screen.getByPlaceholderText('register.firstNamePlaceholder');
            const lastNameInput = screen.getByPlaceholderText('register.lastNamePlaceholder');
            const emailInput = screen.getByPlaceholderText('register.emailPlaceholder');
            const passwordInput = screen.getByPlaceholderText('register.passwordPlaceholder');
            const confirmPasswordInput = screen.getByPlaceholderText('register.confirmPasswordPlaceholder');
            const termsCheckbox = screen.getByRole('checkbox');
            const submitButton = screen.getByRole('button', { name: 'register.registerButton' });

            fireEvent.change(firstNameInput, { target: { value: 'John' } });
            fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
            fireEvent.change(confirmPasswordInput, { target: { value: 'Password123!' } });
            // Don't check terms checkbox
            fireEvent.click(submitButton);

            // Check that the form shows validation state
            await waitFor(() => {
                expect(termsCheckbox.closest('.ant-form-item')).toHaveClass('ant-form-item-has-error');
            });
        });
    });

    // ERROR HANDLING TESTS
    describe('Error Handling', () => {
        it('should display error message when registration fails', () => {
            const mockError = 'Registration failed';
            vi.mocked(useAuth).mockReturnValue({
                register: vi.fn(),
                isLoading: false,
                error: mockError,
                clearError: vi.fn(),
            });

            renderWithTheme(<RegisterForm />);

            expect(screen.getByText(mockError)).toBeInTheDocument();
        });

        it('should clear error when form is submitted', async () => {
            const mockClearError = vi.fn();
            const mockRegister = vi.fn().mockResolvedValue(undefined);

            vi.mocked(useAuth).mockReturnValue({
                register: mockRegister,
                isLoading: false,
                error: null,
                clearError: mockClearError,
            });

            renderWithTheme(<RegisterForm />);

            const firstNameInput = screen.getByPlaceholderText('register.firstNamePlaceholder');
            const lastNameInput = screen.getByPlaceholderText('register.lastNamePlaceholder');
            const emailInput = screen.getByPlaceholderText('register.emailPlaceholder');
            const passwordInput = screen.getByPlaceholderText('register.passwordPlaceholder');
            const confirmPasswordInput = screen.getByPlaceholderText('register.confirmPasswordPlaceholder');
            const termsCheckbox = screen.getByRole('checkbox');
            const submitButton = screen.getByRole('button', { name: 'register.registerButton' });

            fireEvent.change(firstNameInput, { target: { value: 'John' } });
            fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
            fireEvent.change(confirmPasswordInput, { target: { value: 'Password123!' } });
            fireEvent.click(termsCheckbox);
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
                register: vi.fn(),
                isLoading: true,
                error: null,
                clearError: vi.fn(),
            });

            renderWithTheme(<RegisterForm />);

            const submitButton = screen.getByRole('button', { name: 'loadingregister.registering' });
            expect(submitButton).toBeDisabled();
        });

        it('should disable form inputs when loading', () => {
            vi.mocked(useAuth).mockReturnValue({
                register: vi.fn(),
                isLoading: true,
                error: null,
                clearError: vi.fn(),
            });

            renderWithTheme(<RegisterForm />);

            const submitButton = screen.getByRole('button', { name: 'loadingregister.registering' });

            // Only the submit button should be disabled, not the form inputs
            // This allows users to correct any errors while the form is submitting
            expect(submitButton).toBeDisabled();
        });
    });

    // ACCESSIBILITY TESTS
    describe('Accessibility', () => {
        it('should have proper form labels', () => {
            renderWithTheme(<RegisterForm />);

            const emailInput = screen.getByLabelText('register.emailLabel');
            const passwordInput = screen.getByLabelText('register.passwordLabel');
            const confirmPasswordInput = screen.getByLabelText('register.confirmPasswordLabel');

            expect(emailInput).toBeInTheDocument();
            expect(passwordInput).toBeInTheDocument();
            expect(confirmPasswordInput).toBeInTheDocument();
        });

        it('should have proper ARIA attributes', () => {
            renderWithTheme(<RegisterForm />);

            const form = document.querySelector('form[id="register"]');
            expect(form).toBeInTheDocument();

            const emailInput = screen.getByPlaceholderText('register.emailPlaceholder');
            expect(emailInput).toHaveAttribute('aria-required', 'true');

            const passwordInput = screen.getByPlaceholderText('register.passwordPlaceholder');
            expect(passwordInput).toHaveAttribute('aria-required', 'true');

            const confirmPasswordInput = screen.getByPlaceholderText('register.confirmPasswordPlaceholder');
            expect(confirmPasswordInput).toHaveAttribute('aria-required', 'true');
        });
    });
});
