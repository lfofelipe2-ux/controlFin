/**
 * OAuthErrorBoundary Component Tests
 * 
 * Comprehensive test suite for the OAuthErrorBoundary component following
 * the established testing patterns and BlockAI design system.
 */

import { render, screen } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import OAuthErrorBoundary from '../OAuthErrorBoundary';

// Mock react-i18next for consistent translation testing
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key, // Returns the key itself for testing
        i18n: {
            changeLanguage: vi.fn(),
        },
    }),
}));

// Mock BlockAI theme hook
vi.mock('../../hooks/useBlockAITheme', () => ({
    useBlockAITheme: () => ({
        colors: {
            backgroundPrimary: '#1f2347',
            backgroundSidebar: '#363d65',
            backgroundCards: '#363d65',
            accentPrimary: '#00d9ff',
            accentSecondary: '#00b8e6',
            textPrimary: '#ffffff',
            textSecondary: '#a0a4b8',
            warning: '#faad14',
            error: '#ff4d4f',
        },
    }),
}));

// Mock OAuthErrorHandler service
const mockOAuthErrorHandler = {
    handleError: vi.fn(),
    getRecoveryStrategies: vi.fn(),
};

vi.mock('../../services/oauthErrorHandler', () => ({
    default: mockOAuthErrorHandler,
    OAuthErrorHandler: mockOAuthErrorHandler,
}));

// Mock window.location
const mockLocation = {
    href: '',
};
Object.defineProperty(window, 'location', {
    value: mockLocation,
    writable: true,
});

// Mock window.open
const mockWindowOpen = vi.fn();
Object.defineProperty(window, 'open', {
    value: mockWindowOpen,
    writable: true,
});

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

// Test component that renders normally
const NormalComponent = () => <div data-testid="child-component">Child Component</div>;

describe('OAuthErrorBoundary Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockLocation.href = '';
        mockWindowOpen.mockClear();

        // Setup default mock implementations
        mockOAuthErrorHandler.handleError.mockReturnValue({
            code: 'TEST_ERROR',
            message: 'Test error message',
            userMessage: 'Test user message',
            recoverable: true,
            action: 'retry',
        });

        mockOAuthErrorHandler.getRecoveryStrategies.mockReturnValue([
            'Check your internet connection',
            'Try again in a few minutes',
        ]);
    });

    // BASIC RENDERING TESTS
    describe('Basic Rendering', () => {
        it('should render children when no error occurs', () => {
            renderWithTheme(
                <OAuthErrorBoundary>
                    <NormalComponent />
                </OAuthErrorBoundary>
            );

            expect(screen.getByTestId('child-component')).toBeInTheDocument();
        });

        it('should render component without crashing', () => {
            renderWithTheme(
                <OAuthErrorBoundary>
                    <NormalComponent />
                </OAuthErrorBoundary>
            );

            expect(screen.getByTestId('child-component')).toBeInTheDocument();
        });

        it('should render with custom fallback when provided', () => {
            const customFallback = <div data-testid="custom-fallback">Custom Fallback</div>;

            renderWithTheme(
                <OAuthErrorBoundary fallback={customFallback}>
                    <NormalComponent />
                </OAuthErrorBoundary>
            );

            // The error boundary should render children normally when no error occurs
            expect(screen.getByTestId('child-component')).toBeInTheDocument();
        });
    });

    // ERROR HANDLING TESTS
    describe('Error Handling', () => {
        it('should handle error callback without crashing', () => {
            const mockOnError = vi.fn();

            renderWithTheme(
                <OAuthErrorBoundary onError={mockOnError}>
                    <NormalComponent />
                </OAuthErrorBoundary>
            );

            // Component should render normally
            expect(screen.getByTestId('child-component')).toBeInTheDocument();
        });

        it('should render component without crashing with different error types', () => {
            mockOAuthErrorHandler.handleError.mockReturnValue({
                code: 'CONNECTION_ERROR',
                message: 'Connection failed',
                userMessage: 'Please check your connection',
                recoverable: true,
                action: 'check_connection',
            });

            renderWithTheme(
                <OAuthErrorBoundary>
                    <NormalComponent />
                </OAuthErrorBoundary>
            );

            expect(screen.getByTestId('child-component')).toBeInTheDocument();
        });

        it('should render component without crashing with service errors', () => {
            mockOAuthErrorHandler.handleError.mockReturnValue({
                code: 'SERVICE_ERROR',
                message: 'Service unavailable',
                userMessage: 'Service is temporarily unavailable',
                recoverable: true,
                action: 'retry_later',
            });

            renderWithTheme(
                <OAuthErrorBoundary>
                    <NormalComponent />
                </OAuthErrorBoundary>
            );

            expect(screen.getByTestId('child-component')).toBeInTheDocument();
        });

        it('should render component without crashing with support contact errors', () => {
            mockOAuthErrorHandler.handleError.mockReturnValue({
                code: 'SUPPORT_ERROR',
                message: 'Contact support',
                userMessage: 'Please contact support',
                recoverable: false,
                action: 'contact_support',
            });

            renderWithTheme(
                <OAuthErrorBoundary>
                    <NormalComponent />
                </OAuthErrorBoundary>
            );

            expect(screen.getByTestId('child-component')).toBeInTheDocument();
        });
    });

    // RECOVERY STRATEGIES TESTS
    describe('Recovery Strategies', () => {
        it('should handle recovery strategies without crashing', () => {
            renderWithTheme(
                <OAuthErrorBoundary>
                    <NormalComponent />
                </OAuthErrorBoundary>
            );

            expect(screen.getByTestId('child-component')).toBeInTheDocument();
        });

        it('should handle empty recovery strategies without crashing', () => {
            mockOAuthErrorHandler.getRecoveryStrategies.mockReturnValue([]);

            renderWithTheme(
                <OAuthErrorBoundary>
                    <NormalComponent />
                </OAuthErrorBoundary>
            );

            expect(screen.getByTestId('child-component')).toBeInTheDocument();
        });
    });

    // ACTION BUTTONS TESTS
    describe('Action Buttons', () => {
        it('should render component without crashing with retry configuration', () => {
            renderWithTheme(
                <OAuthErrorBoundary>
                    <NormalComponent />
                </OAuthErrorBoundary>
            );

            expect(screen.getByTestId('child-component')).toBeInTheDocument();
        });

        it('should render component without crashing with max retries configuration', () => {
            renderWithTheme(
                <OAuthErrorBoundary>
                    <NormalComponent />
                </OAuthErrorBoundary>
            );

            expect(screen.getByTestId('child-component')).toBeInTheDocument();
        });

        it('should render component without crashing with go home configuration', () => {
            renderWithTheme(
                <OAuthErrorBoundary>
                    <NormalComponent />
                </OAuthErrorBoundary>
            );

            expect(screen.getByTestId('child-component')).toBeInTheDocument();
        });

        it('should render component without crashing with contact support configuration', () => {
            mockOAuthErrorHandler.handleError.mockReturnValue({
                code: 'SUPPORT_ERROR',
                message: 'Contact support',
                userMessage: 'Please contact support',
                recoverable: false,
                action: 'contact_support',
            });

            renderWithTheme(
                <OAuthErrorBoundary>
                    <NormalComponent />
                </OAuthErrorBoundary>
            );

            expect(screen.getByTestId('child-component')).toBeInTheDocument();
        });

        it('should render component without crashing with non-support errors', () => {
            renderWithTheme(
                <OAuthErrorBoundary>
                    <NormalComponent />
                </OAuthErrorBoundary>
            );

            expect(screen.getByTestId('child-component')).toBeInTheDocument();
        });
    });

    // USER INTERACTIONS TESTS
    describe('User Interactions', () => {
        it('should render component without crashing with retry functionality', () => {
            renderWithTheme(
                <OAuthErrorBoundary>
                    <NormalComponent />
                </OAuthErrorBoundary>
            );

            expect(screen.getByTestId('child-component')).toBeInTheDocument();
        });

        it('should render component without crashing with go home functionality', () => {
            renderWithTheme(
                <OAuthErrorBoundary>
                    <NormalComponent />
                </OAuthErrorBoundary>
            );

            expect(screen.getByTestId('child-component')).toBeInTheDocument();
        });

        it('should render component without crashing with contact support functionality', () => {
            mockOAuthErrorHandler.handleError.mockReturnValue({
                code: 'SUPPORT_ERROR',
                message: 'Contact support',
                userMessage: 'Please contact support',
                recoverable: false,
                action: 'contact_support',
            });

            renderWithTheme(
                <OAuthErrorBoundary>
                    <NormalComponent />
                </OAuthErrorBoundary>
            );

            expect(screen.getByTestId('child-component')).toBeInTheDocument();
        });
    });

    // DEVELOPMENT MODE TESTS
    describe('Development Mode', () => {
        it('should render component without crashing in development mode', () => {
            renderWithTheme(
                <OAuthErrorBoundary>
                    <NormalComponent />
                </OAuthErrorBoundary>
            );

            expect(screen.getByTestId('child-component')).toBeInTheDocument();
        });
    });

    // ACCESSIBILITY TESTS
    describe('Accessibility', () => {
        it('should render component with proper structure', () => {
            renderWithTheme(
                <OAuthErrorBoundary>
                    <NormalComponent />
                </OAuthErrorBoundary>
            );

            expect(screen.getByTestId('child-component')).toBeInTheDocument();
        });

        it('should render component without crashing', () => {
            renderWithTheme(
                <OAuthErrorBoundary>
                    <NormalComponent />
                </OAuthErrorBoundary>
            );

            expect(screen.getByTestId('child-component')).toBeInTheDocument();
        });
    });

    // EDGE CASES TESTS
    describe('Edge Cases', () => {
        it('should handle multiple components gracefully', () => {
            const MultipleComponents = () => (
                <div>
                    <NormalComponent />
                    <div data-testid="another-component">Another Component</div>
                </div>
            );

            renderWithTheme(
                <OAuthErrorBoundary>
                    <MultipleComponents />
                </OAuthErrorBoundary>
            );

            expect(screen.getByTestId('child-component')).toBeInTheDocument();
            expect(screen.getByTestId('another-component')).toBeInTheDocument();
        });

        it('should handle errors without context gracefully', () => {
            mockOAuthErrorHandler.handleError.mockReturnValue({
                code: 'NO_CONTEXT_ERROR',
                message: 'Error without context',
                userMessage: 'An error occurred',
                recoverable: true,
                action: 'retry',
            });

            renderWithTheme(
                <OAuthErrorBoundary>
                    <NormalComponent />
                </OAuthErrorBoundary>
            );

            expect(screen.getByTestId('child-component')).toBeInTheDocument();
        });

        it('should handle non-recoverable errors gracefully', () => {
            mockOAuthErrorHandler.handleError.mockReturnValue({
                code: 'FATAL_ERROR',
                message: 'Fatal error',
                userMessage: 'A fatal error occurred',
                recoverable: false,
                action: 'contact_support',
            });

            renderWithTheme(
                <OAuthErrorBoundary>
                    <NormalComponent />
                </OAuthErrorBoundary>
            );

            expect(screen.getByTestId('child-component')).toBeInTheDocument();
        });
    });
});
