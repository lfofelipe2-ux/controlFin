import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import Fastify from 'fastify';
import { connectDatabase } from './config/database';
import { env } from './config/env';
import { authMiddleware } from './middlewares/auth.middleware';
import { authorizationMiddleware } from './middlewares/authorization.middleware';
import { inputSanitizationMiddleware } from './middlewares/input-sanitizer';
import { authRoutes } from './modules/auth/auth.routes';
import { categoryRoutes } from './modules/categories/category.routes';
import { paymentMethodRoutes } from './modules/payment-methods/payment-method.routes';
import { analyticsRoutes } from './modules/transactions/analytics.routes';
import { bulkRoutes } from './modules/transactions/bulk.routes';
import { templateRoutes } from './modules/transactions/template.routes';
import { transactionRoutes } from './modules/transactions/transaction.routes';

const buildApp = () => {
  const fastify = Fastify({
    logger:
      process.env['NODE_ENV'] === 'development'
        ? {
          level: process.env['LOG_LEVEL'] || 'info',
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
            },
          },
        }
        : true,
  });

  // Register plugins
  fastify.register(cors, {
    origin: true,
    credentials: true,
  });

  fastify.register(helmet, {
    contentSecurityPolicy: false,
  });

  // Apply different rate limits to different routes
  fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  // Apply global security middleware to all routes except auth
  fastify.addHook('preHandler', async (request, reply) => {
    // Skip auth middleware for auth routes
    if (request.url.startsWith('/api/auth')) {
      return;
    }

    // Apply auth middleware
    await authMiddleware(request, reply);
  });

  fastify.addHook('preHandler', async (request, reply) => {
    // Skip authorization middleware for auth routes
    if (request.url.startsWith('/api/auth')) {
      return;
    }

    // Apply authorization middleware
    await authorizationMiddleware(request, reply);
  });

  fastify.addHook('preHandler', async (request, reply) => {
    // Skip input sanitization for auth routes
    if (request.url.startsWith('/api/auth')) {
      return;
    }

    // Apply input sanitization middleware
    await inputSanitizationMiddleware(request, reply);
  });

  // Apply stricter rate limits to transaction routes (after authentication)
  fastify.addHook('preHandler', async (request, reply) => {
    if (request.url.startsWith('/api/transactions')) {
      // Apply transaction-specific rate limiting
      const clientIP = request.ip || request.socket.remoteAddress || 'unknown';
      const key = `transaction_rate_limit:${clientIP}`;
      const now = Date.now();
      const windowMs = 15 * 60 * 1000; // 15 minutes
      const max = 10; // 10 requests per 15 minutes for transactions

      // Simple in-memory rate limiting for transactions
      const rateLimitStore = (fastify as any).rateLimitStore || new Map();
      (fastify as any).rateLimitStore = rateLimitStore;

      const currentData = rateLimitStore.get(key);

      if (!currentData || now > currentData.resetTime) {
        rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
        return; // Allow request
      }

      if (currentData.count >= max) {
        reply.code(429).send({
          success: false,
          error: 'Too many transaction requests, please try again later',
          code: 'TRANSACTION_RATE_LIMIT_EXCEEDED',
          statusCode: 429
        });
        return;
      }

      currentData.count++;
      rateLimitStore.set(key, currentData);
    }
  });

  // Register routes
  fastify.register(authRoutes, { prefix: '/api/auth' });
  fastify.register(categoryRoutes, { prefix: '/api/categories' });
  fastify.register(paymentMethodRoutes, { prefix: '/api/payment-methods' });
  fastify.register(transactionRoutes, { prefix: '/api/transactions' });
  fastify.register(analyticsRoutes, { prefix: '/api/analytics' });
  fastify.register(bulkRoutes, { prefix: '/api/bulk' });
  fastify.register(templateRoutes, { prefix: '/api/templates' });

  // Global error handler
  fastify.setErrorHandler((error, _request, reply) => {
    // Handle validation errors
    if (error.validation) {
      return reply.status(400).send({
        success: false,
        error: error.message,
        code: 'VALIDATION_ERROR',
        statusCode: 400,
        details: error.validation,
      });
    }

    // Handle "not found" errors
    if (error.message && error.message.includes('not found')) {
      return reply.status(404).send({
        success: false,
        error: error.message,
        code: 'NOT_FOUND',
        statusCode: 404,
      });
    }

    // Handle other errors
    return reply.status(500).send({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || 'Internal server error',
        statusCode: 500,
      },
    });
  });

  return fastify;
};

const fastify = buildApp();

// Export buildApp for testing
export { buildApp };

// Health check route
fastify.get('/health', async () => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env['NODE_ENV'] || 'development',
  };
});

// Hello world route
fastify.get('/', async () => {
  return {
    message: 'ControlFin API is running!',
    version: '1.0.0',
    documentation: '/api/docs',
  };
});

// Start server
const start = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDatabase();

    // Start server
    await fastify.listen({ port: env.port, host: '0.0.0.0' });
    fastify.log.info(`🚀 Server listening on http://0.0.0.0:${env.port}`);
    fastify.log.info(`📚 API Documentation available at http://0.0.0.0:${env.port}/api/docs`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  fastify.log.info('🛑 Shutting down server...');
  await fastify.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  fastify.log.info('🛑 Shutting down server...');
  await fastify.close();
  process.exit(0);
});

// Only start server if not in test mode
if (process.env['NODE_ENV'] !== 'test') {
  start();
}
