import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Category } from '../../categories/category.model';
import { PaymentMethod } from '../../payment-methods/payment-method.model';
import { Transaction } from '../transaction.model';
import { transactionService } from '../transaction.service';

// Mock the models
vi.mock('../transaction.model');
vi.mock('../../categories/category.model');
vi.mock('../../payment-methods/payment-method.model');

const mockTransaction = {
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
  name: 'Food',
  type: 'expense',
  color: '#FF5722',
  icon: 'food',
  isActive: true,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
};

const mockPaymentMethod = {
  _id: '507f1f77bcf86cd799439015',
  spaceId: '507f1f77bcf86cd799439012',
  userId: '507f1f77bcf86cd799439013',
  name: 'Credit Card',
  type: 'credit_card',
  isActive: true,
  metadata: {
    last4: '1234',
    bank: 'Test Bank',
  },
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
        type: 'expense',
        amount: 100.5,
        description: 'Test Transaction',
        categoryId: '507f1f77bcf86cd799439014',
        paymentMethodId: '507f1f77bcf86cd799439015',
        date: new Date('2025-01-01'),
        tags: ['test', 'expense'],
        metadata: {
          location: 'Test Location',
          notes: 'Test Notes',
        },
      };

      vi.mocked(Transaction.create).mockResolvedValue(mockTransaction as any);
      vi.mocked(Category.findById).mockResolvedValue(mockCategory as any);
      vi.mocked(PaymentMethod.findById).mockResolvedValue(mockPaymentMethod as any);

      const result = await transactionService.createTransaction(createData);

      expect(result).toEqual(mockTransaction);
      expect(Transaction.create).toHaveBeenCalledWith(createData);
    });

    it('should throw error if category not found', async () => {
      const createData = {
        spaceId: '507f1f77bcf86cd799439012',
        userId: '507f1f77bcf86cd799439013',
        type: 'expense',
        amount: 100.5,
        description: 'Test Transaction',
        categoryId: 'invalid-category-id',
        paymentMethodId: '507f1f77bcf86cd799439015',
        date: new Date('2025-01-01'),
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
        type: 'expense',
        amount: 100.5,
        description: 'Test Transaction',
        categoryId: '507f1f77bcf86cd799439014',
        paymentMethodId: 'invalid-payment-method-id',
        date: new Date('2025-01-01'),
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
        search: 'test',
        categoryId: '507f1f77bcf86cd799439014',
        paymentMethodId: '507f1f77bcf86cd799439015',
        type: 'expense',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-31'),
        minAmount: 0,
        maxAmount: 1000,
        page: 1,
        limit: 10,
      };

      const mockQuery = {
        find: vi.fn().mockReturnThis(),
        populate: vi.fn().mockReturnThis(),
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue([mockTransaction]),
      };

      vi.mocked(Transaction.find).mockReturnValue(mockQuery as any);
      vi.mocked(Transaction.countDocuments).mockResolvedValue(1);

      const result = await transactionService.getTransactions(filters);

      expect(result.transactions).toEqual([mockTransaction]);
      expect(result.pagination.total).toBe(1);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
    });

    it('should handle empty results', async () => {
      const filters = {
        spaceId: '507f1f77bcf86cd799439012',
        userId: '507f1f77bcf86cd799439013',
      };

      const mockQuery = {
        find: vi.fn().mockReturnThis(),
        populate: vi.fn().mockReturnThis(),
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue([]),
      };

      vi.mocked(Transaction.find).mockReturnValue(mockQuery as any);
      vi.mocked(Transaction.countDocuments).mockResolvedValue(0);

      const result = await transactionService.getTransactions(filters);

      expect(result.transactions).toEqual([]);
      expect(result.pagination.total).toBe(0);
    });
  });

  describe('getTransactionById', () => {
    it('should get transaction by id', async () => {
      const transactionId = '507f1f77bcf86cd799439011';
      const userId = '507f1f77bcf86cd799439013';

      vi.mocked(Transaction.findOne).mockResolvedValue(mockTransaction as any);

      const result = await transactionService.getTransactionById(transactionId, userId);

      expect(result).toEqual(mockTransaction);
      expect(Transaction.findOne).toHaveBeenCalledWith({
        _id: transactionId,
        userId,
      });
    });

    it('should throw error if transaction not found', async () => {
      const transactionId = 'invalid-id';
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
      const updateData = {
        description: 'Updated Transaction',
        amount: 200.0,
      };

      const updatedTransaction = { ...mockTransaction, ...updateData };

      vi.mocked(Transaction.findOneAndUpdate).mockResolvedValue(updatedTransaction as any);

      const result = await transactionService.updateTransaction(transactionId, userId, updateData);

      expect(result).toEqual(updatedTransaction);
      expect(Transaction.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: transactionId, userId },
        { $set: updateData },
        { new: true, runValidators: true }
      );
    });

    it('should throw error if transaction not found', async () => {
      const transactionId = 'invalid-id';
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

      vi.mocked(Transaction.findOneAndDelete).mockResolvedValue(mockTransaction as any);

      const result = await transactionService.deleteTransaction(transactionId, userId);

      expect(result).toEqual(mockTransaction);
      expect(Transaction.findOneAndDelete).toHaveBeenCalledWith({
        _id: transactionId,
        userId,
      });
    });

    it('should throw error if transaction not found', async () => {
      const transactionId = 'invalid-id';
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
        averageTransaction: 320,
        categoryBreakdown: [
          { category: 'Food', amount: 1000, count: 10 },
          { category: 'Transport', amount: 500, count: 5 },
        ],
        paymentMethodBreakdown: [
          { paymentMethod: 'Credit Card', amount: 2000, count: 15 },
          { paymentMethod: 'Cash', amount: 1000, count: 10 },
        ],
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
