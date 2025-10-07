import { FastifyReply, FastifyRequest } from 'fastify';
import mongoSanitize from 'mongo-sanitize';
import xss from 'xss';

export async function inputSanitizationMiddleware(
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> {
    try {
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

    } catch (error) {
        return reply.code(400).send({
            success: false,
            error: 'Input sanitization failed',
            code: 'INPUT_SANITIZATION_FAILED',
            statusCode: 400
        });
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
        const sanitized: any = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                sanitized[key] = sanitizeObject(obj[key]);
            }
        }
        return sanitized;
    }

    return obj;
}

function sanitizeString(str: string): string {
    // Remove NoSQL injection attempts
    let sanitized = mongoSanitize(str);

    // Remove XSS payloads
    sanitized = xss(sanitized, {
        whiteList: {}, // No HTML tags allowed
        stripIgnoreTag: true,
        stripIgnoreTagBody: ['script']
    });

    // Remove common injection patterns
    sanitized = sanitized.replace(/[$]where/gi, '');
    sanitized = sanitized.replace(/[$]ne/gi, '');
    sanitized = sanitized.replace(/[$]gt/gi, '');
    sanitized = sanitized.replace(/[$]lt/gi, '');
    sanitized = sanitized.replace(/[$]regex/gi, '');
    sanitized = sanitized.replace(/[$]exists/gi, '');

    return sanitized;
}

export function requireInputSanitization() {
    return inputSanitizationMiddleware;
}
