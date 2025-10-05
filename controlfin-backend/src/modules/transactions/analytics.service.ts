import { ITransaction, TransactionModel as Transaction } from './transaction.model';

export interface AnalyticsParams {
  userId: string;
  spaceId?: string;
  startDate?: string;
  endDate?: string;
  type?: 'income' | 'expense' | 'transfer';
  groupBy?: 'day' | 'week' | 'month' | 'year';
}

export interface SpendingTrend {
  period: string;
  income: number;
  expenses: number;
  net: number;
  transactionCount: number;
}

export interface CategoryAnalysis {
  categoryId: string;
  categoryName: string;
  amount: number;
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  avgTransaction: number;
}

export interface PaymentMethodAnalysis {
  paymentMethodId: string;
  paymentMethodName: string;
  amount: number;
  count: number;
  percentage: number;
  avgTransaction: number;
}

export interface MonthlyComparison {
  currentMonth: {
    income: number;
    expenses: number;
    net: number;
    transactionCount: number;
  };
  previousMonth: {
    income: number;
    expenses: number;
    net: number;
    transactionCount: number;
  };
  changes: {
    incomeChange: number;
    expenseChange: number;
    netChange: number;
    transactionCountChange: number;
  };
}

export interface FinancialHealth {
  totalIncome: number;
  totalExpenses: number;
  netWorth: number;
  savingsRate: number;
  expenseRatio: number;
  monthlyTrend: 'improving' | 'declining' | 'stable';
  topSpendingCategory: string;
  topIncomeCategory: string;
  averageTransaction: number;
  transactionFrequency: number;
}

class AnalyticsService {
  async getSpendingTrends(params: AnalyticsParams): Promise<SpendingTrend[]> {
    const { userId, spaceId, startDate, endDate, type, groupBy = 'month' } = params;

    // Build filter query
    const filter: any = { userId };
    if (spaceId) filter.spaceId = spaceId;
    if (type) filter.type = type;

    // Date range filter
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // Group by period
    let groupFormat: string;
    switch (groupBy) {
      case 'day':
        groupFormat = '%Y-%m-%d';
        break;
      case 'week':
        groupFormat = '%Y-%U';
        break;
      case 'month':
        groupFormat = '%Y-%m';
        break;
      case 'year':
        groupFormat = '%Y';
        break;
      default:
        groupFormat = '%Y-%m';
    }

    const pipeline: any[] = [
      { $match: filter },
      {
        $group: {
          _id: {
            $dateToString: {
              format: groupFormat,
              date: '$date',
            },
          },
          income: {
            $sum: {
              $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0],
            },
          },
          expenses: {
            $sum: {
              $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0],
            },
          },
          transactionCount: { $sum: 1 },
        },
      },
      {
        $addFields: {
          net: { $subtract: ['$income', '$expenses'] },
        },
      },
      {
        $project: {
          period: '$_id',
          income: 1,
          expenses: 1,
          net: 1,
          transactionCount: 1,
          _id: 0,
        },
      },
      { $sort: { period: 1 } },
    ];

    const results = await Transaction.aggregate(pipeline);
    return results;
  }

  async getCategoryAnalysis(params: AnalyticsParams): Promise<CategoryAnalysis[]> {
    const { userId, spaceId, startDate, endDate, type } = params;

    // Build filter query
    const filter: any = { userId };
    if (spaceId) filter.spaceId = spaceId;
    if (type) filter.type = type;

    // Date range filter
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const pipeline: any[] = [
      { $match: filter },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' },
      {
        $group: {
          _id: '$categoryId',
          categoryName: { $first: '$category.name' },
          amount: { $sum: '$amount' },
          count: { $sum: 1 },
          transactions: { $push: '$$ROOT' },
        },
      },
      {
        $addFields: {
          avgTransaction: { $divide: ['$amount', '$count'] },
        },
      },
      { $sort: { amount: -1 } },
    ];

    const results = await Transaction.aggregate(pipeline);
    const totalAmount = results.reduce((sum, item) => sum + item.amount, 0);

    return results.map((item) => ({
      categoryId: item._id.toString(),
      categoryName: item.categoryName,
      amount: item.amount,
      count: item.count,
      percentage: totalAmount > 0 ? (item.amount / totalAmount) * 100 : 0,
      trend: this.calculateTrend(item.transactions),
      avgTransaction: item.avgTransaction,
    }));
  }

  async getPaymentMethodAnalysis(params: AnalyticsParams): Promise<PaymentMethodAnalysis[]> {
    const { userId, spaceId, startDate, endDate, type } = params;

    // Build filter query
    const filter: any = { userId };
    if (spaceId) filter.spaceId = spaceId;
    if (type) filter.type = type;

    // Date range filter
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const pipeline: any[] = [
      { $match: filter },
      {
        $lookup: {
          from: 'paymentmethods',
          localField: 'paymentMethodId',
          foreignField: '_id',
          as: 'paymentMethod',
        },
      },
      { $unwind: '$paymentMethod' },
      {
        $group: {
          _id: '$paymentMethodId',
          paymentMethodName: { $first: '$paymentMethod.name' },
          amount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $addFields: {
          avgTransaction: { $divide: ['$amount', '$count'] },
        },
      },
      { $sort: { amount: -1 } },
    ];

    const results = await Transaction.aggregate(pipeline);
    const totalAmount = results.reduce((sum, item) => sum + item.amount, 0);

    return results.map((item) => ({
      paymentMethodId: item._id.toString(),
      paymentMethodName: item.paymentMethodName,
      amount: item.amount,
      count: item.count,
      percentage: totalAmount > 0 ? (item.amount / totalAmount) * 100 : 0,
      avgTransaction: item.avgTransaction,
    }));
  }

  async getMonthlyComparison(params: AnalyticsParams): Promise<MonthlyComparison> {
    const { userId, spaceId } = params;
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const filter: any = { userId };
    if (spaceId) filter.spaceId = spaceId;

    const [currentMonthData, previousMonthData] = await Promise.all([
      this.getMonthData(filter, currentMonthStart, now),
      this.getMonthData(filter, previousMonthStart, previousMonthEnd),
    ]);

    return {
      currentMonth: currentMonthData,
      previousMonth: previousMonthData,
      changes: {
        incomeChange: this.calculatePercentageChange(
          previousMonthData.income,
          currentMonthData.income
        ),
        expenseChange: this.calculatePercentageChange(
          previousMonthData.expenses,
          currentMonthData.expenses
        ),
        netChange: this.calculatePercentageChange(previousMonthData.net, currentMonthData.net),
        transactionCountChange: this.calculatePercentageChange(
          previousMonthData.transactionCount,
          currentMonthData.transactionCount
        ),
      },
    };
  }

  async getFinancialHealth(params: AnalyticsParams): Promise<FinancialHealth> {
    const { userId, spaceId, startDate, endDate } = params;

    // Build filter query
    const filter: any = { userId };
    if (spaceId) filter.spaceId = spaceId;

    // Date range filter - default to last 12 months
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    } else {
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
      filter.date = { $gte: twelveMonthsAgo };
    }

    const transactions = await Transaction.find(filter)
      .populate('categoryId', 'name')
      .populate('paymentMethodId', 'name');

    const totalIncome = transactions
      .filter((t: ITransaction) => t.type === 'income')
      .reduce((sum: number, t: ITransaction) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t: ITransaction) => t.type === 'expense')
      .reduce((sum: number, t: ITransaction) => sum + t.amount, 0);

    const netWorth = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (netWorth / totalIncome) * 100 : 0;
    const expenseRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;

    // Calculate monthly trend
    const monthlyData = await this.getSpendingTrends({
      ...params,
      groupBy: 'month',
    });

    const monthlyTrend = this.calculateMonthlyTrend(monthlyData);

    // Find top spending and income categories
    const categoryAnalysis = await this.getCategoryAnalysis(params);
    const topSpendingCategory =
      categoryAnalysis.filter((c) => c.amount > 0).sort((a, b) => b.amount - a.amount)[0]
        ?.categoryName || 'N/A';

    const topIncomeCategory =
      categoryAnalysis.filter((c) => c.amount > 0).sort((a, b) => b.amount - a.amount)[0]
        ?.categoryName || 'N/A';

    const averageTransaction =
      transactions.length > 0 ? (totalIncome + totalExpenses) / transactions.length : 0;

    const transactionFrequency = transactions.length / 12; // per month

    return {
      totalIncome,
      totalExpenses,
      netWorth,
      savingsRate,
      expenseRatio,
      monthlyTrend,
      topSpendingCategory,
      topIncomeCategory,
      averageTransaction,
      transactionFrequency,
    };
  }

  private async getMonthData(filter: any, startDate: Date, endDate: Date) {
    const monthFilter = {
      ...filter,
      date: { $gte: startDate, $lte: endDate },
    };

    const transactions = await Transaction.find(monthFilter);

    const income = transactions
      .filter((t: ITransaction) => t.type === 'income')
      .reduce((sum: number, t: ITransaction) => sum + t.amount, 0);

    const expenses = transactions
      .filter((t: ITransaction) => t.type === 'expense')
      .reduce((sum: number, t: ITransaction) => sum + t.amount, 0);

    return {
      income,
      expenses,
      net: income - expenses,
      transactionCount: transactions.length,
    };
  }

  private calculateTrend(transactions: ITransaction[]): 'up' | 'down' | 'stable' {
    if (transactions.length < 2) return 'stable';

    const sorted = transactions.sort((a, b) => a.date.getTime() - b.date.getTime());
    const firstHalf = sorted.slice(0, Math.floor(sorted.length / 2));
    const secondHalf = sorted.slice(Math.floor(sorted.length / 2));

    const firstHalfAvg = firstHalf.reduce((sum, t) => sum + t.amount, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, t) => sum + t.amount, 0) / secondHalf.length;

    const change = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;

    if (change > 5) return 'up';
    if (change < -5) return 'down';
    return 'stable';
  }

  private calculatePercentageChange(oldValue: number, newValue: number): number {
    if (oldValue === 0) return newValue > 0 ? 100 : 0;
    return ((newValue - oldValue) / oldValue) * 100;
  }

  private calculateMonthlyTrend(
    monthlyData: SpendingTrend[]
  ): 'improving' | 'declining' | 'stable' {
    if (monthlyData.length < 2) return 'stable';

    const recent = monthlyData.slice(-3); // Last 3 months
    const netValues = recent.map((m) => m.net);

    const isImproving = netValues.every((val, i) => i === 0 || val >= (netValues[i - 1] || 0));
    const isDeclining = netValues.every((val, i) => i === 0 || val <= (netValues[i - 1] || 0));

    if (isImproving) return 'improving';
    if (isDeclining) return 'declining';
    return 'stable';
  }
}

export const analyticsService = new AnalyticsService();
