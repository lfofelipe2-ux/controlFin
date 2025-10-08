import { sanitizeTransactionData } from '../../utils/data-sanitizer';
import { CategoryModel as Category } from '../categories/category.model';
import { PaymentMethodModel as PaymentMethod } from '../payment-methods/payment-method.model';
import { ITransaction, TransactionModel as Transaction } from './transaction.model';

export interface CreateTransactionData {
  spaceId: string;
  userId: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  description: string;
  categoryId: string;
  paymentMethodId: string;
  date: Date;
  tags?: string[];
  isRecurring?: boolean;
  recurringId?: string;
  metadata?: {
    location?: string;
    notes?: string;
    attachments?: string[];
  };
}

export interface UpdateTransactionData {
  type?: 'income' | 'expense' | 'transfer';
  amount?: number;
  description?: string;
  categoryId?: string;
  paymentMethodId?: string;
  date?: Date;
  tags?: string[];
  isRecurring?: boolean;
  recurringId?: string;
  metadata?: {
    location?: string;
    notes?: string;
    attachments?: string[];
  };
}

export interface GetTransactionsParams {
  userId: string;
  spaceId?: string;
  type?: 'income' | 'expense' | 'transfer';
  categoryId?: string;
  paymentMethodId?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  tags?: string[];
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'date' | 'amount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface GetTransactionStatsParams {
  userId: string;
  spaceId?: string;
  startDate?: string;
  endDate?: string;
  type?: 'income' | 'expense' | 'transfer';
}

export interface SearchTransactionsParams {
  userId: string;
  spaceId?: string;
  query: string;
  page?: number;
  limit?: number;
}

export interface TransactionStats {
  totalIncome: number;
  totalExpense: number;
  netAmount: number;
  transactionCount: number;
  averageTransaction: number;
  byCategory: Array<{
    categoryId: string;
    categoryName: string;
    amount: number;
    count: number;
    percentage: number;
  }>;
  byPaymentMethod: Array<{
    paymentMethodId: string;
    paymentMethodName: string;
    amount: number;
    count: number;
    percentage: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    income: number;
    expenses: number;
    net: number;
  }>;
}

export interface PaginatedResult<T> {
  transactions: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

class TransactionService {
  async createTransaction(data: CreateTransactionData): Promise<ITransaction> {
    // Sanitize transaction data
    const sanitizedData = sanitizeTransactionData(data);

    // Validate category exists
    const category = await Category.findById(sanitizedData.categoryId);
    if (!category) {
      throw new Error('Category not found');
    }

    // Validate payment method exists
    const paymentMethod = await PaymentMethod.findById(sanitizedData.paymentMethodId);
    if (!paymentMethod) {
      throw new Error('Payment method not found');
    }

    const transaction = new Transaction(sanitizedData);
    return await transaction.save();
  }

  async getTransactionById(id: string, userId: string): Promise<ITransaction> {
    try {
      const transaction = await Transaction.findOne({ _id: id, userId });
      if (!transaction) {
        throw new Error('Transaction not found');
      }
      return transaction;
    } catch (error) {
      // Handle ObjectId validation errors
      if (error instanceof Error && error.message.includes('Cast to ObjectId failed')) {
        throw new Error('Transaction not found');
      }
      throw error;
    }
  }

  async updateTransaction(
    id: string,
    updateData: UpdateTransactionData,
    userId: string
  ): Promise<ITransaction | null> {
    try {
      // Validate category if provided
      if (updateData.categoryId) {
        const category = await Category.findById(updateData.categoryId);
        if (!category) {
          throw new Error('Category not found');
        }
      }

      // Validate payment method if provided
      if (updateData.paymentMethodId) {
        const paymentMethod = await PaymentMethod.findById(updateData.paymentMethodId);
        if (!paymentMethod) {
          throw new Error('Payment method not found');
        }
      }

      const updatedTransaction = await Transaction.findOneAndUpdate(
        { _id: id, userId },
        { ...updateData, updatedAt: new Date() },
        { new: true }
      );

      if (!updatedTransaction) {
        throw new Error('Transaction not found');
      }

      return updatedTransaction;
    } catch (error) {
      // Handle ObjectId validation errors
      if (error instanceof Error && error.message.includes('Cast to ObjectId failed')) {
        throw new Error('Transaction not found');
      }
      throw error;
    }
  }

  async deleteTransaction(id: string, userId: string): Promise<ITransaction | null> {
    try {
      const transaction = await Transaction.findOne({ _id: id, userId });
      if (!transaction) {
        return null;
      }

      await Transaction.deleteOne({ _id: id, userId });
      return transaction;
    } catch (error) {
      // Handle ObjectId validation errors
      if (error instanceof Error && error.message.includes('Cast to ObjectId failed')) {
        return null;
      }
      throw error;
    }
  }

  async getTransactions(params: GetTransactionsParams): Promise<PaginatedResult<ITransaction>> {
    const {
      userId,
      spaceId,
      type,
      categoryId,
      paymentMethodId,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      tags,
      search,
      page = 1,
      limit = 20,
      sortBy = 'date',
      sortOrder = 'desc',
    } = params;

    // Build filter query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = { userId };

    if (spaceId) filter.spaceId = spaceId;
    if (type) filter.type = type;
    if (categoryId) filter.categoryId = categoryId;
    if (paymentMethodId) filter.paymentMethodId = paymentMethodId;

    // Date range filter
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // Amount range filter
    if (minAmount !== undefined || maxAmount !== undefined) {
      filter.amount = {};
      if (minAmount !== undefined) filter.amount.$gte = minAmount;
      if (maxAmount !== undefined) filter.amount.$lte = maxAmount;
    }

    // Tags filter
    if (tags && tags.length > 0) {
      filter.tags = { $in: tags };
    }

    // Search filter
    if (search) {
      filter.$or = [
        { description: { $regex: search, $options: 'i' } },
        { 'metadata.notes': { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Build sort object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('categoryId', 'name color icon')
        .populate('paymentMethodId', 'name type icon'),
      Transaction.countDocuments(filter),
    ]);

    return {
      transactions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async searchTransactions(
    params: SearchTransactionsParams
  ): Promise<PaginatedResult<ITransaction>> {
    const { userId, spaceId, query, page = 1, limit = 20 } = params;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {
      userId,
      $or: [
        { description: { $regex: query, $options: 'i' } },
        { 'metadata.notes': { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } },
      ],
    };

    if (spaceId) filter.spaceId = spaceId;

    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .populate('categoryId', 'name color icon')
        .populate('paymentMethodId', 'name type icon'),
      Transaction.countDocuments(filter),
    ]);

    return {
      transactions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getTransactionStats(params: GetTransactionStatsParams): Promise<TransactionStats> {
    const { userId, spaceId, startDate, endDate, type } = params;

    // Build filter query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = { userId };
    if (spaceId) filter.spaceId = spaceId;
    if (type) filter.type = type;

    // Date range filter
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // Get all transactions for the period
    const transactions = await Transaction.find(filter)
      .populate('categoryId', 'name color icon')
      .populate('paymentMethodId', 'name type icon');

    // Calculate summary statistics
    const totalIncome = transactions
      .filter((t: ITransaction) => t.type === 'income')
      .reduce((sum: number, t: ITransaction) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t: ITransaction) => t.type === 'expense')
      .reduce((sum: number, t: ITransaction) => sum + t.amount, 0);

    const netAmount = totalIncome - totalExpenses;
    const transactionCount = transactions.length;
    const averageTransaction =
      transactionCount > 0 ? (totalIncome + totalExpenses) / transactionCount : 0;

    // Calculate by category
    const categoryMap = new Map();
    transactions.forEach((transaction: ITransaction) => {
      const categoryId = transaction.categoryId.toString();


      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const categoryName = (transaction.categoryId as any)?.name || 'Unknown';

      if (!categoryMap.has(categoryId)) {
        categoryMap.set(categoryId, {
          categoryId,
          categoryName,
          amount: 0,
          count: 0,
        });
      }

      const category = categoryMap.get(categoryId);
      category.amount += transaction.amount;
      category.count += 1;
    });

    const byCategory = Array.from(categoryMap.values()).map((category) => ({
      ...category,
      percentage:
        totalIncome + totalExpenses > 0
          ? (category.amount / (totalIncome + totalExpenses)) * 100
          : 0,
    }));

    // Calculate by payment method
    const paymentMethodMap = new Map();
    transactions.forEach((transaction: ITransaction) => {
      const paymentMethodId = transaction.paymentMethodId.toString();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const paymentMethodName = (transaction.paymentMethodId as any)?.name || 'Unknown';

      if (!paymentMethodMap.has(paymentMethodId)) {
        paymentMethodMap.set(paymentMethodId, {
          paymentMethodId,
          paymentMethodName,
          amount: 0,
          count: 0,
        });
      }

      const paymentMethod = paymentMethodMap.get(paymentMethodId);
      paymentMethod.amount += transaction.amount;
      paymentMethod.count += 1;
    });

    const byPaymentMethod = Array.from(paymentMethodMap.values()).map((paymentMethod) => ({
      ...paymentMethod,
      percentage:
        totalIncome + totalExpenses > 0
          ? (paymentMethod.amount / (totalIncome + totalExpenses)) * 100
          : 0,
    }));

    // Calculate monthly trend
    const monthlyMap = new Map();
    transactions.forEach((transaction: ITransaction) => {
      const month = transaction.date.toISOString().substring(0, 7); // YYYY-MM

      if (!monthlyMap.has(month)) {
        monthlyMap.set(month, {
          month,
          income: 0,
          expenses: 0,
          net: 0,
        });
      }

      const monthData = monthlyMap.get(month);
      if (transaction.type === 'income') {
        monthData.income += transaction.amount;
      } else if (transaction.type === 'expense') {
        monthData.expenses += transaction.amount;
      }
      monthData.net = monthData.income - monthData.expenses;
    });

    const monthlyTrend = Array.from(monthlyMap.values()).sort((a, b) =>
      a.month.localeCompare(b.month)
    );

    return {
      totalIncome,
      totalExpense: totalExpenses,
      netAmount,
      transactionCount,
      averageTransaction,
      byCategory: byCategory.sort((a, b) => b.amount - a.amount),
      byPaymentMethod: byPaymentMethod.sort((a, b) => b.amount - a.amount),
      monthlyTrend,
    };
  }

  async getTransactionsByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
    spaceId?: string
  ): Promise<ITransaction[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {
      userId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    if (spaceId) filter.spaceId = spaceId;

    return await Transaction.find(filter)
      .sort({ date: -1 })
      .populate('categoryId', 'name color icon')
      .populate('paymentMethodId', 'name type icon');
  }

  async getRecurringTransactions(userId: string, spaceId?: string): Promise<ITransaction[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {
      userId,
      isRecurring: true,
    };

    if (spaceId) filter.spaceId = spaceId;

    return await Transaction.find(filter)
      .sort({ date: -1 })
      .populate('categoryId', 'name color icon')
      .populate('paymentMethodId', 'name type icon');
  }

  async getTransactionsByCategory(
    userId: string,
    categoryId: string,
    spaceId?: string
  ): Promise<ITransaction[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {
      userId,
      categoryId,
    };

    if (spaceId) filter.spaceId = spaceId;

    return await Transaction.find(filter)
      .sort({ date: -1 })
      .populate('categoryId', 'name color icon')
      .populate('paymentMethodId', 'name type icon');
  }

  async getTransactionsByPaymentMethod(
    userId: string,
    paymentMethodId: string,
    spaceId?: string
  ): Promise<ITransaction[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {
      userId,
      paymentMethodId,
    };

    if (spaceId) filter.spaceId = spaceId;

    return await Transaction.find(filter)
      .sort({ date: -1 })
      .populate('categoryId', 'name color icon')
      .populate('paymentMethodId', 'name type icon');
  }
}

export const transactionService = new TransactionService();
