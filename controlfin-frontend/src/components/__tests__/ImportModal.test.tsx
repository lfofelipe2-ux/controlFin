/**
 * ImportModal Component Tests
 * 
 * Tests for the ImportModal component following ControlFin testing patterns
 * and BlockAI design system integration.
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ImportModal from '../ImportModal';

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
        transactions: [],
        addTransactions: vi.fn(),
    })),
}));

// Mock Papa Parse
vi.mock('papaparse', () => ({
    default: {
        parse: vi.fn(),
    },
}));

// Mock file reading
const mockFile = new File(['test,content'], 'test.csv', { type: 'text/csv' });
Object.defineProperty(window, 'FileReader', {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
        readAsText: vi.fn(),
        result: 'test,content',
        onload: null,
        onerror: null,
    })),
});

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

describe('ImportModal Component', () => {
    const defaultProps = {
        visible: true,
        onClose: vi.fn(),
        onImport: vi.fn(),
        loading: false,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    // BASIC RENDERING TESTS
    describe('Basic Rendering', () => {
        it('should render with default props', () => {
            renderWithTheme(<ImportModal {...defaultProps} />);

            expect(screen.getByText('import.title')).toBeInTheDocument();
            expect(screen.getByText('import.dragAndDrop')).toBeInTheDocument();
            expect(screen.getByText('import.supportedFormats')).toBeInTheDocument();
        });

        it('should render when visible is true', () => {
            renderWithTheme(<ImportModal {...defaultProps} visible={true} />);

            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        it('should not render when visible is false', () => {
            renderWithTheme(<ImportModal {...defaultProps} visible={false} />);

            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });

        it('should render upload area', () => {
            renderWithTheme(<ImportModal {...defaultProps} />);

            expect(screen.getByText('import.dragAndDrop')).toBeInTheDocument();
            expect(screen.getByText('import.clickToUpload')).toBeInTheDocument();
        });

        it('should render import options', () => {
            renderWithTheme(<ImportModal {...defaultProps} />);

            expect(screen.getByText('import.skipDuplicates')).toBeInTheDocument();
            expect(screen.getByText('import.updateExisting')).toBeInTheDocument();
            expect(screen.getByText('import.dateFormat')).toBeInTheDocument();
        });
    });

    // FILE UPLOAD TESTS
    describe('File Upload', () => {
        it('should handle file selection', async () => {
            renderWithTheme(<ImportModal {...defaultProps} />);

            const fileInput = screen.getByRole('textbox');
            fireEvent.change(fileInput, { target: { files: [mockFile] } });

            await waitFor(() => {
                expect(screen.getByText('test.csv')).toBeInTheDocument();
            });
        });

        it('should handle drag and drop', async () => {
            renderWithTheme(<ImportModal {...defaultProps} />);

            const dropArea = screen.getByText('import.dragAndDrop');
            fireEvent.dragOver(dropArea);
            fireEvent.drop(dropArea, { dataTransfer: { files: [mockFile] } });

            await waitFor(() => {
                expect(screen.getByText('test.csv')).toBeInTheDocument();
            });
        });

        it('should validate file type', async () => {
            const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });
            renderWithTheme(<ImportModal {...defaultProps} />);

            const fileInput = screen.getByRole('textbox');
            fireEvent.change(fileInput, { target: { files: [invalidFile] } });

            await waitFor(() => {
                expect(screen.getByText('import.error.invalidFileType')).toBeInTheDocument();
            });
        });

        it('should handle file size validation', async () => {
            const largeFile = new File(['x'.repeat(10000000)], 'large.csv', { type: 'text/csv' });
            renderWithTheme(<ImportModal {...defaultProps} />);

            const fileInput = screen.getByRole('textbox');
            fireEvent.change(fileInput, { target: { files: [largeFile] } });

            await waitFor(() => {
                expect(screen.getByText('import.error.fileTooLarge')).toBeInTheDocument();
            });
        });
    });

    // FILE PARSING TESTS
    describe('File Parsing', () => {
        it('should parse CSV file correctly', async () => {
            const Papa = await import('papaparse');
            const mockParse = vi.mocked(Papa.default.parse);
            mockParse.mockImplementation((data, callback) => {
                callback({
                    data: [
                        ['date', 'description', 'amount', 'type', 'category'],
                        ['2023-01-01', 'Test transaction', '100', 'expense', 'Food'],
                    ],
                    errors: [],
                });
            });

            renderWithTheme(<ImportModal {...defaultProps} />);

            const fileInput = screen.getByRole('textbox');
            fireEvent.change(fileInput, { target: { files: [mockFile] } });

            await waitFor(() => {
                expect(mockParse).toHaveBeenCalled();
            });
        });

        it('should handle parsing errors', async () => {
            const Papa = await import('papaparse');
            const mockParse = vi.mocked(Papa.default.parse);
            mockParse.mockImplementation((data, callback) => {
                callback({
                    data: [],
                    errors: [{ row: 1, message: 'Invalid date format' }],
                });
            });

            renderWithTheme(<ImportModal {...defaultProps} />);

            const fileInput = screen.getByRole('textbox');
            fireEvent.change(fileInput, { target: { files: [mockFile] } });

            await waitFor(() => {
                expect(screen.getByText('import.error.parsingFailed')).toBeInTheDocument();
            });
        });

        it('should display parsed transactions in table', async () => {
            const Papa = await import('papaparse');
            const mockParse = vi.mocked(Papa.default.parse);
            mockParse.mockImplementation((data, callback) => {
                callback({
                    data: [
                        ['date', 'description', 'amount', 'type', 'category'],
                        ['2023-01-01', 'Test transaction', '100', 'expense', 'Food'],
                    ],
                    errors: [],
                });
            });

            renderWithTheme(<ImportModal {...defaultProps} />);

            const fileInput = screen.getByRole('textbox');
            fireEvent.change(fileInput, { target: { files: [mockFile] } });

            await waitFor(() => {
                expect(screen.getByText('Test transaction')).toBeInTheDocument();
                expect(screen.getByText('100')).toBeInTheDocument();
                expect(screen.getByText('expense')).toBeInTheDocument();
            });
        });
    });

    // FORM INTERACTIONS TESTS
    describe('Form Interactions', () => {
        it('should handle skip duplicates checkbox', () => {
            renderWithTheme(<ImportModal {...defaultProps} />);

            const checkbox = screen.getByRole('checkbox', { name: 'import.skipDuplicates' });
            fireEvent.click(checkbox);

            expect(checkbox).toBeChecked();
        });

        it('should handle update existing checkbox', () => {
            renderWithTheme(<ImportModal {...defaultProps} />);

            const checkbox = screen.getByRole('checkbox', { name: 'import.updateExisting' });
            fireEvent.click(checkbox);

            expect(checkbox).toBeChecked();
        });

        it('should handle date format selection', async () => {
            renderWithTheme(<ImportModal {...defaultProps} />);

            const dateFormatSelect = screen.getByRole('combobox');
            fireEvent.click(dateFormatSelect);

            await waitFor(() => {
                expect(screen.getByText('DD/MM/YYYY')).toBeInTheDocument();
                expect(screen.getByText('MM/DD/YYYY')).toBeInTheDocument();
                expect(screen.getByText('YYYY-MM-DD')).toBeInTheDocument();
            });
        });

        it('should handle delimiter selection', async () => {
            renderWithTheme(<ImportModal {...defaultProps} />);

            const delimiterSelect = screen.getAllByRole('combobox')[1];
            fireEvent.click(delimiterSelect);

            await waitFor(() => {
                expect(screen.getByText(',')).toBeInTheDocument();
                expect(screen.getByText(';')).toBeInTheDocument();
                expect(screen.getByText('|')).toBeInTheDocument();
            });
        });
    });

    // CALLBACK FUNCTIONS TESTS
    describe('Callback Functions', () => {
        it('should call onClose when cancel button is clicked', () => {
            const mockOnClose = vi.fn();
            renderWithTheme(<ImportModal {...defaultProps} onClose={mockOnClose} />);

            const cancelButton = screen.getByRole('button', { name: 'common.cancel' });
            fireEvent.click(cancelButton);

            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });

        it('should call onImport with correct options when import button is clicked', async () => {
            const mockOnImport = vi.fn();
            renderWithTheme(<ImportModal {...defaultProps} onImport={mockOnImport} />);

            // Upload a file first
            const fileInput = screen.getByRole('textbox');
            fireEvent.change(fileInput, { target: { files: [mockFile] } });

            await waitFor(() => {
                const importButton = screen.getByRole('button', { name: 'import.importButton' });
                fireEvent.click(importButton);

                expect(mockOnImport).toHaveBeenCalledWith(
                    mockFile,
                    expect.objectContaining({
                        skipDuplicates: false,
                        updateExisting: false,
                        dateFormat: 'DD/MM/YYYY',
                        delimiter: ',',
                    })
                );
            });
        });

        it('should call onClose when modal mask is clicked', () => {
            const mockOnClose = vi.fn();
            renderWithTheme(<ImportModal {...defaultProps} onClose={mockOnClose} />);

            const modal = screen.getByRole('dialog');
            fireEvent.click(modal);

            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });
    });

    // LOADING STATES TESTS
    describe('Loading States', () => {
        it('should show loading state when loading is true', () => {
            renderWithTheme(<ImportModal {...defaultProps} loading={true} />);

            const importButton = screen.getByRole('button', { name: 'import.importing' });
            expect(importButton).toBeDisabled();
        });

        it('should show normal state when loading is false', () => {
            renderWithTheme(<ImportModal {...defaultProps} loading={false} />);

            const importButton = screen.getByRole('button', { name: 'import.importButton' });
            expect(importButton).not.toBeDisabled();
        });
    });

    // VALIDATION TESTS
    describe('Validation', () => {
        it('should validate required file selection', async () => {
            renderWithTheme(<ImportModal {...defaultProps} />);

            const importButton = screen.getByRole('button', { name: 'import.importButton' });
            fireEvent.click(importButton);

            await waitFor(() => {
                expect(screen.getByText('import.validation.fileRequired')).toBeInTheDocument();
            });
        });

        it('should validate file format', async () => {
            const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });
            renderWithTheme(<ImportModal {...defaultProps} />);

            const fileInput = screen.getByRole('textbox');
            fireEvent.change(fileInput, { target: { files: [invalidFile] } });

            await waitFor(() => {
                expect(screen.getByText('import.error.invalidFileType')).toBeInTheDocument();
            });
        });

        it('should validate parsed data', async () => {
            const Papa = await import('papaparse');
            const mockParse = vi.mocked(Papa.default.parse);
            mockParse.mockImplementation((data, callback) => {
                callback({
                    data: [
                        ['invalid', 'data', 'format'],
                    ],
                    errors: [],
                });
            });

            renderWithTheme(<ImportModal {...defaultProps} />);

            const fileInput = screen.getByRole('textbox');
            fireEvent.change(fileInput, { target: { files: [mockFile] } });

            await waitFor(() => {
                expect(screen.getByText('import.error.invalidDataFormat')).toBeInTheDocument();
            });
        });
    });

    // ACCESSIBILITY TESTS
    describe('Accessibility', () => {
        it('should have proper ARIA labels', () => {
            renderWithTheme(<ImportModal {...defaultProps} />);

            const modal = screen.getByRole('dialog');
            expect(modal).toHaveAttribute('aria-modal', 'true');
        });

        it('should support keyboard navigation', () => {
            renderWithTheme(<ImportModal {...defaultProps} />);

            const firstButton = screen.getByRole('button', { name: 'common.cancel' });
            firstButton.focus();

            expect(firstButton).toHaveFocus();
        });

        it('should have proper form field associations', () => {
            renderWithTheme(<ImportModal {...defaultProps} />);

            const fileInput = screen.getByRole('textbox');
            expect(fileInput).toHaveAttribute('aria-required', 'true');
        });
    });

    // EDGE CASES TESTS
    describe('Edge Cases', () => {
        it('should handle empty file gracefully', async () => {
            const emptyFile = new File([''], 'empty.csv', { type: 'text/csv' });
            renderWithTheme(<ImportModal {...defaultProps} />);

            const fileInput = screen.getByRole('textbox');
            fireEvent.change(fileInput, { target: { files: [emptyFile] } });

            await waitFor(() => {
                expect(screen.getByText('import.error.emptyFile')).toBeInTheDocument();
            });
        });

        it('should handle corrupted file gracefully', async () => {
            const corruptedFile = new File(['corrupted,data\ninvalid'], 'corrupted.csv', { type: 'text/csv' });
            renderWithTheme(<ImportModal {...defaultProps} />);

            const fileInput = screen.getByRole('textbox');
            fireEvent.change(fileInput, { target: { files: [corruptedFile] } });

            await waitFor(() => {
                expect(screen.getByText('import.error.fileCorrupted')).toBeInTheDocument();
            });
        });

        it('should handle very large files', async () => {
            const largeFile = new File(['x'.repeat(50000000)], 'large.csv', { type: 'text/csv' });
            renderWithTheme(<ImportModal {...defaultProps} />);

            const fileInput = screen.getByRole('textbox');
            fireEvent.change(fileInput, { target: { files: [largeFile] } });

            await waitFor(() => {
                expect(screen.getByText('import.error.fileTooLarge')).toBeInTheDocument();
            });
        });
    });

    // INTEGRATION TESTS
    describe('Integration', () => {
        it('should work with transaction store', () => {
            renderWithTheme(<ImportModal {...defaultProps} />);

            // Should display categories from store
            expect(screen.getByText('Food')).toBeInTheDocument();
            expect(screen.getByText('Salary')).toBeInTheDocument();
        });

        it('should handle store updates', async () => {
            const { rerender } = renderWithTheme(<ImportModal {...defaultProps} />);

            // Update store with new categories
            const { useTransactionStore } = require('../../stores/transactionStore');
            const updatedStore = {
                categories: [
                    { id: '1', name: 'Food', type: 'expense' },
                    { id: '2', name: 'Salary', type: 'income' },
                    { id: '3', name: 'Transport', type: 'expense' },
                ],
                transactions: [],
                addTransactions: vi.fn(),
            };
            vi.mocked(useTransactionStore).mockReturnValue(updatedStore);

            rerender(<ImportModal {...defaultProps} />);

            await waitFor(() => {
                expect(screen.getByText('Transport')).toBeInTheDocument();
            });
        });
    });
});
