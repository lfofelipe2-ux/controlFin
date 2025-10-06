import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '../../../config/i18n';
import { TransactionManagement } from '../TransactionManagement';

// Mock the transaction store
const mockTransactionStore = {
  transactions: [],
  stats: null,
  loading: false,
  error: null,
  isFormOpen: false,
  formMode: 'add' as const,
  selectedTransaction: null,
  refreshData: vi.fn(),
  openForm: vi.fn(),
  closeForm: vi.fn(),
  addTransaction: vi.fn(),
  updateTransaction: vi.fn(),
  deleteTransaction: vi.fn(),
  setFilters: vi.fn(),
  setTotalCount: vi.fn(),
  filters: {
    search: '',
    category: '',
    paymentMethod: '',
    dateRange: null,
    amountRange: null,
    tags: [],
  },
};

vi.mock('../../../stores/transactionStore', () => ({
  useTransactionStore: () => mockTransactionStore,
}));

// Mock Highcharts
vi.mock('highcharts-react-official', () => ({
  __esModule: true,
  default: ({ options }: { options: unknown }) => (
    <div data-testid='chart' data-options={JSON.stringify(options)} />
  ),
}));

// Mock Highcharts module
vi.mock('highcharts', () => ({
  __esModule: true,
  default: {
    chart: vi.fn(),
    series: vi.fn(),
    xAxis: vi.fn(),
    yAxis: vi.fn(),
    title: vi.fn(),
    subtitle: vi.fn(),
    legend: vi.fn(),
    plotOptions: vi.fn(),
    credits: vi.fn(),
    exporting: vi.fn(),
    responsive: vi.fn(),
  },
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>{component}</I18nextProvider>
    </BrowserRouter>
  );
};

describe('TransactionManagement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders transaction management interface', () => {
    renderWithProviders(<TransactionManagement />);

    // The component should render without crashing
    expect(screen.getByText('Transaction Management')).toBeInTheDocument();
  });

  it('renders without crashing', () => {
    renderWithProviders(<TransactionManagement />);
    // Test passes if component renders without throwing
  });

  it('calls refreshData on mount', () => {
    renderWithProviders(<TransactionManagement />);

    expect(mockTransactionStore.refreshData).toHaveBeenCalled();
  });
});