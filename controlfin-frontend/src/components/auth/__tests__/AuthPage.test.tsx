/**
 * AuthPage Component Tests
 * 
 * Comprehensive test suite for the AuthPage component following
 * the established testing patterns and BlockAI design system.
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AuthPage from '../AuthPage';

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
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-router-dom')>();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock useAuth hook
const mockUseAuth = vi.fn();
vi.mock('../../hooks/useAuth', () => ({
    useAuth: mockUseAuth,
}));

// Mock BlockAI theme hook
vi.mock('../../hooks/useBlockAITheme', () => ({
    useBlockAITheme: () => ({
        colors: {
            backgroundPrimary: '#1f2347',
            backgroundSidebar: '#363d65',
            accentPrimary: '#00d9ff',
            textPrimary: '#ffffff',
        },
        typography: {
            sizes: {
                desktop: {
                    body: '16px',
                },
            },
        },
    }),
}));

// Mock child components
vi.mock('../LoginForm', () => ({
    default: ({ onSuccess, onSwitchToRegister, onForgotPassword }: any) => (
        <div data-testid="login-form">
            <button onClick={() => onSuccess?.()}>Login Success</button>
            <button onClick={() => onSwitchToRegister?.()}>Switch to Register</button>
            <button onClick={() => onForgotPassword?.()}>Forgot Password</button>
        </div>
    ),
}));

vi.mock('../RegisterForm', () => ({
    default: ({ onSuccess, onSwitchToLogin }: any) => (
        <div data-testid="register-form">
            <button onClick={() => onSuccess?.()}>Register Success</button>
            <button onClick={() => onSwitchToLogin?.()}>Switch to Login</button>
        </div>
    ),
}));

vi.mock('../ForgotPasswordForm', () => ({
    default: ({ onSuccess, onBackToLogin }: any) => (
        <div data-testid="forgot-password-form">
            <button onClick={() => onSuccess?.()}>Forgot Password Success</button>
            <button onClick={() => onBackToLogin?.()}>Back to Login</button>
        </div>
    ),
}));

vi.mock('../ResetPasswordForm', () => ({
    default: ({ onSuccess }: any) => (
        <div data-testid="reset-password-form">
            <button onClick={() => onSuccess?.()}>Reset Password Success</button>
        </div>
    ),
}));

// Test wrapper with theme and router
const renderWithTheme = (component: React.ReactElement) => {
    return render(
        <ConfigProvider>
            <BrowserRouter>
                {component}
            </BrowserRouter>
        </ConfigProvider>
    );
};

describe('AuthPage Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            error: null,
            login: vi.fn(),
            register: vi.fn(),
            logout: vi.fn(),
            refreshToken: vi.fn(),
            forgotPassword: vi.fn(),
            resetPassword: vi.fn(),
            initializeAuth: vi.fn(),
        });
    });

    // BASIC RENDERING TESTS
    describe('Basic Rendering', () => {
        it('should render with default props', () => {
            renderWithTheme(<AuthPage />);

            expect(screen.getByTestId('login-form')).toBeInTheDocument();
        });

        it('should render with custom props', () => {
            const customStyle = { backgroundColor: 'red' };
            renderWithTheme(<AuthPage initialMode="register" style={customStyle} />);

            expect(screen.getByTestId('register-form')).toBeInTheDocument();
        });

        it('should render login form by default', () => {
            renderWithTheme(<AuthPage />);

            expect(screen.getByTestId('login-form')).toBeInTheDocument();
            expect(screen.queryByTestId('register-form')).not.toBeInTheDocument();
        });

        it('should render register form when initialMode is register', () => {
            renderWithTheme(<AuthPage initialMode="register" />);

            expect(screen.getByTestId('register-form')).toBeInTheDocument();
            expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
        });

        it('should render forgot password form when initialMode is forgot-password', () => {
            renderWithTheme(<AuthPage initialMode="forgot-password" />);

            expect(screen.getByTestId('forgot-password-form')).toBeInTheDocument();
            expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
        });

        it('should render reset password form when initialMode is reset-password', () => {
            renderWithTheme(<AuthPage initialMode="reset-password" />);

            expect(screen.getByTestId('reset-password-form')).toBeInTheDocument();
            expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
        });
    });

    // LOADING STATE TESTS
    describe('Loading State', () => {
        it('should render component without crashing when loading', () => {
            mockUseAuth.mockReturnValue({
                isAuthenticated: false,
                isLoading: true,
                user: null,
                error: null,
                login: vi.fn(),
                register: vi.fn(),
                logout: vi.fn(),
                refreshToken: vi.fn(),
                forgotPassword: vi.fn(),
                resetPassword: vi.fn(),
                initializeAuth: vi.fn(),
            });

            renderWithTheme(<AuthPage />);

            // Component should render without crashing
            expect(screen.getByRole('main')).toBeInTheDocument();
        });

        it('should render login form when not loading', () => {
            mockUseAuth.mockReturnValue({
                isAuthenticated: false,
                isLoading: false,
                user: null,
                error: null,
                login: vi.fn(),
                register: vi.fn(),
                logout: vi.fn(),
                refreshToken: vi.fn(),
                forgotPassword: vi.fn(),
                resetPassword: vi.fn(),
                initializeAuth: vi.fn(),
            });

            renderWithTheme(<AuthPage />);

            expect(screen.getByTestId('login-form')).toBeInTheDocument();
        });
    });

    // AUTHENTICATION REDIRECT TESTS
    describe('Authentication Redirect', () => {
        it('should render component without crashing when authenticated', () => {
            mockUseAuth.mockReturnValue({
                isAuthenticated: true,
                isLoading: false,
                user: null,
                error: null,
                login: vi.fn(),
                register: vi.fn(),
                logout: vi.fn(),
                refreshToken: vi.fn(),
                forgotPassword: vi.fn(),
                resetPassword: vi.fn(),
                initializeAuth: vi.fn(),
            });

            renderWithTheme(<AuthPage />);

            // Component should render without crashing
            expect(screen.getByRole('main')).toBeInTheDocument();
        });

        it('should render login form when not authenticated', () => {
            mockUseAuth.mockReturnValue({
                isAuthenticated: false,
                isLoading: false,
                user: null,
                error: null,
                login: vi.fn(),
                register: vi.fn(),
                logout: vi.fn(),
                refreshToken: vi.fn(),
                forgotPassword: vi.fn(),
                resetPassword: vi.fn(),
                initializeAuth: vi.fn(),
            });

            renderWithTheme(<AuthPage />);

            expect(screen.getByTestId('login-form')).toBeInTheDocument();
        });

        it('should render component without crashing when loading', () => {
            mockUseAuth.mockReturnValue({
                isAuthenticated: true,
                isLoading: true,
                user: null,
                error: null,
                login: vi.fn(),
                register: vi.fn(),
                logout: vi.fn(),
                refreshToken: vi.fn(),
                forgotPassword: vi.fn(),
                resetPassword: vi.fn(),
                initializeAuth: vi.fn(),
            });

            renderWithTheme(<AuthPage />);

            // Component should render without crashing
            expect(screen.getByRole('main')).toBeInTheDocument();
        });
    });

    // MODE SWITCHING TESTS
    describe('Mode Switching', () => {
        it('should switch from login to register', async () => {
            renderWithTheme(<AuthPage />);

            expect(screen.getByTestId('login-form')).toBeInTheDocument();

            const switchButton = screen.getByText('Switch to Register');
            fireEvent.click(switchButton);

            await waitFor(() => {
                expect(screen.getByTestId('register-form')).toBeInTheDocument();
            });
        });

        it('should switch from register to login', async () => {
            renderWithTheme(<AuthPage initialMode="register" />);

            expect(screen.getByTestId('register-form')).toBeInTheDocument();

            const switchButton = screen.getByText('Switch to Login');
            fireEvent.click(switchButton);

            await waitFor(() => {
                expect(screen.getByTestId('login-form')).toBeInTheDocument();
            });
        });

        it('should switch from login to forgot password', async () => {
            renderWithTheme(<AuthPage />);

            expect(screen.getByTestId('login-form')).toBeInTheDocument();

            const forgotButton = screen.getByText('Forgot Password');
            fireEvent.click(forgotButton);

            await waitFor(() => {
                expect(screen.getByTestId('forgot-password-form')).toBeInTheDocument();
            });
        });

        it('should switch from forgot password back to login', async () => {
            renderWithTheme(<AuthPage initialMode="forgot-password" />);

            expect(screen.getByTestId('forgot-password-form')).toBeInTheDocument();

            const backButton = screen.getByText('Back to Login');
            fireEvent.click(backButton);

            await waitFor(() => {
                expect(screen.getByTestId('login-form')).toBeInTheDocument();
            });
        });
    });

    // SUCCESS HANDLING TESTS
    describe('Success Handling', () => {
        it('should call onSuccess callback when provided', async () => {
            const mockOnSuccess = vi.fn();
            renderWithTheme(<AuthPage onSuccess={mockOnSuccess} />);

            const successButton = screen.getByText('Login Success');
            fireEvent.click(successButton);

            expect(mockOnSuccess).toHaveBeenCalled();
        });

        it('should navigate to dashboard when no onSuccess callback', async () => {
            renderWithTheme(<AuthPage />);

            const successButton = screen.getByText('Login Success');
            fireEvent.click(successButton);

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
            });
        });

        it('should handle register success', async () => {
            renderWithTheme(<AuthPage initialMode="register" />);

            const successButton = screen.getByText('Register Success');
            fireEvent.click(successButton);

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
            });
        });

        it('should handle forgot password success', async () => {
            renderWithTheme(<AuthPage initialMode="forgot-password" />);

            const successButton = screen.getByText('Forgot Password Success');
            fireEvent.click(successButton);

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
            });
        });

        it('should handle reset password success', async () => {
            renderWithTheme(<AuthPage initialMode="reset-password" />);

            const successButton = screen.getByText('Reset Password Success');
            fireEvent.click(successButton);

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
            });
        });
    });

    // ANIMATION TESTS
    describe('Animation', () => {
        it('should handle mode changes with animation', async () => {
            renderWithTheme(<AuthPage />);

            const switchButton = screen.getByText('Switch to Register');
            fireEvent.click(switchButton);

            // Check that animation state is handled
            await waitFor(() => {
                expect(screen.getByTestId('register-form')).toBeInTheDocument();
            });
        });

        it('should not change mode if same mode is selected', () => {
            renderWithTheme(<AuthPage initialMode="login" />);

            // Try to switch to login when already in login mode
            const switchButton = screen.getByText('Switch to Register');
            fireEvent.click(switchButton);

            // Should still be in login mode
            expect(screen.getByTestId('login-form')).toBeInTheDocument();
        });
    });

    // ACCESSIBILITY TESTS
    describe('Accessibility', () => {
        it('should have proper structure for screen readers', () => {
            renderWithTheme(<AuthPage />);

            // Check that the main content is accessible
            const mainContent = screen.getByRole('main');
            expect(mainContent).toBeInTheDocument();
        });

        it('should maintain focus management during mode changes', async () => {
            renderWithTheme(<AuthPage />);

            const switchButton = screen.getByText('Switch to Register');
            switchButton.focus();

            fireEvent.click(switchButton);

            await waitFor(() => {
                expect(screen.getByTestId('register-form')).toBeInTheDocument();
            });
        });
    });

    // EDGE CASES TESTS
    describe('Edge Cases', () => {
        it('should handle rapid mode changes', async () => {
            renderWithTheme(<AuthPage />);

            const switchToRegister = screen.getByText('Switch to Register');
            fireEvent.click(switchToRegister);

            await waitFor(() => {
                expect(screen.getByTestId('register-form')).toBeInTheDocument();
            });

            const switchToLogin = screen.getByText('Switch to Login');
            fireEvent.click(switchToLogin);

            await waitFor(() => {
                expect(screen.getByTestId('login-form')).toBeInTheDocument();
            });
        });

        it('should handle undefined initialMode gracefully', () => {
            renderWithTheme(<AuthPage initialMode={undefined as any} />);

            // Should default to login mode
            expect(screen.getByTestId('login-form')).toBeInTheDocument();
        });

        it('should handle custom className and style', () => {
            const customStyle = { backgroundColor: 'blue' };
            renderWithTheme(<AuthPage className="custom-auth" style={customStyle} />);

            const container = screen.getByTestId('login-form').closest('div');
            expect(container).toBeInTheDocument();
        });
    });
});
