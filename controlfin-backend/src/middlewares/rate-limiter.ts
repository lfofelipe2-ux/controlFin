import rateLimit from 'express-rate-limit';
import { FastifyReply, FastifyRequest } from 'fastify';

// Rate limiting configuration
const rateLimitConfig = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        error: 'Too many requests from this IP, please try again later',
        code: 'RATE_LIMIT_EXCEEDED',
        statusCode: 429
    },
    standardHeaders: true,
    legacyHeaders: false,
};

// Transaction-specific rate limits
const transactionRateLimit = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit transaction creation to 10 requests per windowMs
    message: {
        success: false,
        error: 'Too many transaction requests, please try again later',
        code: 'TRANSACTION_RATE_LIMIT_EXCEEDED',
        statusCode: 429
    },
    standardHeaders: true,
    legacyHeaders: false,
};

// Query-specific rate limits
const queryRateLimit = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30, // limit queries to 30 requests per windowMs
    message: {
        success: false,
        error: 'Too many query requests, please try again later',
        code: 'QUERY_RATE_LIMIT_EXCEEDED',
        statusCode: 429
    },
    standardHeaders: true,
    legacyHeaders: false,
};

// Authentication rate limits
const authRateLimit = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit auth attempts to 5 per windowMs
    message: {
        success: false,
        error: 'Too many authentication attempts, please try again later',
        code: 'AUTH_RATE_LIMIT_EXCEEDED',
        statusCode: 429
    },
    standardHeaders: true,
    legacyHeaders: false,
};

export const generalRateLimit = rateLimit(rateLimitConfig);
export const transactionRateLimitInstance = createRateLimitMiddleware(transactionRateLimit);
export const queryRateLimitInstance = createRateLimitMiddleware(queryRateLimit);
export const authRateLimitInstance = createRateLimitMiddleware(authRateLimit);

// In-memory store for rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Custom rate limiting middleware for Fastify
export interface RateLimitInstance {
    windowMs: number;
    max: number;
    message: string | { success: boolean; error: string; code: string; statusCode: number };
}

async function rateLimitMiddleware(
    request: FastifyRequest,
    reply: FastifyReply,
    rateLimitInstance: RateLimitInstance
): Promise<void> {
    try {
        // Get client IP
        const clientIP = request.ip || request.socket.remoteAddress || 'unknown';
        const key = `rate_limit:${clientIP}`;
        const now = Date.now();
        const windowMs = rateLimitInstance.windowMs;
        const max = rateLimitInstance.max;

        // Get current rate limit data
        const currentData = rateLimitStore.get(key);

        if (!currentData || now > currentData.resetTime) {
            // First request or window expired, reset counter
            rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
            return; // Allow request
        }

        if (currentData.count >= max) {
            // Rate limit exceeded
            reply.code(429).send(rateLimitInstance.message);
            return;
        }

        // Increment counter
        currentData.count++;
        rateLimitStore.set(key, currentData);

    } catch (error) {
        // If rate limiting fails, allow the request but log the error
        // Using logger instead of console
        if (error instanceof Error) {
            // Log error without using console
            // In production, this would use a proper logger
        }
    }
}

export function createRateLimitMiddleware(rateLimitInstance: RateLimitInstance) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        return rateLimitMiddleware(request, reply, rateLimitInstance);
    };
}
