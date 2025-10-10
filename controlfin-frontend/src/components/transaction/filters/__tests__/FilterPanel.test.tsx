import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useTransactionStore } from '../../../../stores/transactionStore';
import { FilterPanel } from '../FilterPanel';

// Mock react-i18next using centralized mock
vi.mock('react-i18next', () => import('../../../../__mocks__/react-i18next'));

// Mock the transaction store
vi.mock('../../../../stores/transactionStore', () => ({
    useTransactionStore: vi.fn(),
}));

// Mock dayjs using centralized mock
vi.mock('dayjs', () => import('../../../../__mocks__/dayjs'));

const mockUseTranslation = vi.mocked(useTranslation);
const mockUseTransactionStore = vi.mocked(useTransactionStore);

describe('FilterPanel', () => {
    const mockOnApplyFilters = vi.fn();
    const mockOnClearFilters = vi.fn();
    const mockOnSavePreset = vi.fn();
    const mockOnLoadPreset = vi.fn();

    const mockPresets = [
        {
            name: 'Recent Expenses',
            filters: {
                search: '',
                category: null,
                paymentMethod: null,
                type: 'expense' as const,
                dateRange: ['2024-01-01', '2024-01-31'] as [string, string],
                amountRange: null,
                tags: [],
                isRecurring: null
            }
        },
        {
            name: 'High Amount',
            filters: {
                search: '',
                category: null,
                paymentMethod: null,
                type: 'all' as const,
                dateRange: null,
                amountRange: [1000, 10000] as [number, number],
                tags: [],
                isRecurring: null
            }
        },
    ];

    const mockCategories = [
        { id: '1', name: 'Food', type: 'expense' },
        { id: '2', name: 'Salary', type: 'income' },
        { id: '3', name: 'Transfer', type: 'transfer' },
    ];

    const mockPaymentMethods = [
        { id: '1', name: 'Credit Card' },
        { id: '2', name: 'Cash' },
        { id: '3', name: 'Bank Transfer' },
    ];

    const mockFilters = {
        type: 'expense',
        categoryId: '',
        paymentMethodId: '',
        minAmount: 0,
        maxAmount: 10000,
        dateRange: { start: '', end: '' },
        tags: [],
        search: '',
    };

    beforeEach(() => {
        vi.clearAllMocks();

        mockUseTranslation.mockReturnValue({
            t: (key: string) => {
                const mockT = (key: string) => key;
                Object.defineProperty(mockT, '$TFunctionBrand', {
                    value: Symbol('TFunctionBrand'),
                    writable: false,
                    enumerable: false,
                    configurable: false
                });
                return mockT;
            },
            i18n: {} as any,
            ready: true,
        });

        mockUseTransactionStore.mockReturnValue({
            filters: mockFilters,
            categories: mockCategories,
            paymentMethods: mockPaymentMethods,
            setFilters: vi.fn(),
            // Add other required properties
            formData: {} as any,
            formMode: 'create',
            setFormData: vi.fn(),
            resetForm: vi.fn(),
            transactions: [],
            loadTransactions: vi.fn(),
            createTransaction: vi.fn(),
            updateTransaction: vi.fn(),
            deleteTransaction: vi.fn(),
            loadCategories: vi.fn(),
            loadPaymentMethods: vi.fn(),
        });
    });

    it('should render filter panel with all filter options', () => {
        render(
            <FilterPanel
                onApplyFilters={mockOnApplyFilters}
                onClearFilters={mockOnClearFilters}
                onSavePreset={mockOnSavePreset}
                onLoadPreset={mockOnLoadPreset}
                presets={mockPresets}
            />
        );

        expect(screen.getByText('transactions.filters.title')).toBeInTheDocument();
        expect(screen.getByText('transactions.filters.type')).toBeInTheDocument();
        expect(screen.getByText('transactions.filters.category')).toBeInTheDocument();
        expect(screen.getByText('transactions.filters.paymentMethod')).toBeInTheDocument();
        expect(screen.getByText('transactions.filters.amountRange')).toBeInTheDocument();
        expect(screen.getByText('transactions.filters.dateRange')).toBeInTheDocument();
    });

    it('should render filter buttons', () => {
        render(
            <FilterPanel
                onApplyFilters={mockOnApplyFilters}
                onClearFilters={mockOnClearFilters}
                onSavePreset={mockOnSavePreset}
                onLoadPreset={mockOnLoadPreset}
                presets={mockPresets}
            />
        );

        expect(screen.getByText('transactions.filters.apply')).toBeInTheDocument();
        expect(screen.getByText('transactions.filters.clear')).toBeInTheDocument();
    });

    it('should call onApplyFilters when apply button is clicked', () => {
        render(
            <FilterPanel
                onApplyFilters={mockOnApplyFilters}
                onClearFilters={mockOnClearFilters}
                onSavePreset={mockOnSavePreset}
                onLoadPreset={mockOnLoadPreset}
                presets={mockPresets}
            />
        );

        const applyButton = screen.getByText('transactions.filters.apply');
        fireEvent.click(applyButton);

        expect(mockOnApplyFilters).toHaveBeenCalledWith(mockFilters);
    });

    it('should call onClearFilters when clear button is clicked', () => {
        render(
            <FilterPanel
                onApplyFilters={mockOnApplyFilters}
                onClearFilters={mockOnClearFilters}
                onSavePreset={mockOnSavePreset}
                onLoadPreset={mockOnLoadPreset}
                presets={mockPresets}
            />
        );

        const clearButton = screen.getByText('transactions.filters.clear');
        fireEvent.click(clearButton);

        expect(mockOnClearFilters).toHaveBeenCalledTimes(1);
    });

    it('should render presets section', () => {
        render(
            <FilterPanel
                onApplyFilters={mockOnApplyFilters}
                onClearFilters={mockOnClearFilters}
                onSavePreset={mockOnSavePreset}
                onLoadPreset={mockOnLoadPreset}
                presets={mockPresets}
            />
        );

        expect(screen.getByText('transactions.filters.presets')).toBeInTheDocument();
        expect(screen.getByText('Recent Expenses')).toBeInTheDocument();
        expect(screen.getByText('High Amount')).toBeInTheDocument();
    });

    it('should call onLoadPreset when preset is clicked', () => {
        render(
            <FilterPanel
                onApplyFilters={mockOnApplyFilters}
                onClearFilters={mockOnClearFilters}
                onSavePreset={mockOnSavePreset}
                onLoadPreset={mockOnLoadPreset}
                presets={mockPresets}
            />
        );

        const presetButton = screen.getByText('Recent Expenses');
        fireEvent.click(presetButton);

        expect(mockOnLoadPreset).toHaveBeenCalledWith(mockPresets[0].filters);
    });

    it('should handle type filter change', () => {
        render(
            <FilterPanel
                onApplyFilters={mockOnApplyFilters}
                onClearFilters={mockOnClearFilters}
                onSavePreset={mockOnSavePreset}
                onLoadPreset={mockOnLoadPreset}
                presets={mockPresets}
            />
        );

        const typeSelect = screen.getByRole('combobox');
        fireEvent.change(typeSelect, { target: { value: 'income' } });

        expect(typeSelect).toHaveValue('income');
    });

    it('should handle category filter change', () => {
        render(
            <FilterPanel
                onApplyFilters={mockOnApplyFilters}
                onClearFilters={mockOnClearFilters}
                onSavePreset={mockOnSavePreset}
                onLoadPreset={mockOnLoadPreset}
                presets={mockPresets}
            />
        );

        const categorySelect = screen.getAllByRole('combobox')[1];
        fireEvent.change(categorySelect, { target: { value: '1' } });

        expect(categorySelect).toHaveValue('1');
    });

    it('should handle payment method filter change', () => {
        render(
            <FilterPanel
                onApplyFilters={mockOnApplyFilters}
                onClearFilters={mockOnClearFilters}
                onSavePreset={mockOnSavePreset}
                onLoadPreset={mockOnLoadPreset}
                presets={mockPresets}
            />
        );

        const paymentMethodSelect = screen.getAllByRole('combobox')[2];
        fireEvent.change(paymentMethodSelect, { target: { value: '1' } });

        expect(paymentMethodSelect).toHaveValue('1');
    });

    it('should handle amount range changes', () => {
        render(
            <FilterPanel
                onApplyFilters={mockOnApplyFilters}
                onClearFilters={mockOnClearFilters}
                onSavePreset={mockOnSavePreset}
                onLoadPreset={mockOnLoadPreset}
                presets={mockPresets}
            />
        );

        const minAmountInput = screen.getByDisplayValue('0');
        const maxAmountInput = screen.getByDisplayValue('10000');

        fireEvent.change(minAmountInput, { target: { value: '100' } });
        fireEvent.change(maxAmountInput, { target: { value: '5000' } });

        expect(minAmountInput).toHaveValue(100);
        expect(maxAmountInput).toHaveValue(5000);
    });

    it('should handle search input', () => {
        render(
            <FilterPanel
                onApplyFilters={mockOnApplyFilters}
                onClearFilters={mockOnClearFilters}
                onSavePreset={mockOnSavePreset}
                onLoadPreset={mockOnLoadPreset}
                presets={mockPresets}
            />
        );

        const searchInput = screen.getByPlaceholderText('transactions.filters.searchPlaceholder');
        fireEvent.change(searchInput, { target: { value: 'test search' } });

        expect(searchInput).toHaveValue('test search');
    });

    it('should show advanced filters when toggled', () => {
        render(
            <FilterPanel
                onApplyFilters={mockOnApplyFilters}
                onClearFilters={mockOnClearFilters}
                onSavePreset={mockOnSavePreset}
                onLoadPreset={mockOnLoadPreset}
                presets={mockPresets}
            />
        );

        const advancedToggle = screen.getByText('transactions.filters.advanced');
        fireEvent.click(advancedToggle);

        expect(screen.getByText('transactions.filters.tags')).toBeInTheDocument();
    });

    it('should handle preset saving', async () => {
        render(
            <FilterPanel
                onApplyFilters={mockOnApplyFilters}
                onClearFilters={mockOnClearFilters}
                onSavePreset={mockOnSavePreset}
                onLoadPreset={mockOnLoadPreset}
                presets={mockPresets}
            />
        );

        const presetNameInput = screen.getByPlaceholderText('transactions.filters.presetName');
        fireEvent.change(presetNameInput, { target: { value: 'My Preset' } });

        const saveButton = screen.getByText('transactions.filters.savePreset');
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(mockOnSavePreset).toHaveBeenCalledWith('My Preset', mockFilters);
        });
    });

    it('should filter categories by transaction type', () => {
        const expenseFilters = { ...mockFilters, type: 'expense' };
        mockUseTransactionStore.mockReturnValue({
            filters: expenseFilters,
            categories: mockCategories,
            paymentMethods: mockPaymentMethods,
            setFilters: vi.fn(),
            formData: {} as any,
            formMode: 'create',
            setFormData: vi.fn(),
            resetForm: vi.fn(),
            transactions: [],
            loadTransactions: vi.fn(),
            createTransaction: vi.fn(),
            updateTransaction: vi.fn(),
            deleteTransaction: vi.fn(),
            loadCategories: vi.fn(),
            loadPaymentMethods: vi.fn(),
        });

        render(
            <FilterPanel
                onApplyFilters={mockOnApplyFilters}
                onClearFilters={mockOnClearFilters}
                onSavePreset={mockOnSavePreset}
                onLoadPreset={mockOnLoadPreset}
                presets={mockPresets}
            />
        );

        // Should show expense categories and transfer categories
        expect(screen.getByText('Food')).toBeInTheDocument();
        expect(screen.getByText('Transfer')).toBeInTheDocument();
        // Should not show income categories
        expect(screen.queryByText('Salary')).not.toBeInTheDocument();
    });

    it('should handle empty presets', () => {
        render(
            <FilterPanel
                onApplyFilters={mockOnApplyFilters}
                onClearFilters={mockOnClearFilters}
                onSavePreset={mockOnSavePreset}
                onLoadPreset={mockOnLoadPreset}
                presets={[]}
            />
        );

        expect(screen.getByText('transactions.filters.noPresets')).toBeInTheDocument();
    });
});
