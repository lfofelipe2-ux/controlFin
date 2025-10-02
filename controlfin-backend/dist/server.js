"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("@fastify/cors"));
const helmet_1 = __importDefault(require("@fastify/helmet"));
const rate_limit_1 = __importDefault(require("@fastify/rate-limit"));
const fastify_1 = __importDefault(require("fastify"));
const database_1 = require("./config/database");
const auth_routes_1 = require("./modules/auth/auth.routes");
const fastify = (0, fastify_1.default)({
    logger: process.env['NODE_ENV'] === 'development'
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
fastify.register(cors_1.default, {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
});
fastify.register(helmet_1.default);
fastify.register(rate_limit_1.default, {
    max: 100,
    timeWindow: '1 minute',
});
fastify.register(auth_routes_1.authRoutes, { prefix: '/api/auth' });
fastify.get('/health', async () => {
    return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env['NODE_ENV'] || 'development',
    };
});
fastify.get('/', async () => {
    return {
        message: 'ControlFin API is running!',
        version: '1.0.0',
        documentation: '/api/docs',
    };
});
const start = async () => {
    try {
        await (0, database_1.connectDatabase)();
        await fastify.listen({ port: 3000, host: '0.0.0.0' });
        fastify.log.info('🚀 Server listening on http://0.0.0.0:3000');
        fastify.log.info('📚 API Documentation available at http://0.0.0.0:3000/api/docs');
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
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
//# sourceMappingURL=server.js.map