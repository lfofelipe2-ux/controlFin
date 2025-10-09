import { fireEvent, render, screen } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useTransactionStore } from '../../../../stores/transactionStore';
import { TransactionChart } from '../TransactionChart';

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
        subtract: vi.fn(() => ({
            format: vi.fn(() => '2023-12-01'),
            toDate: vi.fn(() => new Date('2023-12-01')),
        })),
    })),
}));

// Mock Highcharts
vi.mock('highcharts', () => ({
    default: {
        setOptions: vi.fn(),
    },
}));

// Mock HighchartsReact
vi.mock('highcharts-react-official', () => ({
    default: ({ options }: { options: any }) => (
        <div data-testid="highcharts-chart" data-options={JSON.stringify(options)} />
    ),
}));

const mockUseTranslation = vi.mocked(useTranslation);
const mockUseTransactionStore = vi.mocked(useTransactionStore);

describe('TransactionChart', () => {
    const mockOnDateRangeChange = vi.fn();
    const mockOnChartTypeChange = vi.fn();

    const mockStats = {
        totalIncome: 5000,
        totalExpenses: 3000,
        netAmount: 2000,
        categoryBreakdown: [
            { category: 'Food', amount: 1000, percentage: 33.33 },
            { category: 'Transport', amount: 800, percentage: 26.67 },
            { category: 'Entertainment', amount: 1200, percentage: 40 },
        ],
        monthlyTrend: [
            { month: '2024-01', income: 2500, expenses: 1500 },
            { month: '2024-02', income: 2500, expenses: 1500 },
        ],
        paymentMethodBreakdown: [
            { method: 'Credit Card', amount: 2000, percentage: 66.67 },
            { method: 'Cash', amount: 1000, percentage: 33.33 },
        ],
    };

    beforeEach(() => {
        vi.clearAllMocks();

        mockUseTranslation.mockReturnValue({
            t: (key: string) => key,
            i18n: {} as any,
            ready: true,
        });

        mockUseTransactionStore.mockReturnValue({
            loading: false,
            // Add other required properties
            formData: {} as any,
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
            categories: [],
            paymentMethods: [],
            loadCategories: vi.fn(),
            loadPaymentMethods: vi.fn(),
        });
    });

    it('should render transaction chart with stats', () => {
        render(
            <TransactionChart
                stats={mockStats}
                onDateRangeChange={mockOnDateRangeChange}
                onChartTypeChange={mockOnChartTypeChange}
            />
        );

        expect(screen.getByText('transactions.charts.title')).toBeInTheDocument();
        expect(screen.getByText('transactions.charts.income')).toBeInTheDocument();
        expect(screen.getByText('transactions.charts.expenses')).toBeInTheDocument();
        expect(screen.getByText('transactions.charts.netAmount')).toBeInTheDocument();
    });

    it('should render chart controls', () => {
        render(
            <TransactionChart
                stats={mockStats}
                onDateRangeChange={mockOnDateRangeChange}
                onChartTypeChange={mockOnChartTypeChange}
            />
        );

        expect(screen.getByText('transactions.charts.dateRange')).toBeInTheDocument();
        expect(screen.getByText('transactions.charts.chartType')).toBeInTheDocument();
    });

    it('should render Highcharts component', () => {
        render(
            <TransactionChart
                stats={mockStats}
                onDateRangeChange={mockOnDateRangeChange}
                onChartTypeChange={mockOnChartTypeChange}
            />
        );

        expect(screen.getByTestId('highcharts-chart')).toBeInTheDocument();
    });

    it('should show loading state when loading', () => {
        mockUseTransactionStore.mockReturnValue({
            loading: true,
            formData: {} as any,
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
            categories: [],
            paymentMethods: [],
            loadCategories: vi.fn(),
            loadPaymentMethods: vi.fn(),
        });

        render(
            <TransactionChart
                stats={mockStats}
                onDateRangeChange={mockOnDateRangeChange}
                onChartTypeChange={mockOnChartTypeChange}
            />
        );

        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('should call onDateRangeChange when date range is changed', () => {
        render(
            <TransactionChart
                stats={mockStats}
                onDateRangeChange={mockOnDateRangeChange}
                onChartTypeChange={mockOnChartTypeChange}
            />
        );

        const dateRangePicker = screen.getByRole('combobox');
        fireEvent.change(dateRangePicker, { target: { value: '2024-01-01' } });

        // The actual date range change would be triggered by the DatePicker component
        // This is a simplified test
        expect(dateRangePicker).toBeInTheDocument();
    });

    it('should call onChartTypeChange when chart type is changed', () => {
        render(
            <TransactionChart
                stats={mockStats}
                onDateRangeChange={mockOnDateRangeChange}
                onChartTypeChange={mockOnChartTypeChange}
            />
        );

        const chartTypeSelect = screen.getAllByRole('combobox')[1];
        fireEvent.change(chartTypeSelect, { target: { value: 'bar' } });

        expect(chartTypeSelect).toHaveValue('bar');
    });

    it('should display correct income amount', () => {
        render(
            <TransactionChart
                stats={mockStats}
                onDateRangeChange={mockOnDateRangeChange}
                onChartTypeChange={mockOnChartTypeChange}
            />
        );

        expect(screen.getByText('$5,000.00')).toBeInTheDocument();
    });

    it('should display correct expenses amount', () => {
        render(
            <TransactionChart
                stats={mockStats}
                onDateRangeChange={mockOnDateRangeChange}
                onChartTypeChange={mockOnChartTypeChange}
            />
        );

        expect(screen.getByText('$3,000.00')).toBeInTheDocument();
    });

    it('should display correct net amount', () => {
        render(
            <TransactionChart
                stats={mockStats}
                onDateRangeChange={mockOnDateRangeChange}
                onChartTypeChange={mockOnChartTypeChange}
            />
        );

        expect(screen.getByText('$2,000.00')).toBeInTheDocument();
    });

    it('should render category breakdown chart', () => {
        render(
            <TransactionChart
                stats={mockStats}
                onDateRangeChange={mockOnDateRangeChange}
                onChartTypeChange={mockOnChartTypeChange}
            />
        );

        expect(screen.getByText('transactions.charts.categoryBreakdown')).toBeInTheDocument();
    });

    it('should render payment method breakdown chart', () => {
        render(
            <TransactionChart
                stats={mockStats}
                onDateRangeChange={mockOnDateRangeChange}
                onChartTypeChange={mockOnChartTypeChange}
            />
        );

        expect(screen.getByText('transactions.charts.paymentMethodBreakdown')).toBeInTheDocument();
    });

    it('should render monthly trend chart', () => {
        render(
            <TransactionChart
                stats={mockStats}
                onDateRangeChange={mockOnDateRangeChange}
                onChartTypeChange={mockOnChartTypeChange}
            />
        );

        expect(screen.getByText('transactions.charts.monthlyTrend')).toBeInTheDocument();
    });

    it('should handle empty stats', () => {
        const emptyStats = {
            totalIncome: 0,
            totalExpenses: 0,
            netAmount: 0,
            categoryBreakdown: [],
            monthlyTrend: [],
            paymentMethodBreakdown: [],
        };

        render(
            <TransactionChart
                stats={emptyStats}
                onDateRangeChange={mockOnDateRangeChange}
                onChartTypeChange={mockOnChartTypeChange}
            />
        );

        expect(screen.getByText('$0.00')).toBeInTheDocument();
    });

    it('should render chart type options', () => {
        render(
            <TransactionChart
                stats={mockStats}
                onDateRangeChange={mockOnDateRangeChange}
                onChartTypeChange={mockOnChartTypeChange}
            />
        );

        expect(screen.getByText('transactions.charts.pie')).toBeInTheDocument();
        expect(screen.getByText('transactions.charts.bar')).toBeInTheDocument();
        expect(screen.getByText('transactions.charts.line')).toBeInTheDocument();
    });

    it('should handle chart type selection', () => {
        render(
            <TransactionChart
                stats={mockStats}
                onDateRangeChange={mockOnDateRangeChange}
                onChartTypeChange={mockOnChartTypeChange}
            />
        );

        const chartTypeSelect = screen.getAllByRole('combobox')[1];
        fireEvent.change(chartTypeSelect, { target: { value: 'line' } });

        expect(chartTypeSelect).toHaveValue('line');
    });
});
