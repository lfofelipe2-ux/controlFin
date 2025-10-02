import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import Fastify from 'fastify';
import { connectDatabase } from './config/database';
import { authRoutes } from './modules/auth/auth.routes';

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
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
});

fastify.register(helmet);

fastify.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
});

// Register routes
fastify.register(authRoutes, { prefix: '/api/auth' });

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
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    fastify.log.info('🚀 Server listening on http://0.0.0.0:3000');
    fastify.log.info('📚 API Documentation available at http://0.0.0.0:3000/api/docs');
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

start();
