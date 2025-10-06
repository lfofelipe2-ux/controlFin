import { FastifyInstance } from 'fastify';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { Category } from '../../src/modules/categories/category.model';
import { PaymentMethod } from '../../src/modules/payment-methods/payment-method.model';
import { Transaction } from '../../src/modules/transactions/transaction.model';
import { User } from '../../src/modules/users/user.model';
import { buildApp } from '../../src/server';

describe('Transaction Performance Tests', () => {
  let app: FastifyInstance;
  let mongod: MongoMemoryServer;
  let authToken: string;
  let userId: string;
  let spaceId: string;
  let categoryId: string;
  let paymentMethodId: string;

  beforeAll(async () => {
    // Start in-memory MongoDB
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    // Connect to in-memory database
    await mongoose.connect(uri);

    // Build Fastify app
    app = buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
    await mongoose.disconnect();
    await mongod.stop();
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
    spaceId = user._id.toString();

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

    authToken = 'test-token';
  });

  describe('Large Dataset Performance', () => {
    it('should handle 1000 transactions efficiently', async () => {
      // Create 1000 test transactions
      const transactions = Array.from({ length: 1000 }, (_, i) => ({
        spaceId,
        userId,
        type: i % 2 === 0 ? 'expense' : 'income',
        amount: Math.random() * 1000 + 10,
        description: `Transaction ${i}`,
        categoryId,
        paymentMethodId,
        date: new Date(2025, 0, Math.floor(Math.random() * 31) + 1),
        tags: [`tag${i % 10}`],
      }));

      const startTime = Date.now();
      await Transaction.insertMany(transactions);
      const insertTime = Date.now() - startTime;

      console.log(`Inserted 1000 transactions in ${insertTime}ms`);

      // Test query performance
      const queryStartTime = Date.now();
      const response = await app.inject({
        method: 'GET',
        url: '/api/transactions?limit=50',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });
      const queryTime = Date.now() - queryStartTime;

      console.log(`Queried transactions in ${queryTime}ms`);

      expect(response.statusCode).toBe(200);
      expect(queryTime).toBeLessThan(1000); // Should complete within 1 second

      const result = JSON.parse(response.payload);
      expect(result.data.transactions).toHaveLength(50);
      expect(result.data.pagination.total).toBe(1000);
    });

    it('should handle complex filtering efficiently', async () => {
      // Create test data with various types and amounts
      const transactions = Array.from({ length: 500 }, (_, i) => ({
        spaceId,
        userId,
        type: i % 3 === 0 ? 'income' : 'expense',
        amount: Math.random() * 2000 + 10,
        description: `Transaction ${i}`,
        categoryId,
        paymentMethodId,
        date: new Date(2025, 0, Math.floor(Math.random() * 31) + 1),
        tags: [`tag${i % 5}`],
      }));

      await Transaction.insertMany(transactions);

      // Test complex filtering
      const filterStartTime = Date.now();
      const response = await app.inject({
        method: 'GET',
        url: '/api/transactions?type=expense&minAmount=100&maxAmount=1000&search=Transaction&startDate=2025-01-01&endDate=2025-01-31',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });
      const filterTime = Date.now() - filterStartTime;

      console.log(`Complex filtering completed in ${filterTime}ms`);

      expect(response.statusCode).toBe(200);
      expect(filterTime).toBeLessThan(500); // Should complete within 500ms
    });

    it('should handle statistics calculation efficiently', async () => {
      // Create test data
      const transactions = Array.from({ length: 2000 }, (_, i) => ({
        spaceId,
        userId,
        type: i % 2 === 0 ? 'income' : 'expense',
        amount: Math.random() * 1000 + 10,
        description: `Transaction ${i}`,
        categoryId,
        paymentMethodId,
        date: new Date(2025, 0, Math.floor(Math.random() * 31) + 1),
        tags: [`tag${i % 10}`],
      }));

      await Transaction.insertMany(transactions);

      // Test statistics calculation
      const statsStartTime = Date.now();
      const response = await app.inject({
        method: 'GET',
        url: '/api/transactions/stats/summary',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });
      const statsTime = Date.now() - statsStartTime;

      console.log(`Statistics calculation completed in ${statsTime}ms`);

      expect(response.statusCode).toBe(200);
      expect(statsTime).toBeLessThan(2000); // Should complete within 2 seconds
    });
  });

  describe('Concurrent Request Performance', () => {
    beforeEach(async () => {
      // Create test data
      const transactions = Array.from({ length: 100 }, (_, i) => ({
        spaceId,
        userId,
        type: i % 2 === 0 ? 'income' : 'expense',
        amount: Math.random() * 1000 + 10,
        description: `Transaction ${i}`,
        categoryId,
        paymentMethodId,
        date: new Date(2025, 0, Math.floor(Math.random() * 31) + 1),
        tags: [`tag${i % 5}`],
      }));

      await Transaction.insertMany(transactions);
    });

    it('should handle concurrent GET requests efficiently', async () => {
      const concurrentRequests = 10;
      const requests = Array.from({ length: concurrentRequests }, () =>
        app.inject({
          method: 'GET',
          url: '/api/transactions',
          headers: {
            authorization: `Bearer ${authToken}`,
          },
        })
      );

      const startTime = Date.now();
      const responses = await Promise.all(requests);
      const totalTime = Date.now() - startTime;

      console.log(`Handled ${concurrentRequests} concurrent requests in ${totalTime}ms`);

      // All requests should succeed
      responses.forEach((response) => {
        expect(response.statusCode).toBe(200);
      });

      // Should complete within reasonable time
      expect(totalTime).toBeLessThan(5000); // 5 seconds for 10 concurrent requests
    });

    it('should handle concurrent POST requests efficiently', async () => {
      const concurrentRequests = 5;
      const requests = Array.from({ length: concurrentRequests }, (_, i) =>
        app.inject({
          method: 'POST',
          url: '/api/transactions',
          headers: {
            authorization: `Bearer ${authToken}`,
          },
          payload: {
            type: 'expense',
            amount: 100 + i,
            description: `Concurrent Transaction ${i}`,
            categoryId,
            paymentMethodId,
            date: '2025-01-01T00:00:00.000Z',
            tags: ['concurrent'],
          },
        })
      );

      const startTime = Date.now();
      const responses = await Promise.all(requests);
      const totalTime = Date.now() - startTime;

      console.log(`Handled ${concurrentRequests} concurrent POST requests in ${totalTime}ms`);

      // All requests should succeed
      responses.forEach((response) => {
        expect(response.statusCode).toBe(201);
      });

      // Should complete within reasonable time
      expect(totalTime).toBeLessThan(3000); // 3 seconds for 5 concurrent requests
    });
  });

  describe('Memory Usage Performance', () => {
    it('should handle large result sets without memory issues', async () => {
      // Create large dataset
      const transactions = Array.from({ length: 5000 }, (_, i) => ({
        spaceId,
        userId,
        type: i % 2 === 0 ? 'income' : 'expense',
        amount: Math.random() * 1000 + 10,
        description: `Large Transaction ${i}`,
        categoryId,
        paymentMethodId,
        date: new Date(2025, 0, Math.floor(Math.random() * 31) + 1),
        tags: [`tag${i % 20}`],
        metadata: {
          notes: `This is a large transaction with detailed metadata ${i}`,
          location: `Location ${i}`,
          reference: `REF-${i.toString().padStart(6, '0')}`,
        },
      }));

      await Transaction.insertMany(transactions);

      // Test with large limit
      const startTime = Date.now();
      const response = await app.inject({
        method: 'GET',
        url: '/api/transactions?limit=1000',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });
      const queryTime = Date.now() - startTime;

      console.log(`Queried 1000 transactions in ${queryTime}ms`);

      expect(response.statusCode).toBe(200);
      expect(queryTime).toBeLessThan(2000); // Should complete within 2 seconds

      const result = JSON.parse(response.payload);
      expect(result.data.transactions).toHaveLength(1000);
    });
  });

  describe('Database Index Performance', () => {
    it('should use indexes efficiently for common queries', async () => {
      // Create test data
      const transactions = Array.from({ length: 1000 }, (_, i) => ({
        spaceId,
        userId,
        type: i % 2 === 0 ? 'income' : 'expense',
        amount: Math.random() * 1000 + 10,
        description: `Indexed Transaction ${i}`,
        categoryId,
        paymentMethodId,
        date: new Date(2025, 0, Math.floor(Math.random() * 31) + 1),
        tags: [`tag${i % 10}`],
      }));

      await Transaction.insertMany(transactions);

      // Test queries that should use indexes
      const queries = [
        '/api/transactions?type=expense',
        '/api/transactions?startDate=2025-01-01&endDate=2025-01-31',
        '/api/transactions?minAmount=100&maxAmount=500',
        '/api/transactions?search=Indexed',
      ];

      for (const query of queries) {
        const startTime = Date.now();
        const response = await app.inject({
          method: 'GET',
          url: query,
          headers: {
            authorization: `Bearer ${authToken}`,
          },
        });
        const queryTime = Date.now() - startTime;

        console.log(`Query ${query} completed in ${queryTime}ms`);

        expect(response.statusCode).toBe(200);
        expect(queryTime).toBeLessThan(500); // Should complete within 500ms
      }
    });
  });
});
