import { FastifyReply, FastifyRequest } from 'fastify';
import mongoSanitize from 'mongo-sanitize';

export async function inputSanitizationMiddleware(
    request: FastifyRequest,
    _reply: FastifyReply
): Promise<void> {
    // Sanitize request body
    if (request.body) {
        request.body = sanitizeObject(request.body);
    }

    // Sanitize query parameters
    if (request.query) {
        request.query = sanitizeObject(request.query);
    }

    // Sanitize URL parameters
    if (request.params) {
        request.params = sanitizeObject(request.params);
    }
}

function sanitizeObject(obj: any): any {
    if (obj === null || obj === undefined) {
        return obj;
    }

    if (typeof obj === 'string') {
        return sanitizeString(obj);
    }

    if (Array.isArray(obj)) {
        return obj.map(item => sanitizeObject(item));
    }

    if (typeof obj === 'object') {
        // For objects, only sanitize string values, preserve structure
        const sanitized: any = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'string') {
                    sanitized[key] = sanitizeString(obj[key]);
                } else {
                    sanitized[key] = sanitizeObject(obj[key]);
                }
            }
        }
        return sanitized;
    }

    return obj;
}

function sanitizeString(str: string): string {
    // Only sanitize if the string contains potentially malicious content
    if (!str || typeof str !== 'string') {
        return str;
    }

    // Check for NoSQL injection patterns - only sanitize if it looks like a query object
    const nosqlPatterns = /^\s*\{.*\$where|\$ne|\$gt|\$lt|\$regex|\$exists|\$in|\$nin|\$or|\$and/gi;
    if (nosqlPatterns.test(str)) {
        // Remove NoSQL injection attempts
        return mongoSanitize(str);
    }

    // Check for XSS patterns - only sanitize if it contains actual script tags
    const xssPatterns = /<script[^>]*>.*?<\/script>|javascript:|on\w+\s*=/gi;
    if (xssPatterns.test(str)) {
        // Remove XSS payloads but preserve the string structure
        return str.replace(/<script[^>]*>.*?<\/script>/gi, '[SCRIPT_REMOVED]')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '');
    }

    // For normal strings, return as-is to avoid breaking valid data
    return str;
}

export function requireInputSanitization() {
    return inputSanitizationMiddleware;
}
