import { fireEvent, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '../../../config/i18n';
import { TransactionList } from '../TransactionList';

const mockTransactions = [
  {
    id: '1',
    description: 'Grocery Shopping',
    amount: 150.5,
    type: 'expense',
    category: 'Food',
    paymentMethod: 'Credit Card',
    date: '2025-01-01',
    tags: ['grocery', 'food'],
  },
  {
    id: '2',
    description: 'Salary',
    amount: 5000.0,
    type: 'income',
    category: 'Salary',
    paymentMethod: 'Bank Transfer',
    date: '2025-01-01',
    tags: ['salary', 'work'],
  },
];

const mockProps = {
  transactions: mockTransactions,
  loading: false,
  error: null,
  onEdit: vi.fn(),
  onDelete: vi.fn(),
  onDuplicate: vi.fn(),
  onFilter: vi.fn(),
  onSort: vi.fn(),
  onExport: vi.fn(),
  pagination: {
    current: 1,
    pageSize: 10,
    total: 2,
  },
  onPageChange: vi.fn(),
};

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>{component}</I18nextProvider>
    </BrowserRouter>
  );
};

describe('TransactionList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders transaction list with data', () => {
    renderWithProviders(<TransactionList {...mockProps} />);

    expect(screen.getByText('Grocery Shopping')).toBeInTheDocument();
    expect(screen.getByText('Salary')).toBeInTheDocument();
    expect(screen.getByText('$150.50')).toBeInTheDocument();
    expect(screen.getByText('$5,000.00')).toBeInTheDocument();
  });

  it('displays loading state', () => {
    renderWithProviders(<TransactionList {...mockProps} loading={true} />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('displays error state', () => {
    renderWithProviders(<TransactionList {...mockProps} error='Failed to load transactions' />);

    expect(screen.getByText('Failed to load transactions')).toBeInTheDocument();
  });

  it('displays empty state when no transactions', () => {
    renderWithProviders(<TransactionList {...mockProps} transactions={[]} />);

    expect(screen.getByText('No transactions found')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', async () => {
    renderWithProviders(<TransactionList {...mockProps} />);

    const editButtons = screen.getAllByTestId('edit-button');
    fireEvent.click(editButtons[0]);

    expect(mockProps.onEdit).toHaveBeenCalledWith(mockTransactions[0]);
  });

  it('calls onDelete when delete button is clicked', async () => {
    renderWithProviders(<TransactionList {...mockProps} />);

    const deleteButtons = screen.getAllByTestId('delete-button');
    fireEvent.click(deleteButtons[0]);

    expect(mockProps.onDelete).toHaveBeenCalledWith(mockTransactions[0]);
  });

  it('calls onDuplicate when duplicate button is clicked', async () => {
    renderWithProviders(<TransactionList {...mockProps} />);

    const duplicateButtons = screen.getAllByTestId('duplicate-button');
    fireEvent.click(duplicateButtons[0]);

    expect(mockProps.onDuplicate).toHaveBeenCalledWith(mockTransactions[0]);
  });

  it('handles pagination correctly', () => {
    renderWithProviders(<TransactionList {...mockProps} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('displays transaction type indicators', () => {
    renderWithProviders(<TransactionList {...mockProps} />);

    const expenseIndicator = screen.getByTestId('transaction-type-expense');
    const incomeIndicator = screen.getByTestId('transaction-type-income');

    expect(expenseIndicator).toBeInTheDocument();
    expect(incomeIndicator).toBeInTheDocument();
  });

  it('shows transaction tags', () => {
    renderWithProviders(<TransactionList {...mockProps} />);

    expect(screen.getByText('grocery')).toBeInTheDocument();
    expect(screen.getByText('food')).toBeInTheDocument();
    expect(screen.getByText('salary')).toBeInTheDocument();
    expect(screen.getByText('work')).toBeInTheDocument();
  });

  it('handles sorting correctly', () => {
    renderWithProviders(<TransactionList {...mockProps} />);

    const sortButton = screen.getByTestId('sort-button');
    fireEvent.click(sortButton);

    expect(mockProps.onSort).toHaveBeenCalled();
  });

  it('handles export correctly', () => {
    renderWithProviders(<TransactionList {...mockProps} />);

    const exportButton = screen.getByTestId('export-button');
    fireEvent.click(exportButton);

    expect(mockProps.onExport).toHaveBeenCalled();
  });
});
