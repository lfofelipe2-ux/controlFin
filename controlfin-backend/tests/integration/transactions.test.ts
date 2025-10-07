import { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { CategoryModel as Category } from '../../src/modules/categories/category.model';
import { PaymentMethodModel as PaymentMethod } from '../../src/modules/payment-methods/payment-method.model';
import { TransactionModel as Transaction } from '../../src/modules/transactions/transaction.model';
import { User } from '../../src/modules/users/user.model';
import { buildApp } from '../../src/server';

describe('Transaction API Integration Tests', () => {
  let app: FastifyInstance;
  let authToken: string;
  let userId: string;
  let spaceId: string;
  let categoryId: string;
  let paymentMethodId: string;

  beforeAll(async () => {
    // Build Fastify app
    app = buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clean database
    await User.deleteMany({});
    await Category.deleteMany({});
    await PaymentMethod.deleteMany({});
    await Transaction.deleteMany({});

    // Create test user
    const user = new User({
      email: 'test@example.com',
      password: 'hashedpassword',
      firstName: 'Test',
      lastName: 'User',
    });
    await user.save();
    userId = user._id.toString();
    spaceId = user._id.toString(); // Using user ID as space ID for simplicity

    // Create test category
    const category = new Category({
      spaceId,
      name: 'Food',
      type: 'expense',
      color: '#FF5722',
      icon: 'food',
      isActive: true,
    });
    await category.save();
    categoryId = category._id.toString();

    // Create test payment method
    const paymentMethod = new PaymentMethod({
      spaceId,
      userId,
      name: 'Credit Card',
      type: 'credit_card',
      isActive: true,
      metadata: {
        last4: '1234',
        bank: 'Test Bank',
      },
    });
    await paymentMethod.save();
    paymentMethodId = paymentMethod._id.toString();

    // Create auth token (simplified for testing)
    authToken = 'test-token';
  });

  describe('POST /api/transactions', () => {
    it('should create a transaction successfully', async () => {
      const transactionData = {
        type: 'expense',
        amount: 100.5,
        description: 'Test Transaction',
        categoryId,
        paymentMethodId,
        date: '2025-01-01T00:00:00.000Z',
        tags: ['test', 'expense'],
        metadata: {
          location: 'Test Location',
          notes: 'Test Notes',
        },
      };

      const response = await app.inject({
        method: 'POST',
        url: '/api/transactions',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        payload: transactionData,
      });

      expect(response.statusCode).toBe(201);
      const result = JSON.parse(response.payload);
      expect(result.success).toBe(true);
      expect(result.data.description).toBe('Test Transaction');
      expect(result.data.amount).toBe(100.5);
      expect(result.data.type).toBe('expense');
    });

    it('should return 400 for invalid transaction data', async () => {
      const invalidData = {
        type: 'invalid-type',
        amount: -100,
        description: '',
      };

      const response = await app.inject({
        method: 'POST',
        url: '/api/transactions',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        payload: invalidData,
      });

      expect(response.statusCode).toBe(400);
      const result = JSON.parse(response.payload);
      expect(result.success).toBe(false);
      expect(result.error).toContain('validation');
    });

    it('should return 404 for non-existent category', async () => {
      const transactionData = {
        type: 'expense',
        amount: 100.5,
        description: 'Test Transaction',
        categoryId: '507f1f77bcf86cd799439999', // Non-existent ID
        paymentMethodId,
        date: '2025-01-01T00:00:00.000Z',
      };

      const response = await app.inject({
        method: 'POST',
        url: '/api/transactions',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        payload: transactionData,
      });

      expect(response.statusCode).toBe(404);
      const result = JSON.parse(response.payload);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Category not found');
    });
  });

  describe('GET /api/transactions', () => {
    beforeEach(async () => {
      // Create test transactions
      const transactions = [
        {
          spaceId,
          userId,
          type: 'expense',
          amount: 100.5,
          description: 'Grocery Shopping',
          categoryId,
          paymentMethodId,
          date: new Date('2025-01-01'),
          tags: ['grocery', 'food'],
        },
        {
          spaceId,
          userId,
          type: 'income',
          amount: 5000.0,
          description: 'Salary',
          categoryId,
          paymentMethodId,
          date: new Date('2025-01-01'),
          tags: ['salary', 'work'],
        },
      ];

      await Transaction.insertMany(transactions);
    });

    it('should get transactions with default pagination', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/transactions',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const result = JSON.parse(response.payload);
      expect(result.success).toBe(true);
      expect(result.data.transactions).toHaveLength(2);
      expect(result.data.pagination.total).toBe(2);
      expect(result.data.pagination.page).toBe(1);
    });

    it('should filter transactions by type', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/transactions?type=expense',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const result = JSON.parse(response.payload);
      expect(result.success).toBe(true);
      expect(result.data.transactions).toHaveLength(1);
      expect(result.data.transactions[0].type).toBe('expense');
    });

    it('should search transactions by description', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/transactions?search=Grocery',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const result = JSON.parse(response.payload);
      expect(result.success).toBe(true);
      expect(result.data.transactions).toHaveLength(1);
      expect(result.data.transactions[0].description).toBe('Grocery Shopping');
    });

    it('should filter transactions by date range', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/transactions?startDate=2025-01-01&endDate=2025-01-31',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const result = JSON.parse(response.payload);
      expect(result.success).toBe(true);
      expect(result.data.transactions).toHaveLength(2);
    });
  });

  describe('GET /api/transactions/:id', () => {
    let transactionId: string;

    beforeEach(async () => {
      const transaction = new Transaction({
        spaceId,
        userId,
        type: 'expense',
        amount: 100.5,
        description: 'Test Transaction',
        categoryId,
        paymentMethodId,
        date: new Date('2025-01-01'),
        tags: ['test'],
      });
      await transaction.save();
      transactionId = transaction._id.toString();
    });

    it('should get transaction by id', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `/api/transactions/${transactionId}`,
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const result = JSON.parse(response.payload);
      expect(result.success).toBe(true);
      expect(result.data.description).toBe('Test Transaction');
      expect(result.data.amount).toBe(100.5);
    });

    it('should return 404 for non-existent transaction', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/transactions/507f1f77bcf86cd799439999',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.statusCode).toBe(404);
      const result = JSON.parse(response.payload);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Transaction not found');
    });
  });

  describe('PUT /api/transactions/:id', () => {
    let transactionId: string;

    beforeEach(async () => {
      const transaction = new Transaction({
        spaceId,
        userId,
        type: 'expense',
        amount: 100.5,
        description: 'Test Transaction',
        categoryId,
        paymentMethodId,
        date: new Date('2025-01-01'),
        tags: ['test'],
      });
      await transaction.save();
      transactionId = transaction._id.toString();
    });

    it('should update transaction successfully', async () => {
      const updateData = {
        description: 'Updated Transaction',
        amount: 200.0,
      };

      const response = await app.inject({
        method: 'PUT',
        url: `/api/transactions/${transactionId}`,
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        payload: updateData,
      });

      expect(response.statusCode).toBe(200);
      const result = JSON.parse(response.payload);
      expect(result.success).toBe(true);
      expect(result.data.description).toBe('Updated Transaction');
      expect(result.data.amount).toBe(200.0);
    });

    it('should return 404 for non-existent transaction', async () => {
      const updateData = {
        description: 'Updated Transaction',
      };

      const response = await app.inject({
        method: 'PUT',
        url: '/api/transactions/507f1f77bcf86cd799439999',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        payload: updateData,
      });

      expect(response.statusCode).toBe(404);
      const result = JSON.parse(response.payload);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Transaction not found');
    });
  });

  describe('DELETE /api/transactions/:id', () => {
    let transactionId: string;

    beforeEach(async () => {
      const transaction = new Transaction({
        spaceId,
        userId,
        type: 'expense',
        amount: 100.5,
        description: 'Test Transaction',
        categoryId,
        paymentMethodId,
        date: new Date('2025-01-01'),
        tags: ['test'],
      });
      await transaction.save();
      transactionId = transaction._id.toString();
    });

    it('should delete transaction successfully', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: `/api/transactions/${transactionId}`,
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const result = JSON.parse(response.payload);
      expect(result.success).toBe(true);
      expect(result.data.description).toBe('Test Transaction');

      // Verify transaction is deleted
      const deletedTransaction = await Transaction.findById(transactionId);
      expect(deletedTransaction).toBeNull();
    });

    it('should return 404 for non-existent transaction', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: '/api/transactions/507f1f77bcf86cd799439999',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.statusCode).toBe(404);
      const result = JSON.parse(response.payload);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Transaction not found');
    });
  });

  describe('GET /api/transactions/stats/summary', () => {
    beforeEach(async () => {
      // Create test transactions for stats
      const transactions = [
        {
          spaceId,
          userId,
          type: 'income',
          amount: 5000.0,
          description: 'Salary',
          categoryId,
          paymentMethodId,
          date: new Date('2025-01-01'),
        },
        {
          spaceId,
          userId,
          type: 'expense',
          amount: 1000.0,
          description: 'Rent',
          categoryId,
          paymentMethodId,
          date: new Date('2025-01-01'),
        },
        {
          spaceId,
          userId,
          type: 'expense',
          amount: 500.0,
          description: 'Food',
          categoryId,
          paymentMethodId,
          date: new Date('2025-01-01'),
        },
      ];

      await Transaction.insertMany(transactions);
    });

    it('should get transaction statistics', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/transactions/stats/summary',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const result = JSON.parse(response.payload);
      expect(result.success).toBe(true);
      expect(result.data.totalIncome).toBe(5000);
      expect(result.data.totalExpense).toBe(1500);
      expect(result.data.netAmount).toBe(3500);
      expect(result.data.transactionCount).toBe(3);
    });
  });
});
