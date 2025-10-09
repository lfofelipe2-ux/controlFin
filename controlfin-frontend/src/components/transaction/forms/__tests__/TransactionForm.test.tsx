import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useTransactionStore } from '../../../../stores/transactionStore';
import { TransactionForm } from '../TransactionForm';

// Mock react-i18next
vi.mock('react-i18next', () => ({
    useTranslation: vi.fn(),
}));

// Mock the transaction store
vi.mock('../../../../stores/transactionStore', () => ({
    useTransactionStore: vi.fn(),
}));

// Mock dayjs
vi.mock('dayjs', () => ({
    default: vi.fn(() => ({
        format: vi.fn(() => '2024-01-01'),
        toDate: vi.fn(() => new Date('2024-01-01')),
        isValid: vi.fn(() => true),
        hour: vi.fn(() => 0),
        minute: vi.fn(() => 0),
        second: vi.fn(() => 0),
        millisecond: vi.fn(() => 0),
        setHour: vi.fn(() => ({
            format: vi.fn(() => '2024-01-01'),
            toDate: vi.fn(() => new Date('2024-01-01')),
            isValid: vi.fn(() => true),
            hour: vi.fn(() => 0),
            minute: vi.fn(() => 0),
            second: vi.fn(() => 0),
            millisecond: vi.fn(() => 0),
        })),
        subtract: vi.fn(() => ({
            format: vi.fn(() => '2023-12-01'),
            toDate: vi.fn(() => new Date('2023-12-01')),
            isValid: vi.fn(() => true),
            hour: vi.fn(() => 0),
            minute: vi.fn(() => 0),
            second: vi.fn(() => 0),
            millisecond: vi.fn(() => 0),
        })),
    })),
}));

const mockUseTranslation = vi.mocked(useTranslation);
const mockUseTransactionStore = vi.mocked(useTransactionStore);

describe('TransactionForm', () => {
    const mockOnSave = vi.fn();
    const mockOnCancel = vi.fn();

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

    const mockFormData = {
        type: 'expense',
        amount: 0,
        description: '',
        categoryId: '',
        paymentMethodId: '',
        date: new Date(),
        tags: [],
        isRecurring: false,
        recurringInterval: 'monthly',
        metadata: {
            location: '',
            notes: '',
        },
    };

    beforeEach(() => {
        vi.clearAllMocks();

        mockUseTranslation.mockReturnValue({
            t: (key: string) => key,
            i18n: {} as any,
            ready: true,
        });

        mockUseTransactionStore.mockReturnValue({
            formData: mockFormData,
            categories: mockCategories,
            paymentMethods: mockPaymentMethods,
            formMode: 'create',
            setFormData: vi.fn(),
            resetForm: vi.fn(),
            // Add other required properties
            transactions: [],
            filters: {},
            setFilters: vi.fn(),
            loadTransactions: vi.fn(),
            createTransaction: vi.fn(),
            updateTransaction: vi.fn(),
            deleteTransaction: vi.fn(),
            loadCategories: vi.fn(),
            loadPaymentMethods: vi.fn(),
        });
    });

    it('should render transaction form with all required fields', () => {
        render(<TransactionForm onSave={mockOnSave} onCancel={mockOnCancel} />);

        expect(screen.getByText('transactions.form.title')).toBeInTheDocument();
        expect(screen.getByText('transactions.form.type')).toBeInTheDocument();
        expect(screen.getByText('transactions.form.amount')).toBeInTheDocument();
        expect(screen.getByText('transactions.form.description')).toBeInTheDocument();
        expect(screen.getByText('transactions.form.category')).toBeInTheDocument();
        expect(screen.getByText('transactions.form.paymentMethod')).toBeInTheDocument();
        expect(screen.getByText('transactions.form.date')).toBeInTheDocument();
    });

    it('should render form buttons', () => {
        render(<TransactionForm onSave={mockOnSave} onCancel={mockOnCancel} />);

        expect(screen.getByText('common.cancel')).toBeInTheDocument();
        expect(screen.getByText('transactions.form.save')).toBeInTheDocument();
    });

    it('should call onCancel when cancel button is clicked', () => {
        render(<TransactionForm onSave={mockOnSave} onCancel={mockOnCancel} />);

        const cancelButton = screen.getByText('common.cancel');
        fireEvent.click(cancelButton);

        expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it('should show loading state when loading prop is true', () => {
        render(<TransactionForm onSave={mockOnSave} onCancel={mockOnCancel} loading={true} />);

        const saveButton = screen.getByText('transactions.form.save');
        expect(saveButton).toBeDisabled();
    });

    it('should filter categories by transaction type', () => {
        const expenseFormData = { ...mockFormData, type: 'expense' };
        mockUseTransactionStore.mockReturnValue({
            formData: expenseFormData,
            categories: mockCategories,
            paymentMethods: mockPaymentMethods,
            formMode: 'create',
            setFormData: vi.fn(),
            resetForm: vi.fn(),
            transactions: [],
            filters: {},
            setFilters: vi.fn(),
            loadTransactions: vi.fn(),
            createTransaction: vi.fn(),
            updateTransaction: vi.fn(),
            deleteTransaction: vi.fn(),
            loadCategories: vi.fn(),
            loadPaymentMethods: vi.fn(),
        });

        render(<TransactionForm onSave={mockOnSave} onCancel={mockOnCancel} />);

        // Should show expense categories and transfer categories
        expect(screen.getByText('Food')).toBeInTheDocument();
        expect(screen.getByText('Transfer')).toBeInTheDocument();
        // Should not show income categories
        expect(screen.queryByText('Salary')).not.toBeInTheDocument();
    });

    it('should show recurring options when isRecurring is true', () => {
        const recurringFormData = { ...mockFormData, isRecurring: true };
        mockUseTransactionStore.mockReturnValue({
            formData: recurringFormData,
            categories: mockCategories,
            paymentMethods: mockPaymentMethods,
            formMode: 'create',
            setFormData: vi.fn(),
            resetForm: vi.fn(),
            transactions: [],
            filters: {},
            setFilters: vi.fn(),
            loadTransactions: vi.fn(),
            createTransaction: vi.fn(),
            updateTransaction: vi.fn(),
            deleteTransaction: vi.fn(),
            loadCategories: vi.fn(),
            loadPaymentMethods: vi.fn(),
        });

        render(<TransactionForm onSave={mockOnSave} onCancel={mockOnCancel} />);

        expect(screen.getByText('transactions.form.recurringInterval')).toBeInTheDocument();
    });

    it('should handle form submission', async () => {
        render(<TransactionForm onSave={mockOnSave} onCancel={mockOnCancel} />);

        const saveButton = screen.getByText('transactions.form.save');
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(mockOnSave).toHaveBeenCalled();
        });
    });

    it('should handle tag input', () => {
        render(<TransactionForm onSave={mockOnSave} onCancel={mockOnCancel} />);

        const tagInput = screen.getByPlaceholderText('transactions.form.addTag');
        fireEvent.change(tagInput, { target: { value: 'test-tag' } });

        expect(tagInput).toHaveValue('test-tag');
    });

    it('should handle amount input', () => {
        render(<TransactionForm onSave={mockOnSave} onCancel={mockOnCancel} />);

        const amountInput = screen.getByRole('spinbutton');
        fireEvent.change(amountInput, { target: { value: '100.50' } });

        expect(amountInput).toHaveValue(100.50);
    });

    it('should handle description input', () => {
        render(<TransactionForm onSave={mockOnSave} onCancel={mockOnCancel} />);

        const descriptionInput = screen.getByRole('textbox');
        fireEvent.change(descriptionInput, { target: { value: 'Test description' } });

        expect(descriptionInput).toHaveValue('Test description');
    });

    it('should show validation errors for required fields', async () => {
        render(<TransactionForm onSave={mockOnSave} onCancel={mockOnCancel} />);

        const saveButton = screen.getByText('transactions.form.save');
        fireEvent.click(saveButton);

        await waitFor(() => {
            // Form validation should prevent submission
            expect(mockOnSave).not.toHaveBeenCalled();
        });
    });

    it('should handle different transaction types', () => {
        const incomeFormData = { ...mockFormData, type: 'income' };
        mockUseTransactionStore.mockReturnValue({
            formData: incomeFormData,
            categories: mockCategories,
            paymentMethods: mockPaymentMethods,
            formMode: 'create',
            setFormData: vi.fn(),
            resetForm: vi.fn(),
            transactions: [],
            filters: {},
            setFilters: vi.fn(),
            loadTransactions: vi.fn(),
            createTransaction: vi.fn(),
            updateTransaction: vi.fn(),
            deleteTransaction: vi.fn(),
            loadCategories: vi.fn(),
            loadPaymentMethods: vi.fn(),
        });

        render(<TransactionForm onSave={mockOnSave} onCancel={mockOnCancel} />);

        // Should show income categories and transfer categories
        expect(screen.getByText('Salary')).toBeInTheDocument();
        expect(screen.getByText('Transfer')).toBeInTheDocument();
        // Should not show expense categories
        expect(screen.queryByText('Food')).not.toBeInTheDocument();
    });

    it('should handle transfer transaction type', () => {
        const transferFormData = { ...mockFormData, type: 'transfer' };
        mockUseTransactionStore.mockReturnValue({
            formData: transferFormData,
            categories: mockCategories,
            paymentMethods: mockPaymentMethods,
            formMode: 'create',
            setFormData: vi.fn(),
            resetForm: vi.fn(),
            transactions: [],
            filters: {},
            setFilters: vi.fn(),
            loadTransactions: vi.fn(),
            createTransaction: vi.fn(),
            updateTransaction: vi.fn(),
            deleteTransaction: vi.fn(),
            loadCategories: vi.fn(),
            loadPaymentMethods: vi.fn(),
        });

        render(<TransactionForm onSave={mockOnSave} onCancel={mockOnCancel} />);

        // Should show all categories for transfer
        expect(screen.getByText('Food')).toBeInTheDocument();
        expect(screen.getByText('Salary')).toBeInTheDocument();
        expect(screen.getByText('Transfer')).toBeInTheDocument();
    });
});
