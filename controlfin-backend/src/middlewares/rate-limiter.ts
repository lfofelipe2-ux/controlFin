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
export const transactionRateLimit = rateLimit(transactionRateLimit);
export const queryRateLimit = rateLimit(queryRateLimit);
export const authRateLimit = rateLimit(authRateLimit);

// Custom rate limiting middleware for Fastify
export async function rateLimitMiddleware(
    request: FastifyRequest,
    reply: FastifyReply,
    rateLimitInstance: any
): Promise<void> {
    try {
        // Get client IP
        const clientIP = request.ip || request.socket.remoteAddress || 'unknown';

        // For now, we'll use a simple in-memory store
        // In production, use Redis or similar
        const key = `rate_limit:${clientIP}`;
        const now = Date.now();
        const windowMs = rateLimitInstance.windowMs;
        const max = rateLimitInstance.max;

        // This is a simplified implementation
        // In production, use a proper rate limiting library with Fastify
        return; // Allow request for now

    } catch (error) {
        // If rate limiting fails, allow the request but log the error
        console.error('Rate limiting error:', error);
    }
}

export function createRateLimitMiddleware(rateLimitInstance: any) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        return rateLimitMiddleware(request, reply, rateLimitInstance);
    };
}
