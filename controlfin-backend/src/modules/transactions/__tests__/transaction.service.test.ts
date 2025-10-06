import { beforeEach, describe, expect, it, vi } from 'vitest';
import { transactionService } from '../transaction.service';

// Mock the entire modules
vi.mock('../transaction.model', () => ({
  TransactionModel: {
    create: vi.fn(),
    find: vi.fn(),
    findById: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findByIdAndDelete: vi.fn(),
    findOne: vi.fn(),
    findOneAndUpdate: vi.fn(),
    findOneAndDelete: vi.fn(),
    aggregate: vi.fn(),
    countDocuments: vi.fn(),
  },
}));

vi.mock('../../categories/category.model', () => ({
  CategoryModel: {
    findById: vi.fn(),
  },
}));

vi.mock('../../payment-methods/payment-method.model', () => ({
  PaymentMethodModel: {
    findById: vi.fn(),
  },
}));

// Import the mocked modules
import { TransactionModel as Transaction } from '../transaction.model';
import { CategoryModel as Category } from '../../categories/category.model';
import { PaymentMethodModel as PaymentMethod } from '../../payment-methods/payment-method.model';

const mockTransactionData = {
  _id: '507f1f77bcf86cd799439011',
  spaceId: '507f1f77bcf86cd799439012',
  userId: '507f1f77bcf86cd799439013',
  type: 'expense',
  amount: 100.5,
  description: 'Test Transaction',
  categoryId: '507f1f77bcf86cd799439014',
  paymentMethodId: '507f1f77bcf86cd799439015',
  date: new Date('2025-01-01'),
  tags: ['test', 'expense'],
  isRecurring: false,
  metadata: {
    location: 'Test Location',
    notes: 'Test Notes',
  },
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
};

const mockCategory = {
  _id: '507f1f77bcf86cd799439014',
  spaceId: '507f1f77bcf86cd799439012',
  name: 'Test Category',
  type: 'expense',
  color: '#FF0000',
  icon: 'test-icon',
  isActive: true,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
};

const mockPaymentMethod = {
  _id: '507f1f77bcf86cd799439015',
  spaceId: '507f1f77bcf86cd799439012',
  name: 'Test Payment Method',
  type: 'credit_card',
  isActive: true,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
};

describe('TransactionService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createTransaction', () => {
    it('should create a transaction successfully', async () => {
      const createData = {
        spaceId: '507f1f77bcf86cd799439012',
        userId: '507f1f77bcf86cd799439013',
        type: 'expense' as const,
        amount: 100.5,
        description: 'Test Transaction',
        categoryId: '507f1f77bcf86cd799439014',
        paymentMethodId: '507f1f77bcf86cd799439015',
        date: new Date('2025-01-01'),
        tags: ['test', 'expense'],
        isRecurring: false,
        metadata: {
          location: 'Test Location',
          notes: 'Test Notes',
        },
      };

      // Mock the model methods
      vi.mocked(Transaction.create).mockResolvedValue(mockTransactionData as any);
      vi.mocked(Category.findById).mockResolvedValue(mockCategory as any);
      vi.mocked(PaymentMethod.findById).mockResolvedValue(mockPaymentMethod as any);

      const result = await transactionService.createTransaction(createData);

      expect(result).toEqual(mockTransactionData);
      expect(Transaction.create).toHaveBeenCalledWith(createData);
      expect(Category.findById).toHaveBeenCalledWith(createData.categoryId);
      expect(PaymentMethod.findById).toHaveBeenCalledWith(createData.paymentMethodId);
    });

    it('should throw error if category not found', async () => {
      const createData = {
        spaceId: '507f1f77bcf86cd799439012',
        userId: '507f1f77bcf86cd799439013',
        type: 'expense' as const,
        amount: 100.5,
        description: 'Test Transaction',
        categoryId: '507f1f77bcf86cd799439014',
        paymentMethodId: '507f1f77bcf86cd799439015',
        date: new Date('2025-01-01'),
        tags: ['test', 'expense'],
        isRecurring: false,
        metadata: {
          location: 'Test Location',
          notes: 'Test Notes',
        },
      };

      vi.mocked(Category.findById).mockResolvedValue(null);

      await expect(transactionService.createTransaction(createData)).rejects.toThrow(
        'Category not found'
      );
    });

    it('should throw error if payment method not found', async () => {
      const createData = {
        spaceId: '507f1f77bcf86cd799439012',
        userId: '507f1f77bcf86cd799439013',
        type: 'expense' as const,
        amount: 100.5,
        description: 'Test Transaction',
        categoryId: '507f1f77bcf86cd799439014',
        paymentMethodId: '507f1f77bcf86cd799439015',
        date: new Date('2025-01-01'),
        tags: ['test', 'expense'],
        isRecurring: false,
        metadata: {
          location: 'Test Location',
          notes: 'Test Notes',
        },
      };

      vi.mocked(Category.findById).mockResolvedValue(mockCategory as any);
      vi.mocked(PaymentMethod.findById).mockResolvedValue(null);

      await expect(transactionService.createTransaction(createData)).rejects.toThrow(
        'Payment method not found'
      );
    });
  });

  describe('getTransactions', () => {
    it('should get transactions with filters', async () => {
      const filters = {
        spaceId: '507f1f77bcf86cd799439012',
        userId: '507f1f77bcf86cd799439013',
        type: 'expense' as const,
        page: 1,
        limit: 10,
      };

      const mockQuery = {
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue([mockTransactionData]),
      };

      vi.mocked(Transaction.find).mockReturnValue(mockQuery as any);
      vi.mocked(Transaction.countDocuments).mockResolvedValue(1);

      const result = await transactionService.getTransactions(filters);

      expect(result.transactions).toEqual([mockTransactionData]);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should handle empty results', async () => {
      const filters = {
        spaceId: '507f1f77bcf86cd799439012',
        userId: '507f1f77bcf86cd799439013',
        page: 1,
        limit: 10,
      };

      const mockQuery = {
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue([]),
      };

      vi.mocked(Transaction.find).mockReturnValue(mockQuery as any);
      vi.mocked(Transaction.countDocuments).mockResolvedValue(0);

      const result = await transactionService.getTransactions(filters);

      expect(result.transactions).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe('getTransactionById', () => {
    it('should get transaction by id', async () => {
      const transactionId = '507f1f77bcf86cd799439011';
      const userId = '507f1f77bcf86cd799439013';

      vi.mocked(Transaction.findOne).mockResolvedValue(mockTransactionData as any);

      const result = await transactionService.getTransactionById(transactionId, userId);

      expect(result).toEqual(mockTransactionData);
      expect(Transaction.findOne).toHaveBeenCalledWith({
        _id: transactionId,
        userId,
      });
    });

    it('should throw error if transaction not found', async () => {
      const transactionId = '507f1f77bcf86cd799439011';
      const userId = '507f1f77bcf86cd799439013';

      vi.mocked(Transaction.findOne).mockResolvedValue(null);

      await expect(transactionService.getTransactionById(transactionId, userId)).rejects.toThrow(
        'Transaction not found'
      );
    });
  });

  describe('updateTransaction', () => {
    it('should update transaction successfully', async () => {
      const transactionId = '507f1f77bcf86cd799439011';
      const userId = '507f1f77bcf86cd799439013';
      const updateData = { description: 'Updated Transaction' };
      const updatedTransaction = { ...mockTransactionData, ...updateData };

      vi.mocked(Transaction.findOneAndUpdate).mockResolvedValue(updatedTransaction as any);

      const result = await transactionService.updateTransaction(transactionId, userId, updateData);

      expect(result).toEqual(updatedTransaction);
      expect(Transaction.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: transactionId, userId },
        updateData,
        { new: true }
      );
    });

    it('should throw error if transaction not found', async () => {
      const transactionId = '507f1f77bcf86cd799439011';
      const userId = '507f1f77bcf86cd799439013';
      const updateData = { description: 'Updated Transaction' };

      vi.mocked(Transaction.findOneAndUpdate).mockResolvedValue(null);

      await expect(
        transactionService.updateTransaction(transactionId, userId, updateData)
      ).rejects.toThrow('Transaction not found');
    });
  });

  describe('deleteTransaction', () => {
    it('should delete transaction successfully', async () => {
      const transactionId = '507f1f77bcf86cd799439011';
      const userId = '507f1f77bcf86cd799439013';

      vi.mocked(Transaction.findOneAndDelete).mockResolvedValue(mockTransactionData as any);

      const result = await transactionService.deleteTransaction(transactionId, userId);

      expect(result).toEqual(mockTransactionData);
      expect(Transaction.findOneAndDelete).toHaveBeenCalledWith({
        _id: transactionId,
        userId,
      });
    });

    it('should throw error if transaction not found', async () => {
      const transactionId = '507f1f77bcf86cd799439011';
      const userId = '507f1f77bcf86cd799439013';

      vi.mocked(Transaction.findOneAndDelete).mockResolvedValue(null);

      await expect(transactionService.deleteTransaction(transactionId, userId)).rejects.toThrow(
        'Transaction not found'
      );
    });
  });

  describe('getTransactionStats', () => {
    it('should get transaction statistics', async () => {
      const filters = {
        spaceId: '507f1f77bcf86cd799439012',
        userId: '507f1f77bcf86cd799439013',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-31'),
      };

      const mockStats = {
        totalIncome: 5000,
        totalExpense: 3000,
        netAmount: 2000,
        transactionCount: 25,
      };

      // Mock aggregation pipeline
      const mockAggregate = vi.fn().mockResolvedValue([mockStats]);
      vi.mocked(Transaction.aggregate).mockImplementation(mockAggregate);

      const result = await transactionService.getTransactionStats(filters);

      expect(result).toEqual(mockStats);
      expect(Transaction.aggregate).toHaveBeenCalled();
    });
  });
});