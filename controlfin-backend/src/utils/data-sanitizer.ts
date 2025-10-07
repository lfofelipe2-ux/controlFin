import xss from 'xss';

export function sanitizeTransactionData(data: any): any {
    if (!data || typeof data !== 'object') {
        return data;
    }

    const sanitized = { ...data };

    // Sanitize description
    if (sanitized.description && typeof sanitized.description === 'string') {
        sanitized.description = sanitizeString(sanitized.description);
    }

    // Sanitize tags array
    if (sanitized.tags && Array.isArray(sanitized.tags)) {
        sanitized.tags = sanitized.tags.map((tag: any) =>
            typeof tag === 'string' ? sanitizeString(tag) : tag
        );
    }

    // Sanitize metadata
    if (sanitized.metadata && typeof sanitized.metadata === 'object') {
        sanitized.metadata = sanitizeObject(sanitized.metadata);
    }

    return sanitized;
}

function sanitizeString(str: string): string {
    // Only sanitize if the string contains potentially malicious content
    if (!str || typeof str !== 'string') {
        return str;
    }

    // Check for XSS patterns - only sanitize if it contains actual script tags
    const xssPatterns = /<script[^>]*>|javascript:|on\w+\s*=/gi;
    if (xssPatterns.test(str)) {
        return xss(str, {
            whiteList: {},
            stripIgnoreTag: true,
            stripIgnoreTagBody: ['script']
        });
    }

    // If no malicious patterns detected, return original string
    return str;
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
