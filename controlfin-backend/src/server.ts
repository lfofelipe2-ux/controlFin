import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import Fastify from 'fastify';
import { connectDatabase } from './config/database';
import { env } from './config/env';
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

  fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  // Register routes
  fastify.register(authRoutes, { prefix: '/api/auth' });
  fastify.register(categoryRoutes, { prefix: '/api/categories' });
  fastify.register(paymentMethodRoutes, { prefix: '/api/payment-methods' });
  fastify.register(transactionRoutes, { prefix: '/api/transactions' });
  fastify.register(analyticsRoutes, { prefix: '/api/analytics' });
  fastify.register(bulkRoutes, { prefix: '/api/bulk' });
  fastify.register(templateRoutes, { prefix: '/api/templates' });

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
