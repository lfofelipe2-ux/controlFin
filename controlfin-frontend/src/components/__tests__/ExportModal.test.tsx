/**
 * ExportModal Component Tests
 * 
 * Tests for the ExportModal component following ControlFin testing patterns
 * and BlockAI design system integration.
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ExportModal from '../ExportModal';

// Mock react-i18next for consistent translation testing
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: {
            changeLanguage: vi.fn(),
        },
    }),
}));

// Mock Zustand store
vi.mock('../../stores/transactionStore', () => ({
    useTransactionStore: vi.fn(() => ({
        categories: [
            { id: '1', name: 'Food', type: 'expense' },
            { id: '2', name: 'Salary', type: 'income' },
        ],
        transactions: [
            { id: '1', amount: 100, type: 'expense', categoryId: '1' },
            { id: '2', amount: 2000, type: 'income', categoryId: '2' },
        ],
    })),
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

describe('ExportModal Component', () => {
    const defaultProps = {
        visible: true,
        onClose: vi.fn(),
        onExport: vi.fn(),
        loading: false,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    // BASIC RENDERING TESTS
    describe('Basic Rendering', () => {
        it('should render with default props', () => {
            renderWithTheme(<ExportModal {...defaultProps} />);

            expect(screen.getByText('export.title')).toBeInTheDocument();
            expect(screen.getByText('export.format')).toBeInTheDocument();
            expect(screen.getByText('export.dateRange')).toBeInTheDocument();
        });

        it('should render when visible is true', () => {
            renderWithTheme(<ExportModal {...defaultProps} visible={true} />);

            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        it('should not render when visible is false', () => {
            renderWithTheme(<ExportModal {...defaultProps} visible={false} />);

            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });

        it('should render export button', () => {
            renderWithTheme(<ExportModal {...defaultProps} />);

            expect(screen.getByRole('button', { name: 'export.exportButton' })).toBeInTheDocument();
        });

        it('should render cancel button', () => {
            renderWithTheme(<ExportModal {...defaultProps} />);

            expect(screen.getByRole('button', { name: 'common.cancel' })).toBeInTheDocument();
        });
    });

    // FORM INTERACTIONS TESTS
    describe('Form Interactions', () => {
        it('should handle format selection', async () => {
            renderWithTheme(<ExportModal {...defaultProps} />);

            const formatSelect = screen.getByRole('combobox');
            fireEvent.click(formatSelect);

            await waitFor(() => {
                expect(screen.getByText('CSV')).toBeInTheDocument();
                expect(screen.getByText('Excel')).toBeInTheDocument();
                expect(screen.getByText('JSON')).toBeInTheDocument();
            });
        });

        it('should handle date range selection', async () => {
            renderWithTheme(<ExportModal {...defaultProps} />);

            const dateRangePicker = screen.getByRole('textbox');
            fireEvent.click(dateRangePicker);

            await waitFor(() => {
                expect(screen.getByRole('dialog')).toBeInTheDocument();
            });
        });

        it('should handle amount range slider', () => {
            renderWithTheme(<ExportModal {...defaultProps} />);

            const slider = screen.getByRole('slider');
            expect(slider).toBeInTheDocument();
        });

        it('should handle category selection', async () => {
            renderWithTheme(<ExportModal {...defaultProps} />);

            const categorySelect = screen.getAllByRole('combobox')[1]; // Second select is categories
            fireEvent.click(categorySelect);

            await waitFor(() => {
                expect(screen.getByText('Food')).toBeInTheDocument();
                expect(screen.getByText('Salary')).toBeInTheDocument();
            });
        });

        it('should handle transaction type selection', async () => {
            renderWithTheme(<ExportModal {...defaultProps} />);

            const typeSelect = screen.getAllByRole('combobox')[2]; // Third select is types
            fireEvent.click(typeSelect);

            await waitFor(() => {
                expect(screen.getByText('Income')).toBeInTheDocument();
                expect(screen.getByText('Expense')).toBeInTheDocument();
            });
        });

        it('should handle include metadata checkbox', () => {
            renderWithTheme(<ExportModal {...defaultProps} />);

            const checkbox = screen.getByRole('checkbox');
            fireEvent.click(checkbox);

            expect(checkbox).toBeChecked();
        });
    });

    // CALLBACK FUNCTIONS TESTS
    describe('Callback Functions', () => {
        it('should call onClose when cancel button is clicked', () => {
            const mockOnClose = vi.fn();
            renderWithTheme(<ExportModal {...defaultProps} onClose={mockOnClose} />);

            const cancelButton = screen.getByRole('button', { name: 'common.cancel' });
            fireEvent.click(cancelButton);

            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });

        it('should call onClose when modal mask is clicked', () => {
            const mockOnClose = vi.fn();
            renderWithTheme(<ExportModal {...defaultProps} onClose={mockOnClose} />);

            const modal = screen.getByRole('dialog');
            fireEvent.click(modal);

            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });

        it('should call onExport with correct options when export button is clicked', async () => {
            const mockOnExport = vi.fn();
            renderWithTheme(<ExportModal {...defaultProps} onExport={mockOnExport} />);

            // Fill form with test data
            const formatSelect = screen.getByRole('combobox');
            fireEvent.click(formatSelect);

            await waitFor(() => {
                fireEvent.click(screen.getByText('CSV'));
            });

            const exportButton = screen.getByRole('button', { name: 'export.exportButton' });
            fireEvent.click(exportButton);

            await waitFor(() => {
                expect(mockOnExport).toHaveBeenCalledWith(
                    expect.objectContaining({
                        format: 'csv',
                        includeMetadata: false,
                    })
                );
            });
        });
    });

    // LOADING STATES TESTS
    describe('Loading States', () => {
        it('should show loading state when loading is true', () => {
            renderWithTheme(<ExportModal {...defaultProps} loading={true} />);

            const exportButton = screen.getByRole('button', { name: 'export.exporting' });
            expect(exportButton).toBeDisabled();
        });

        it('should show normal state when loading is false', () => {
            renderWithTheme(<ExportModal {...defaultProps} loading={false} />);

            const exportButton = screen.getByRole('button', { name: 'export.exportButton' });
            expect(exportButton).not.toBeDisabled();
        });
    });

    // FORM VALIDATION TESTS
    describe('Form Validation', () => {
        it('should validate required fields', async () => {
            renderWithTheme(<ExportModal {...defaultProps} />);

            const exportButton = screen.getByRole('button', { name: 'export.exportButton' });
            fireEvent.click(exportButton);

            // Form should validate and show errors if required fields are missing
            await waitFor(() => {
                expect(screen.getByText('export.validation.formatRequired')).toBeInTheDocument();
            });
        });

        it('should validate date range', async () => {
            renderWithTheme(<ExportModal {...defaultProps} />);

            const exportButton = screen.getByRole('button', { name: 'export.exportButton' });
            fireEvent.click(exportButton);

            await waitFor(() => {
                expect(screen.getByText('export.validation.dateRangeRequired')).toBeInTheDocument();
            });
        });
    });

    // ACCESSIBILITY TESTS
    describe('Accessibility', () => {
        it('should have proper ARIA labels', () => {
            renderWithTheme(<ExportModal {...defaultProps} />);

            const modal = screen.getByRole('dialog');
            expect(modal).toHaveAttribute('aria-modal', 'true');
        });

        it('should support keyboard navigation', () => {
            renderWithTheme(<ExportModal {...defaultProps} />);

            const firstButton = screen.getByRole('button', { name: 'common.cancel' });
            firstButton.focus();

            expect(firstButton).toHaveFocus();
        });

        it('should have proper form field associations', () => {
            renderWithTheme(<ExportModal {...defaultProps} />);

            const formatSelect = screen.getByRole('combobox');
            expect(formatSelect).toHaveAttribute('aria-required', 'true');
        });
    });

    // EDGE CASES TESTS
    describe('Edge Cases', () => {
        it('should handle empty categories gracefully', () => {
            const { useTransactionStore } = require('../../stores/transactionStore');
            const emptyStore = { categories: [], transactions: [] };
            vi.mocked(useTransactionStore).mockReturnValue(emptyStore);

            renderWithTheme(<ExportModal {...defaultProps} />);

            expect(screen.getByText('export.noCategoriesAvailable')).toBeInTheDocument();
        });

        it('should handle empty transactions gracefully', () => {
            const { useTransactionStore } = require('../../stores/transactionStore');
            const emptyStore = {
                categories: [
                    { id: '1', name: 'Food', type: 'expense' },
                    { id: '2', name: 'Salary', type: 'income' },
                ],
                transactions: []
            };
            vi.mocked(useTransactionStore).mockReturnValue(emptyStore);

            renderWithTheme(<ExportModal {...defaultProps} />);

            expect(screen.getByText('export.noTransactionsAvailable')).toBeInTheDocument();
        });

        it('should handle very large amount ranges', () => {
            renderWithTheme(<ExportModal {...defaultProps} />);

            const slider = screen.getByRole('slider');
            fireEvent.change(slider, { target: { value: 1000000 } });

            expect(slider).toHaveValue(1000000);
        });
    });

    // INTEGRATION TESTS
    describe('Integration', () => {
        it('should work with transaction store', () => {
            renderWithTheme(<ExportModal {...defaultProps} />);

            // Should display categories from store
            expect(screen.getByText('Food')).toBeInTheDocument();
            expect(screen.getByText('Salary')).toBeInTheDocument();
        });

        it('should handle store updates', async () => {
            const { rerender } = renderWithTheme(<ExportModal {...defaultProps} />);

            // Update store with new categories
            const { useTransactionStore } = require('../../stores/transactionStore');
            const updatedStore = {
                categories: [
                    { id: '1', name: 'Food', type: 'expense' },
                    { id: '2', name: 'Salary', type: 'income' },
                    { id: '3', name: 'Transport', type: 'expense' },
                ],
                transactions: [
                    { id: '1', amount: 100, type: 'expense', categoryId: '1' },
                    { id: '2', amount: 2000, type: 'income', categoryId: '2' },
                ],
            };
            vi.mocked(useTransactionStore).mockReturnValue(updatedStore);

            rerender(<ExportModal {...defaultProps} />);

            await waitFor(() => {
                expect(screen.getByText('Transport')).toBeInTheDocument();
            });
        });
    });
});
