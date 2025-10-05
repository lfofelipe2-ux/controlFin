export interface Transaction {
  id: string;
  spaceId: string;
  userId: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  description: string;
  categoryId: string;
  paymentMethodId: string;
  date: string;
  tags: string[];
  isRecurring: boolean;
  recurringId?: string;
  metadata: {
    location?: string;
    notes?: string;
    attachments?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  spaceId: string;
  name: string;
  type: 'income' | 'expense' | 'transfer';
  color: string;
  icon: string;
  parentId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethod {
  id: string;
  spaceId: string;
  name: string;
  type: 'cash' | 'card' | 'bank' | 'digital' | 'crypto' | 'other';
  color: string;
  icon: string;
  isActive: boolean;
  metadata?: {
    lastFourDigits?: string;
    bankName?: string;
    accountType?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface RecurringTransaction {
  id: string;
  spaceId: string;
  userId: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  description: string;
  categoryId: string;
  paymentMethodId: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  startDate: string;
  endDate?: string;
  nextDueDate: string;
  isActive: boolean;
  metadata: {
    location?: string;
    notes?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFilters {
  search: string;
  category: string | null;
  paymentMethod: string | null;
  type: 'all' | 'income' | 'expense' | 'transfer';
  dateRange: [string, string] | null;
  amountRange: [number, number] | null;
  tags: string[];
  isRecurring: boolean | null;
}

export interface TransactionFormData {
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  description: string;
  categoryId: string;
  paymentMethodId: string;
  date: string;
  tags: string[];
  isRecurring: boolean;
  metadata: {
    location?: string;
    notes?: string;
  };
}

export interface TransactionStats {
  totalIncome: number;
  totalExpense: number;
  totalTransfer: number;
  netAmount: number;
  transactionCount: number;
  averageAmount: number;
  categoryBreakdown: Array<{
    categoryId: string;
    categoryName: string;
    amount: number;
    percentage: number;
  }>;
  paymentMethodBreakdown: Array<{
    paymentMethodId: string;
    paymentMethodName: string;
    amount: number;
    percentage: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    income: number;
    expense: number;
    net: number;
  }>;
}

export interface ImportResult {
  success: boolean;
  imported: number;
  errors: Array<{
    row: number;
    field: string;
    message: string;
    value: any;
  }>;
  warnings: Array<{
    row: number;
    field: string;
    message: string;
    value: any;
  }>;
}

export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf';
  dateRange: [string, string];
  includeCategories: boolean;
  includePaymentMethods: boolean;
  includeMetadata: boolean;
}
