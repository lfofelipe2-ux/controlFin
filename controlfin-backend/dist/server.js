"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const helmet_1 = __importDefault(require("@fastify/helmet"));
const rate_limit_1 = __importDefault(require("@fastify/rate-limit"));
const fastify = (0, fastify_1.default)({ logger: true });
fastify.register(cors_1.default, {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
});
fastify.register(helmet_1.default);
fastify.register(rate_limit_1.default, {
    max: 100,
    timeWindow: '1 minute'
});
fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
});
fastify.get('/', async () => {
    return { message: 'ControlFin API is running!' };
});
const start = async () => {
    try {
        await fastify.listen({ port: 3000, host: '0.0.0.0' });
        console.log('Server listening on http://localhost:3000');
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=server.js.map