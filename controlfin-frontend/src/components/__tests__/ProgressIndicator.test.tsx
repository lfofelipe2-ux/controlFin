/**
 * ProgressIndicator Component Tests
 * 
 * Tests for the ProgressIndicator component following ControlFin testing patterns
 * and BlockAI design system integration.
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProgressIndicator from '../ProgressIndicator';

// Mock react-i18next for consistent translation testing
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: {
            changeLanguage: vi.fn(),
        },
    }),
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

describe('ProgressIndicator Component', () => {
    const defaultProps = {
        visible: true,
        progress: 50,
        message: 'Processing...',
        status: 'active' as const,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    // BASIC RENDERING TESTS
    describe('Basic Rendering', () => {
        it('should render with default props', () => {
            renderWithTheme(<ProgressIndicator {...defaultProps} />);

            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByText('Processing...')).toBeInTheDocument();
            expect(screen.getByRole('progressbar')).toBeInTheDocument();
        });

        it('should render when visible is true', () => {
            renderWithTheme(<ProgressIndicator {...defaultProps} visible={true} />);

            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        it('should not render when visible is false', () => {
            renderWithTheme(<ProgressIndicator {...defaultProps} visible={false} />);

            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });

        it('should display progress percentage', () => {
            renderWithTheme(<ProgressIndicator {...defaultProps} progress={75} />);

            expect(screen.getByText('75%')).toBeInTheDocument();
        });

        it('should display custom message', () => {
            renderWithTheme(<ProgressIndicator {...defaultProps} message="Custom message" />);

            expect(screen.getByText('Custom message')).toBeInTheDocument();
        });
    });

    // STATUS ICON TESTS
    describe('Status Icons', () => {
        it('should show loading icon for active status', () => {
            renderWithTheme(<ProgressIndicator {...defaultProps} status="active" />);

            const loadingIcon = screen.getByTestId('loading-icon');
            expect(loadingIcon).toBeInTheDocument();
        });

        it('should show success icon for success status', () => {
            renderWithTheme(<ProgressIndicator {...defaultProps} status="success" />);

            const successIcon = screen.getByTestId('success-icon');
            expect(successIcon).toBeInTheDocument();
        });

        it('should show error icon for exception status', () => {
            renderWithTheme(<ProgressIndicator {...defaultProps} status="exception" />);

            const errorIcon = screen.getByTestId('error-icon');
            expect(errorIcon).toBeInTheDocument();
        });
    });

    // PROGRESS BAR TESTS
    describe('Progress Bar', () => {
        it('should display correct progress value', () => {
            renderWithTheme(<ProgressIndicator {...defaultProps} progress={30} />);

            const progressBar = screen.getByRole('progressbar');
            expect(progressBar).toHaveAttribute('aria-valuenow', '30');
        });

        it('should handle 0% progress', () => {
            renderWithTheme(<ProgressIndicator {...defaultProps} progress={0} />);

            const progressBar = screen.getByRole('progressbar');
            expect(progressBar).toHaveAttribute('aria-valuenow', '0');
        });

        it('should handle 100% progress', () => {
            renderWithTheme(<ProgressIndicator {...defaultProps} progress={100} />);

            const progressBar = screen.getByRole('progressbar');
            expect(progressBar).toHaveAttribute('aria-valuenow', '100');
        });

        it('should handle progress over 100%', () => {
            renderWithTheme(<ProgressIndicator {...defaultProps} progress={150} />);

            const progressBar = screen.getByRole('progressbar');
            expect(progressBar).toHaveAttribute('aria-valuenow', '150');
        });

        it('should handle negative progress', () => {
            renderWithTheme(<ProgressIndicator {...defaultProps} progress={-10} />);

            const progressBar = screen.getByRole('progressbar');
            expect(progressBar).toHaveAttribute('aria-valuenow', '-10');
        });
    });

    // STATUS COLOR TESTS
    describe('Status Colors', () => {
        it('should apply active color for active status', () => {
            renderWithTheme(<ProgressIndicator {...defaultProps} status="active" />);

            const progressBar = screen.getByRole('progressbar');
            expect(progressBar).toHaveClass('ant-progress-status-active');
        });

        it('should apply success color for success status', () => {
            renderWithTheme(<ProgressIndicator {...defaultProps} status="success" />);

            const progressBar = screen.getByRole('progressbar');
            expect(progressBar).toHaveClass('ant-progress-status-success');
        });

        it('should apply exception color for exception status', () => {
            renderWithTheme(<ProgressIndicator {...defaultProps} status="exception" />);

            const progressBar = screen.getByRole('progressbar');
            expect(progressBar).toHaveClass('ant-progress-status-exception');
        });
    });

    // BUTTON INTERACTIONS TESTS
    describe('Button Interactions', () => {
        it('should show cancel button when onCancel is provided and status is active', () => {
            const mockOnCancel = vi.fn();
            renderWithTheme(
                <ProgressIndicator {...defaultProps} status="active" onCancel={mockOnCancel} />
            );

            const cancelButton = screen.getByRole('button', { name: 'common.cancel' });
            expect(cancelButton).toBeInTheDocument();
        });

        it('should not show cancel button when onCancel is not provided', () => {
            renderWithTheme(<ProgressIndicator {...defaultProps} status="active" />);

            expect(screen.queryByRole('button', { name: 'common.cancel' })).not.toBeInTheDocument();
        });

        it('should not show cancel button when status is not active', () => {
            const mockOnCancel = vi.fn();
            renderWithTheme(
                <ProgressIndicator {...defaultProps} status="success" onCancel={mockOnCancel} />
            );

            expect(screen.queryByRole('button', { name: 'common.cancel' })).not.toBeInTheDocument();
        });

        it('should call onCancel when cancel button is clicked', () => {
            const mockOnCancel = vi.fn();
            renderWithTheme(
                <ProgressIndicator {...defaultProps} status="active" onCancel={mockOnCancel} />
            );

            const cancelButton = screen.getByRole('button', { name: 'common.cancel' });
            fireEvent.click(cancelButton);

            expect(mockOnCancel).toHaveBeenCalledTimes(1);
        });

        it('should show close button when onClose is provided and status is complete', () => {
            const mockOnClose = vi.fn();
            renderWithTheme(
                <ProgressIndicator {...defaultProps} status="success" onClose={mockOnClose} />
            );

            const closeButton = screen.getByRole('button', { name: 'common.close' });
            expect(closeButton).toBeInTheDocument();
        });

        it('should call onClose when close button is clicked', () => {
            const mockOnClose = vi.fn();
            renderWithTheme(
                <ProgressIndicator {...defaultProps} status="success" onClose={mockOnClose} />
            );

            const closeButton = screen.getByRole('button', { name: 'common.close' });
            fireEvent.click(closeButton);

            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });
    });

    // COMPLETION STATE TESTS
    describe('Completion State', () => {
        it('should show completion message for success status', () => {
            renderWithTheme(
                <ProgressIndicator {...defaultProps} status="success" message="Completed successfully!" />
            );

            expect(screen.getByText('Completed successfully!')).toBeInTheDocument();
        });

        it('should show error message for exception status', () => {
            renderWithTheme(
                <ProgressIndicator {...defaultProps} status="exception" message="An error occurred!" />
            );

            expect(screen.getByText('An error occurred!')).toBeInTheDocument();
        });

        it('should show progress as complete for success status', () => {
            renderWithTheme(
                <ProgressIndicator {...defaultProps} status="success" progress={100} />
            );

            const progressBar = screen.getByRole('progressbar');
            expect(progressBar).toHaveAttribute('aria-valuenow', '100');
        });
    });

    // ACCESSIBILITY TESTS
    describe('Accessibility', () => {
        it('should have proper ARIA labels', () => {
            renderWithTheme(<ProgressIndicator {...defaultProps} />);

            const modal = screen.getByRole('dialog');
            expect(modal).toHaveAttribute('aria-modal', 'true');
        });

        it('should have proper progress bar accessibility', () => {
            renderWithTheme(<ProgressIndicator {...defaultProps} />);

            const progressBar = screen.getByRole('progressbar');
            expect(progressBar).toHaveAttribute('aria-valuemin', '0');
            expect(progressBar).toHaveAttribute('aria-valuemax', '100');
            expect(progressBar).toHaveAttribute('aria-valuenow', '50');
        });

        it('should support keyboard navigation', () => {
            const mockOnCancel = vi.fn();
            renderWithTheme(
                <ProgressIndicator {...defaultProps} status="active" onCancel={mockOnCancel} />
            );

            const cancelButton = screen.getByRole('button', { name: 'common.cancel' });
            cancelButton.focus();

            expect(cancelButton).toHaveFocus();
        });

        it('should have proper button labels', () => {
            const mockOnCancel = vi.fn();
            const mockOnClose = vi.fn();
            renderWithTheme(
                <ProgressIndicator
                    {...defaultProps}
                    status="active"
                    onCancel={mockOnCancel}
                    onClose={mockOnClose}
                />
            );

            expect(screen.getByRole('button', { name: 'common.cancel' })).toBeInTheDocument();
        });
    });

    // EDGE CASES TESTS
    describe('Edge Cases', () => {
        it('should handle very long messages', () => {
            const longMessage = 'A'.repeat(1000);
            renderWithTheme(<ProgressIndicator {...defaultProps} message={longMessage} />);

            expect(screen.getByText(longMessage)).toBeInTheDocument();
        });

        it('should handle empty message', () => {
            renderWithTheme(<ProgressIndicator {...defaultProps} message="" />);

            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        it('should handle undefined message', () => {
            renderWithTheme(<ProgressIndicator {...defaultProps} message={undefined as any} />);

            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        it('should handle rapid status changes', async () => {
            const { rerender } = renderWithTheme(<ProgressIndicator {...defaultProps} status="active" />);

            expect(screen.getByTestId('loading-icon')).toBeInTheDocument();

            rerender(<ProgressIndicator {...defaultProps} status="success" />);

            await waitFor(() => {
                expect(screen.getByTestId('success-icon')).toBeInTheDocument();
            });
        });
    });

    // ANIMATION TESTS
    describe('Animation', () => {
        it('should show progress animation for active status', () => {
            renderWithTheme(<ProgressIndicator {...defaultProps} status="active" />);

            const progressBar = screen.getByRole('progressbar');
            expect(progressBar).toHaveClass('ant-progress-show-info');
        });

        it('should not show progress animation for completed status', () => {
            renderWithTheme(<ProgressIndicator {...defaultProps} status="success" />);

            const progressBar = screen.getByRole('progressbar');
            expect(progressBar).not.toHaveClass('ant-progress-active');
        });
    });

    // INTEGRATION TESTS
    describe('Integration', () => {
        it('should work with different progress values', () => {
            const progressValues = [0, 25, 50, 75, 100];

            progressValues.forEach(progress => {
                const { unmount } = renderWithTheme(
                    <ProgressIndicator {...defaultProps} progress={progress} />
                );

                const progressBar = screen.getByRole('progressbar');
                expect(progressBar).toHaveAttribute('aria-valuenow', progress.toString());

                unmount();
            });
        });

        it('should handle all status types', () => {
            const statuses = ['active', 'success', 'exception'] as const;

            statuses.forEach(status => {
                const { unmount } = renderWithTheme(
                    <ProgressIndicator {...defaultProps} status={status} />
                );

                expect(screen.getByRole('dialog')).toBeInTheDocument();

                unmount();
            });
        });
    });
});
