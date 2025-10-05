import { IPaymentMethod, PaymentMethodModel as PaymentMethod } from './payment-method.model';

export interface CreatePaymentMethodData {
  spaceId: string;
  userId: string;
  name: string;
  description?: string;
  type: 'cash' | 'card' | 'bank' | 'digital' | 'crypto' | 'other';
  icon?: string;
  color: string;
  isDefault?: boolean;
  metadata?: {
    last4Digits?: string;
    bankName?: string;
    accountNumber?: string;
    routingNumber?: string;
    cardType?: string;
    expiryDate?: string;
    currency?: string;
  };
}

export interface UpdatePaymentMethodData {
  name?: string;
  description?: string;
  type?: 'cash' | 'card' | 'bank' | 'digital' | 'crypto' | 'other';
  icon?: string;
  color?: string;
  isDefault?: boolean;
  metadata?: {
    last4Digits?: string;
    bankName?: string;
    accountNumber?: string;
    routingNumber?: string;
    cardType?: string;
    expiryDate?: string;
    currency?: string;
  };
}

export interface GetPaymentMethodsParams {
  userId: string;
  spaceId?: string;
  type?: 'cash' | 'card' | 'bank' | 'digital' | 'crypto' | 'other';
  isDefault?: boolean;
  search?: string;
}

class PaymentMethodService {
  async createPaymentMethod(data: CreatePaymentMethodData): Promise<IPaymentMethod> {
    const paymentMethod = new PaymentMethod(data);
    return await paymentMethod.save();
  }

  async getPaymentMethodById(id: string, userId: string): Promise<IPaymentMethod | null> {
    return await PaymentMethod.findOne({ _id: id, userId });
  }

  async updatePaymentMethod(
    id: string,
    updateData: UpdatePaymentMethodData,
    userId: string
  ): Promise<IPaymentMethod | null> {
    return await PaymentMethod.findOneAndUpdate(
      { _id: id, userId },
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );
  }

  async deletePaymentMethod(id: string, userId: string): Promise<boolean> {
    // Check if payment method is used in transactions
    const { TransactionModel } = await import('../transactions/transaction.model');
    const transactionCount = await TransactionModel.countDocuments({ paymentMethodId: id, userId });
    if (transactionCount > 0) {
      throw new Error('Cannot delete payment method that is used in transactions');
    }

    const result = await PaymentMethod.deleteOne({ _id: id, userId });
    return result.deletedCount > 0;
  }

  async getPaymentMethods(params: GetPaymentMethodsParams): Promise<IPaymentMethod[]> {
    const { userId, spaceId, type, isDefault, search } = params;

    // Build filter query
    const filter: any = { userId };

    if (spaceId) filter.spaceId = spaceId;
    if (type) filter.type = type;
    if (isDefault !== undefined) filter.isDefault = isDefault;

    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'metadata.bankName': { $regex: search, $options: 'i' } },
      ];
    }

    return await PaymentMethod.find(filter).sort({ name: 1 });
  }

  async getDefaultPaymentMethods(userId: string): Promise<IPaymentMethod[]> {
    return await PaymentMethod.find({ userId, isDefault: true }).sort({ name: 1 });
  }

  async getPaymentMethodsByType(
    userId: string,
    type: 'cash' | 'card' | 'bank' | 'digital' | 'crypto' | 'other',
    spaceId?: string
  ): Promise<IPaymentMethod[]> {
    const filter: any = { userId, type };
    if (spaceId) filter.spaceId = spaceId;

    return await PaymentMethod.find(filter).sort({ name: 1 });
  }

  async createDefaultPaymentMethods(userId: string, spaceId: string): Promise<IPaymentMethod[]> {
    const defaultPaymentMethods = [
      {
        spaceId,
        userId,
        name: 'Cash',
        description: 'Physical cash payments',
        type: 'cash' as const,
        icon: 'money-bill',
        color: '#10B981',
        isDefault: true,
        metadata: {
          currency: 'USD',
        },
      },
      {
        spaceId,
        userId,
        name: 'Credit Card',
        description: 'Credit card payments',
        type: 'card' as const,
        icon: 'credit-card',
        color: '#3B82F6',
        isDefault: true,
        metadata: {
          cardType: 'credit',
          currency: 'USD',
        },
      },
      {
        spaceId,
        userId,
        name: 'Debit Card',
        description: 'Debit card payments',
        type: 'card' as const,
        icon: 'credit-card',
        color: '#8B5CF6',
        isDefault: true,
        metadata: {
          cardType: 'debit',
          currency: 'USD',
        },
      },
      {
        spaceId,
        userId,
        name: 'Bank Account',
        description: 'Direct bank account transfers',
        type: 'bank' as const,
        icon: 'university',
        color: '#F59E0B',
        isDefault: true,
        metadata: {
          currency: 'USD',
        },
      },
      {
        spaceId,
        userId,
        name: 'PayPal',
        description: 'PayPal digital payments',
        type: 'digital' as const,
        icon: 'paypal',
        color: '#06B6D4',
        isDefault: true,
        metadata: {
          currency: 'USD',
        },
      },
      {
        spaceId,
        userId,
        name: 'Venmo',
        description: 'Venmo digital payments',
        type: 'digital' as const,
        icon: 'mobile-alt',
        color: '#EC4899',
        isDefault: true,
        metadata: {
          currency: 'USD',
        },
      },
      {
        spaceId,
        userId,
        name: 'Zelle',
        description: 'Zelle bank transfers',
        type: 'digital' as const,
        icon: 'exchange-alt',
        color: '#84CC16',
        isDefault: true,
        metadata: {
          currency: 'USD',
        },
      },
      {
        spaceId,
        userId,
        name: 'Apple Pay',
        description: 'Apple Pay digital wallet',
        type: 'digital' as const,
        icon: 'apple',
        color: '#000000',
        isDefault: true,
        metadata: {
          currency: 'USD',
        },
      },
      {
        spaceId,
        userId,
        name: 'Google Pay',
        description: 'Google Pay digital wallet',
        type: 'digital' as const,
        icon: 'google',
        color: '#4285F4',
        isDefault: true,
        metadata: {
          currency: 'USD',
        },
      },
      {
        spaceId,
        userId,
        name: 'Bitcoin',
        description: 'Bitcoin cryptocurrency',
        type: 'crypto' as const,
        icon: 'bitcoin',
        color: '#F7931A',
        isDefault: true,
        metadata: {
          currency: 'BTC',
        },
      },
      {
        spaceId,
        userId,
        name: 'Ethereum',
        description: 'Ethereum cryptocurrency',
        type: 'crypto' as const,
        icon: 'ethereum',
        color: '#627EEA',
        isDefault: true,
        metadata: {
          currency: 'ETH',
        },
      },
      {
        spaceId,
        userId,
        name: 'Other',
        description: 'Other payment methods',
        type: 'other' as const,
        icon: 'ellipsis-h',
        color: '#6B7280',
        isDefault: true,
        metadata: {
          currency: 'USD',
        },
      },
    ];

    // Check if default payment methods already exist
    const existingPaymentMethods = await PaymentMethod.find({ userId, isDefault: true });
    if (existingPaymentMethods.length > 0) {
      return existingPaymentMethods;
    }

    // Create default payment methods
    const paymentMethods = await PaymentMethod.insertMany(defaultPaymentMethods as any);
    return paymentMethods as IPaymentMethod[];
  }

  async getPaymentMethodStats(
    userId: string,
    spaceId?: string
  ): Promise<{
    totalPaymentMethods: number;
    byType: {
      cash: number;
      card: number;
      bank: number;
      digital: number;
      crypto: number;
      other: number;
    };
    defaultPaymentMethods: number;
  }> {
    const filter: any = { userId };
    if (spaceId) filter.spaceId = spaceId;

    const [totalPaymentMethods, byType, defaultPaymentMethods] = await Promise.all([
      PaymentMethod.countDocuments(filter),
      PaymentMethod.aggregate([
        { $match: filter },
        { $group: { _id: '$type', count: { $sum: 1 } } },
      ]),
      PaymentMethod.countDocuments({ ...filter, isDefault: true }),
    ]);

    const typeStats = {
      cash: 0,
      card: 0,
      bank: 0,
      digital: 0,
      crypto: 0,
      other: 0,
    };

    byType.forEach((item: any) => {
      typeStats[item._id as keyof typeof typeStats] = item.count;
    });

    return {
      totalPaymentMethods,
      byType: typeStats,
      defaultPaymentMethods,
    };
  }

  async getPaymentMethodUsageStats(
    userId: string,
    spaceId?: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<
    Array<{
      paymentMethodId: string;
      paymentMethodName: string;
      transactionCount: number;
      totalAmount: number;
      averageAmount: number;
    }>
  > {
    const { TransactionModel } = await import('../transactions/transaction.model');

    const matchFilter: any = { userId };
    if (spaceId) matchFilter.spaceId = spaceId;
    if (startDate || endDate) {
      matchFilter.date = {};
      if (startDate) matchFilter.date.$gte = startDate;
      if (endDate) matchFilter.date.$lte = endDate;
    }

    const stats = await TransactionModel.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$paymentMethodId',
          transactionCount: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          averageAmount: { $avg: '$amount' },
        },
      },
      {
        $lookup: {
          from: 'paymentmethods',
          localField: '_id',
          foreignField: '_id',
          as: 'paymentMethod',
        },
      },
      {
        $unwind: '$paymentMethod',
      },
      {
        $project: {
          paymentMethodId: '$_id',
          paymentMethodName: '$paymentMethod.name',
          transactionCount: 1,
          totalAmount: 1,
          averageAmount: 1,
        },
      },
      {
        $sort: { totalAmount: -1 },
      },
    ]);

    return stats;
  }
}

export const paymentMethodService = new PaymentMethodService();
