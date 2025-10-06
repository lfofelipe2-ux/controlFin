import { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { Category } from '../../src/modules/categories/category.model';
import { PaymentMethod } from '../../src/modules/payment-methods/payment-method.model';
import { Transaction } from '../../src/modules/transactions/transaction.model';
import { User } from '../../src/modules/users/user.model';
import { buildApp } from '../../src/server';

describe.skip('Transaction Security Tests', () => {
  let app: FastifyInstance;
  let authToken: string;
  let userId: string;
  let spaceId: string;
  let categoryId: string;
  let paymentMethodId: string;
  // let otherUserId: string;
  // let otherSpaceId: string;

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
    spaceId = user._id.toString();

    // Create other user for isolation tests
    const otherUser = new User({
      email: 'other@example.com',
      password: 'hashedpassword',
      firstName: 'Other',
      lastName: 'User',
    });
    await otherUser.save();
    otherUserId = otherUser._id.toString();
    otherSpaceId = otherUser._id.toString();

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

  describe('Authentication Security', () => {
    it('should reject requests without authentication', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/transactions',
      });

      expect(response.statusCode).toBe(401);
    });

    it('should reject requests with invalid token', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/transactions',
        headers: {
          authorization: 'Bearer invalid-token',
        },
      });

      expect(response.statusCode).toBe(401);
    });

    it('should reject requests with malformed authorization header', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/transactions',
        headers: {
          authorization: 'InvalidFormat',
        },
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('Data Isolation Security', () => {
    beforeEach(async () => {
      // Create transaction for user 1
      const transaction = new Transaction({
        spaceId,
        userId,
        type: 'expense',
        amount: 100.5,
        description: 'User 1 Transaction',
        categoryId,
        paymentMethodId,
        date: new Date('2025-01-01'),
        tags: ['private'],
      });
      await transaction.save();
    });

    it("should not allow user to access other user's transactions", async () => {
      // Try to access with other user's token (simulated)
      const response = await app.inject({
        method: 'GET',
        url: '/api/transactions',
        headers: {
          authorization: `Bearer other-user-token`,
        },
      });

      // Should return empty results, not user 1's transactions
      expect(response.statusCode).toBe(200);
      const result = JSON.parse(response.payload);
      expect(result.data.transactions).toHaveLength(0);
    });

    it("should not allow user to access other user's transaction by ID", async () => {
      // Create transaction for user 1
      const transaction = new Transaction({
        spaceId,
        userId,
        type: 'expense',
        amount: 100.5,
        description: 'User 1 Private Transaction',
        categoryId,
        paymentMethodId,
        date: new Date('2025-01-01'),
        tags: ['private'],
      });
      await transaction.save();
      const transactionId = transaction._id.toString();

      // Try to access with other user's token
      const response = await app.inject({
        method: 'GET',
        url: `/api/transactions/${transactionId}`,
        headers: {
          authorization: `Bearer other-user-token`,
        },
      });

      expect(response.statusCode).toBe(404);
    });

    it("should not allow user to update other user's transaction", async () => {
      // Create transaction for user 1
      const transaction = new Transaction({
        spaceId,
        userId,
        type: 'expense',
        amount: 100.5,
        description: 'User 1 Transaction',
        categoryId,
        paymentMethodId,
        date: new Date('2025-01-01'),
        tags: ['private'],
      });
      await transaction.save();
      const transactionId = transaction._id.toString();

      // Try to update with other user's token
      const response = await app.inject({
        method: 'PUT',
        url: `/api/transactions/${transactionId}`,
        headers: {
          authorization: `Bearer other-user-token`,
        },
        payload: {
          description: 'Hacked Transaction',
        },
      });

      expect(response.statusCode).toBe(404);
    });

    it("should not allow user to delete other user's transaction", async () => {
      // Create transaction for user 1
      const transaction = new Transaction({
        spaceId,
        userId,
        type: 'expense',
        amount: 100.5,
        description: 'User 1 Transaction',
        categoryId,
        paymentMethodId,
        date: new Date('2025-01-01'),
        tags: ['private'],
      });
      await transaction.save();
      const transactionId = transaction._id.toString();

      // Try to delete with other user's token
      const response = await app.inject({
        method: 'DELETE',
        url: `/api/transactions/${transactionId}`,
        headers: {
          authorization: `Bearer other-user-token`,
        },
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('Input Validation Security', () => {
    it('should reject SQL injection attempts', async () => {
      const maliciousInput = "'; DROP TABLE transactions; --";

      const response = await app.inject({
        method: 'GET',
        url: `/api/transactions?search=${encodeURIComponent(maliciousInput)}`,
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      // Should not cause database errors
      const result = JSON.parse(response.payload);
      expect(result.success).toBe(true);
    });

    it('should reject NoSQL injection attempts', async () => {
      const maliciousInput = '{"$ne": null}';

      const response = await app.inject({
        method: 'GET',
        url: `/api/transactions?type=${encodeURIComponent(maliciousInput)}`,
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.statusCode).toBe(400);
      // Should reject malformed input
    });

    it('should reject XSS attempts in transaction description', async () => {
      const xssPayload = '<script>alert("XSS")</script>';

      const response = await app.inject({
        method: 'POST',
        url: '/api/transactions',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        payload: {
          type: 'expense',
          amount: 100.5,
          description: xssPayload,
          categoryId,
          paymentMethodId,
          date: '2025-01-01T00:00:00.000Z',
        },
      });

      expect(response.statusCode).toBe(201);
      const result = JSON.parse(response.payload);
      // Description should be sanitized or escaped
      expect(result.data.description).not.toContain('<script>');
    });

    it('should reject extremely large payloads', async () => {
      const largeDescription = 'A'.repeat(10000); // 10KB description

      const response = await app.inject({
        method: 'POST',
        url: '/api/transactions',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        payload: {
          type: 'expense',
          amount: 100.5,
          description: largeDescription,
          categoryId,
          paymentMethodId,
          date: '2025-01-01T00:00:00.000Z',
        },
      });

      expect(response.statusCode).toBe(400);
      // Should reject oversized payloads
    });

    it('should reject negative amounts', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/transactions',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        payload: {
          type: 'expense',
          amount: -100.5,
          description: 'Negative Amount',
          categoryId,
          paymentMethodId,
          date: '2025-01-01T00:00:00.000Z',
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should reject invalid date formats', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/transactions',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        payload: {
          type: 'expense',
          amount: 100.5,
          description: 'Invalid Date',
          categoryId,
          paymentMethodId,
          date: 'invalid-date',
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('Rate Limiting Security', () => {
    it('should enforce rate limiting on transaction creation', async () => {
      const requests = Array.from({ length: 20 }, () =>
        app.inject({
          method: 'POST',
          url: '/api/transactions',
          headers: {
            authorization: `Bearer ${authToken}`,
          },
          payload: {
            type: 'expense',
            amount: 100.5,
            description: 'Rate Limit Test',
            categoryId,
            paymentMethodId,
            date: '2025-01-01T00:00:00.000Z',
          },
        })
      );

      const responses = await Promise.all(requests);

      // Some requests should be rate limited
      const rateLimitedResponses = responses.filter((r) => r.statusCode === 429);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });

    it('should enforce rate limiting on transaction queries', async () => {
      const requests = Array.from({ length: 50 }, () =>
        app.inject({
          method: 'GET',
          url: '/api/transactions',
          headers: {
            authorization: `Bearer ${authToken}`,
          },
        })
      );

      const responses = await Promise.all(requests);

      // Some requests should be rate limited
      const rateLimitedResponses = responses.filter((r) => r.statusCode === 429);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });

  describe('Data Sanitization Security', () => {
    it('should sanitize transaction metadata', async () => {
      const maliciousMetadata = {
        location: '<script>alert("XSS")</script>',
        notes: '${7*7}',
        reference: "REF-001'; DROP TABLE transactions; --",
      };

      const response = await app.inject({
        method: 'POST',
        url: '/api/transactions',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        payload: {
          type: 'expense',
          amount: 100.5,
          description: 'Sanitization Test',
          categoryId,
          paymentMethodId,
          date: '2025-01-01T00:00:00.000Z',
          metadata: maliciousMetadata,
        },
      });

      expect(response.statusCode).toBe(201);
      const result = JSON.parse(response.payload);

      // Metadata should be sanitized
      expect(result.data.metadata.location).not.toContain('<script>');
      expect(result.data.metadata.notes).not.toContain('${');
      expect(result.data.metadata.reference).not.toContain('DROP TABLE');
    });

    it('should sanitize transaction tags', async () => {
      const maliciousTags = ['<script>alert("XSS")</script>', '${7*7}', 'normal-tag'];

      const response = await app.inject({
        method: 'POST',
        url: '/api/transactions',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        payload: {
          type: 'expense',
          amount: 100.5,
          description: 'Tag Sanitization Test',
          categoryId,
          paymentMethodId,
          date: '2025-01-01T00:00:00.000Z',
          tags: maliciousTags,
        },
      });

      expect(response.statusCode).toBe(201);
      const result = JSON.parse(response.payload);

      // Tags should be sanitized
      expect(result.data.tags).not.toContain('<script>');
      expect(result.data.tags).not.toContain('${');
      expect(result.data.tags).toContain('normal-tag');
    });
  });

  describe('Authorization Bypass Security', () => {
    it('should not allow access to transactions with invalid user context', async () => {
      // Try to access with malformed user ID
      const response = await app.inject({
        method: 'GET',
        url: '/api/transactions',
        headers: {
          authorization: `Bearer ${authToken}`,
          'x-user-id': 'invalid-user-id',
        },
      });

      expect(response.statusCode).toBe(401);
    });

    it('should not allow access to transactions with empty user context', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/transactions',
        headers: {
          authorization: `Bearer ${authToken}`,
          'x-user-id': '',
        },
      });

      expect(response.statusCode).toBe(401);
    });
  });
});
