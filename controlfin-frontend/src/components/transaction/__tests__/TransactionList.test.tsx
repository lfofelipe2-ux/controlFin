import { render, screen } from '@testing-library/react';
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
  onAddTransaction: vi.fn(),
  onEditTransaction: vi.fn(),
  onViewTransaction: vi.fn(),
  onDeleteTransaction: vi.fn(),
  onExportData: vi.fn(),
  onImportData: vi.fn(),
  onViewCharts: vi.fn(),
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

  it('renders transaction list component', () => {
    renderWithProviders(<TransactionList {...mockProps} />);

    // The component should render without crashing
    expect(screen.getByText('Transaction Management')).toBeInTheDocument();
  });

  it('renders transaction list component', () => {
    renderWithProviders(<TransactionList {...mockProps} />);

    // The component should render without crashing
    expect(screen.getByText('Transaction Management')).toBeInTheDocument();
  });

  it('renders transaction list component', () => {
    renderWithProviders(<TransactionList {...mockProps} />);

    // The component should render without crashing
    expect(screen.getByText('Transaction Management')).toBeInTheDocument();
  });

  it('renders transaction list component', () => {
    renderWithProviders(<TransactionList {...mockProps} />);

    // The component should render without crashing
    expect(screen.getByText('Transaction Management')).toBeInTheDocument();
  });

  it('renders without crashing', () => {
    renderWithProviders(<TransactionList {...mockProps} />);
    // Test passes if component renders without throwing
  });
});
