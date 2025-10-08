import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the modules before importing the service
vi.mock('../transaction.model', () => {
  const mockTransaction = vi.fn().mockImplementation((data) => ({
    ...data,
    _id: '507f1f77bcf86cd799439011',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    save: vi.fn().mockResolvedValue({
      ...data,
      _id: '507f1f77bcf86cd799439011',
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    }),
  }));

  // Add static methods to the constructor
  mockTransaction.create = vi.fn();
  mockTransaction.find = vi.fn();
  mockTransaction.findById = vi.fn();
  mockTransaction.findByIdAndUpdate = vi.fn();
  mockTransaction.findByIdAndDelete = vi.fn();
  mockTransaction.findOne = vi.fn();
  mockTransaction.findOneAndUpdate = vi.fn();
  mockTransaction.findOneAndDelete = vi.fn();
  mockTransaction.deleteOne = vi.fn();
  mockTransaction.aggregate = vi.fn();
  mockTransaction.countDocuments = vi.fn();

  return {
    TransactionModel: mockTransaction, // This is the constructor
    ITransaction: {},
  };
});

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

// Import after mocking
import { CategoryModel as Category } from '../../categories/category.model';
import { PaymentMethodModel as PaymentMethod } from '../../payment-methods/payment-method.model';
import { TransactionModel as Transaction } from '../transaction.model';
import { transactionService } from '../transaction.service';

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
      vi.mocked(Category.findById).mockResolvedValue(mockCategory as unknown as Document);
      vi.mocked(PaymentMethod.findById).mockResolvedValue(mockPaymentMethod as unknown as Document);

      const result = await transactionService.createTransaction(createData);

      expect(result).toEqual(mockTransactionData);
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

      vi.mocked(Category.findById).mockResolvedValue(mockCategory as unknown as Document);
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
        populate: vi.fn().mockReturnThis(),
      };

      // Mock the chained query to return the data on the final populate call
      mockQuery.populate.mockImplementation((field) => {
        if (field === 'paymentMethodId') {
          return Promise.resolve([mockTransactionData]);
        }
        return mockQuery;
      });

      vi.mocked(Transaction.find).mockReturnValue(mockQuery as unknown as Document);
      vi.mocked(Transaction.countDocuments).mockResolvedValue(1);

      const result = await transactionService.getTransactions(filters);

      expect(result.transactions).toEqual([mockTransactionData]);
      expect(result.pagination.total).toBe(1);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
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
        populate: vi.fn().mockReturnThis(),
      };

      // Mock the chained query to return empty array on the final populate call
      mockQuery.populate.mockImplementation((field) => {
        if (field === 'paymentMethodId') {
          return Promise.resolve([]);
        }
        return mockQuery;
      });

      vi.mocked(Transaction.find).mockReturnValue(mockQuery as unknown as Document);
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

      vi.mocked(Transaction.findOne).mockResolvedValue(mockTransactionData as unknown as Document);

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

      vi.mocked(Transaction.findOneAndUpdate).mockResolvedValue(updatedTransaction as unknown as Document);

      const result = await transactionService.updateTransaction(transactionId, updateData, userId);

      expect(result).toEqual(updatedTransaction);
      expect(Transaction.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: transactionId, userId },
        { ...updateData, updatedAt: expect.any(Date) },
        { new: true }
      );
    });

    it('should throw error if transaction not found', async () => {
      const transactionId = '507f1f77bcf86cd799439011';
      const userId = '507f1f77bcf86cd799439013';
      const updateData = { description: 'Updated Transaction' };

      vi.mocked(Transaction.findOneAndUpdate).mockResolvedValue(null);

      await expect(
        transactionService.updateTransaction(transactionId, updateData, userId)
      ).rejects.toThrow('Transaction not found');
    });
  });

  describe('deleteTransaction', () => {
    it('should delete transaction successfully', async () => {
      const transactionId = '507f1f77bcf86cd799439011';
      const userId = '507f1f77bcf86cd799439013';
      const mockTransaction = { _id: transactionId, userId, description: 'Test Transaction' };

      vi.mocked(Transaction.findOne).mockResolvedValue(mockTransaction as unknown as Document);
      vi.mocked(Transaction.deleteOne).mockResolvedValue({ deletedCount: 1 } as unknown as Document);

      const result = await transactionService.deleteTransaction(transactionId, userId);

      expect(result).toEqual(mockTransaction);
      expect(Transaction.findOne).toHaveBeenCalledWith({
        _id: transactionId,
        userId,
      });
      expect(Transaction.deleteOne).toHaveBeenCalledWith({
        _id: transactionId,
        userId,
      });
    });

    it('should return null if transaction not found', async () => {
      const transactionId = '507f1f77bcf86cd799439011';
      const userId = '507f1f77bcf86cd799439013';

      vi.mocked(Transaction.findOne).mockResolvedValue(null);

      const result = await transactionService.deleteTransaction(transactionId, userId);

      expect(result).toBe(null);
      expect(Transaction.findOne).toHaveBeenCalledWith({
        _id: transactionId,
        userId,
      });
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

      const mockTransactions = [
        {
          _id: '507f1f77bcf86cd799439011',
          type: 'income',
          amount: 5000,
          categoryId: { name: 'Salary' },
          paymentMethodId: { name: 'Bank' },
          date: new Date('2025-01-15'),
        },
        {
          _id: '507f1f77bcf86cd799439012',
          type: 'expense',
          amount: 3000,
          categoryId: { name: 'Rent' },
          paymentMethodId: { name: 'Credit Card' },
          date: new Date('2025-01-20'),
        },
      ];

      // Mock find method to return transactions with proper chaining
      const mockQuery = {
        populate: vi.fn().mockReturnThis(),
      };
      mockQuery.populate.mockImplementation((field) => {
        if (field === 'paymentMethodId') {
          return Promise.resolve(mockTransactions);
        }
        return mockQuery;
      });

      vi.mocked(Transaction.find).mockReturnValue(mockQuery as unknown as Document);

      const result = await transactionService.getTransactionStats(filters);

      expect(result.totalIncome).toBe(5000);
      expect(result.totalExpense).toBe(3000);
      expect(result.netAmount).toBe(2000);
      expect(result.transactionCount).toBe(2);
      expect(Transaction.find).toHaveBeenCalled();
    });
  });
});