import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '../../../config/i18n';
import { TransactionList } from '../TransactionList';

// Mock transactions removed as they were not being used

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
    expect(screen.getByPlaceholderText('Search transactions...')).toBeInTheDocument();
  });

  it('renders search input', () => {
    renderWithProviders(<TransactionList {...mockProps} />);

    // Check if search input is rendered
    expect(screen.getByPlaceholderText('Search transactions...')).toBeInTheDocument();
  });

  it('renders filter button', () => {
    renderWithProviders(<TransactionList {...mockProps} />);

    // Check if filter button is rendered
    expect(screen.getByText('Filters')).toBeInTheDocument();
  });

  it('renders refresh button', () => {
    renderWithProviders(<TransactionList {...mockProps} />);

    // Check if refresh button is rendered
    expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument();
  });

  it('renders charts button', () => {
    renderWithProviders(<TransactionList {...mockProps} />);

    // Check if charts button is rendered
    expect(screen.getByText('Charts')).toBeInTheDocument();
  });

  it('renders without crashing', () => {
    renderWithProviders(<TransactionList {...mockProps} />);
    // Test passes if component renders without throwing
  });
});
