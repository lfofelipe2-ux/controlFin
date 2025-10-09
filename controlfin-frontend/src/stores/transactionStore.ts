import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  Category,
  ImportResult,
  PaymentMethod,
  RecurringTransaction,
  Transaction,
  TransactionFilters,
  TransactionFormData,
  TransactionStats,
} from '../types/transaction';

// Logger utility
const logger = {
  info: (message: string, ...args: any[]) => console.log(`[TransactionStore] ${message}`, ...args),
  error: (message: string, ...args: any[]) => console.error(`[TransactionStore] ${message}`, ...args),
};

interface TransactionState {
  // Data
  transactions: Transaction[];
  categories: Category[];
  paymentMethods: PaymentMethod[];
  recurringTransactions: RecurringTransaction[];
  stats: TransactionStats | null;

  // UI State
  loading: boolean;
  error: string | null;
  selectedTransaction: Transaction | null;

  // Filters and Search
  filters: TransactionFilters;
  searchQuery: string;
  sortBy: 'date' | 'amount' | 'description' | 'category' | 'type';
  sortOrder: 'asc' | 'desc';

  // Pagination
  currentPage: number;
  pageSize: number;
  totalCount: number;

  // Form State
  isFormOpen: boolean;
  formMode: 'create' | 'edit' | 'view';
  formData: TransactionFormData;

  // Import/Export
  importResult: ImportResult | null;
  isImporting: boolean;
  isExporting: boolean;

  // Actions
  // Data Actions
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  setCategories: (categories: Category[]) => void;
  setPaymentMethods: (paymentMethods: PaymentMethod[]) => void;
  setRecurringTransactions: (recurring: RecurringTransaction[]) => void;
  setStats: (stats: TransactionStats) => void;

  // UI Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedTransaction: (transaction: Transaction | null) => void;

  // Filter Actions
  setFilters: (filters: Partial<TransactionFilters>) => void;
  clearFilters: () => void;
  setSearchQuery: (query: string) => void;
  setSorting: (
    sortBy: 'date' | 'amount' | 'description' | 'category' | 'type',
    order: 'asc' | 'desc'
  ) => void;

  // Pagination Actions
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setTotalCount: (count: number) => void;

  // Form Actions
  openForm: (mode: 'create' | 'edit' | 'view', transaction?: Transaction) => void;
  closeForm: () => void;
  setFormData: (data: Partial<TransactionFormData>) => void;
  resetForm: () => void;

  // Import/Export Actions
  setImportResult: (result: ImportResult | null) => void;
  setImporting: (importing: boolean) => void;
  setExporting: (exporting: boolean) => void;

  // Utility Actions
  refreshData: () => Promise<void>;
  // exportData: (options: ExportOptions) => Promise<void>;
  // importData: (file: File) => Promise<ImportResult>;
}

const defaultFilters: TransactionFilters = {
  search: '',
  category: null,
  paymentMethod: null,
  type: 'all',
  dateRange: null,
  amountRange: null,
  tags: [],
  isRecurring: null,
};

const defaultFormData: TransactionFormData = {
  type: 'expense',
  amount: 0,
  description: '',
  categoryId: '',
  paymentMethodId: '',
  date: new Date().toISOString().split('T')[0],
  tags: [],
  isRecurring: false,
  metadata: {},
};

export const useTransactionStore = create<TransactionState>()(
  devtools(
    (set, get) => ({
      // Initial State
      transactions: [],
      categories: [],
      paymentMethods: [],
      recurringTransactions: [],
      stats: null,

      loading: false,
      error: null,
      selectedTransaction: null,

      filters: defaultFilters,
      searchQuery: '',
      sortBy: 'date',
      sortOrder: 'desc',

      currentPage: 1,
      pageSize: 20,
      totalCount: 0,

      isFormOpen: false,
      formMode: 'create',
      formData: defaultFormData,

      importResult: null,
      isImporting: false,
      isExporting: false,

      // Data Actions
      setTransactions: (transactions) => set({ transactions }),

      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [transaction, ...state.transactions],
          totalCount: state.totalCount + 1,
        })),

      updateTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
          totalCount: state.totalCount - 1,
        })),

      setCategories: (categories) => set({ categories }),
      setPaymentMethods: (paymentMethods) => set({ paymentMethods }),
      setRecurringTransactions: (recurringTransactions) => set({ recurringTransactions }),
      setStats: (stats) => set({ stats }),

      // UI Actions
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setSelectedTransaction: (selectedTransaction) => set({ selectedTransaction }),

      // Filter Actions
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
          currentPage: 1, // Reset to first page when filters change
        })),

      clearFilters: () =>
        set({
          filters: defaultFilters,
          searchQuery: '',
          currentPage: 1,
        }),

      setSearchQuery: (searchQuery) =>
        set({
          searchQuery,
          currentPage: 1,
        }),

      setSorting: (sortBy, sortOrder) => set({ sortBy, sortOrder }),

      // Pagination Actions
      setPage: (currentPage) => set({ currentPage }),
      setPageSize: (pageSize) => set({ pageSize, currentPage: 1 }),
      setTotalCount: (totalCount) => set({ totalCount }),

      // Form Actions
      openForm: (formMode, transaction) =>
        set({
          isFormOpen: true,
          formMode,
          formData: transaction
            ? {
              type: transaction.type,
              amount: transaction.amount,
              description: transaction.description,
              categoryId: transaction.categoryId,
              paymentMethodId: transaction.paymentMethodId,
              date: transaction.date.split('T')[0],
              tags: transaction.tags,
              isRecurring: transaction.isRecurring,
              metadata: transaction.metadata,
            }
            : defaultFormData,
          selectedTransaction: transaction || null,
        }),

      closeForm: () =>
        set({
          isFormOpen: false,
          formMode: 'create',
          formData: defaultFormData,
          selectedTransaction: null,
        }),

      setFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      resetForm: () => set({ formData: defaultFormData }),

      // Import/Export Actions
      setImportResult: (importResult) => set({ importResult }),
      setImporting: (isImporting) => set({ isImporting }),
      setExporting: (isExporting) => set({ isExporting }),

      // Utility Actions
      refreshData: async () => {
        set({ loading: true, error: null });
        try {
          // TODO: Implement API calls when backend endpoints are ready
          // const [transactions, categories, paymentMethods, stats] = await Promise.all([
          //   fetchTransactions(),
          //   fetchCategories(),
          //   fetchPaymentMethods(),
          //   fetchStats(),
          // ]);
          // set({ transactions, categories, paymentMethods, stats });

          // Temporary mock data for development
          set({
            transactions: [],
            categories: [],
            paymentMethods: [],
            stats: {
              totalIncome: 0,
              totalExpense: 0,
              totalTransfer: 0,
              netAmount: 0,
              transactionCount: 0,
              averageAmount: 0,
              categoryBreakdown: [],
              paymentMethodBreakdown: [],
              monthlyTrend: []
            }
          });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error' });
        } finally {
          set({ loading: false });
        }
      },

      exportData: async (options: any) => {
        set({ isExporting: true, error: null });
        try {
          // TODO: Implement export functionality when backend endpoints are ready
          logger.info('Exporting data with options:', options);

          // Temporary implementation - export current transactions to CSV
          const { transactions } = get();
          const csvContent = transactions.map((t: Transaction) =>
            `${t.date},${t.description},${t.amount},${t.type},${t.categoryId}`
          ).join('\n');

          const blob = new Blob([csvContent], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`; // eslint-disable-line no-hardcoded-strings/no-hardcoded-strings
          a.click();
          window.URL.revokeObjectURL(url);
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Export failed' });
        } finally {
          set({ isExporting: false });
        }
      },

      importData: async (file: File) => {
        set({ isImporting: true, error: null });
        try {
          // TODO: Implement import functionality when backend endpoints are ready
          logger.info('Importing file:', file.name);

          // Temporary implementation - parse CSV file
          const text = await file.text();
          const lines = text.split('\n').filter(line => line.trim());
          const importedTransactions: Transaction[] = lines.map((line: string) => {
            const [date, description, amount, type, categoryId] = line.split(',');
            return {
              id: Math.random().toString(36).substr(2, 9),
              spaceId: 'default-space', // Temporary default
              userId: 'current-user', // Temporary default
              type: type as 'income' | 'expense',
              amount: parseFloat(amount) || 0,
              description: description || '',
              categoryId: categoryId || '',
              paymentMethodId: 'default-payment', // Temporary default
              date: new Date(date).toISOString(),
              tags: [],
              isRecurring: false,
              metadata: {},
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
          });

          const result: ImportResult = {
            success: true,
            imported: importedTransactions.length,
            errors: [],
            warnings: [],
          };

          // Add imported transactions to current state
          set(state => ({
            transactions: [...state.transactions, ...importedTransactions],
            importResult: result
          }));

          return result;
        } catch (error) {
          const result: ImportResult = {
            success: false,
            imported: 0,
            errors: [{
              row: 0,
              field: 'file',
              message: error instanceof Error ? error.message : 'Import failed',
              value: file.name,
            }],
            warnings: [],
          };
          set({ importResult: result, error: result.errors[0].message });
          return result;
        } finally {
          set({ isImporting: false });
        }
      },
    }),
    {
      name: 'transaction-store',
    }
  )
);
