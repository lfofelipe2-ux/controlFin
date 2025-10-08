import { FastifyRequest } from 'fastify';
import mongoSanitize from 'mongo-sanitize';

export async function inputSanitizationMiddleware(
    request: FastifyRequest
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

function sanitizeObject(obj: unknown): unknown {
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
        const sanitized: Record<string, unknown> = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const value = (obj as Record<string, unknown>)[key];
                if (typeof value === 'string') {
                    sanitized[key] = sanitizeString(value);
                } else {
                    sanitized[key] = sanitizeObject(value);
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

    // Check for template literal injection patterns
    const templateLiteralPatterns = /\$\{[^}]*\}/g;
    if (templateLiteralPatterns.test(str)) {
        // Replace template literal expressions with safe text
        return str.replace(/\$\{[^}]*\}/g, '[TEMPLATE_LITERAL_REMOVED]');
    }

    // For normal strings, return as-is to avoid breaking valid data
    return str;
}

export function requireInputSanitization() {
    return inputSanitizationMiddleware;
}
