import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import Fastify from 'fastify';

const fastify = Fastify({ logger: true });

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

// Health check route
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Hello world route
fastify.get('/', async () => {
  return { message: 'ControlFin API is running!' };
});

// Start server
const start = async (): Promise<void> => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
        fastify.log.info('Server listening on http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
