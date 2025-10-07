import { FastifyReply, FastifyRequest } from 'fastify';

interface AuthenticatedUser {
    _id: string;
    email: string;
    role?: string;
}

interface AuthenticatedRequest extends FastifyRequest {
    user?: AuthenticatedUser;
}

export async function authorizationMiddleware(
    request: AuthenticatedRequest,
    reply: FastifyReply
): Promise<void> {
    try {
        // Check if user context exists
        if (!request.user) {
            reply.code(401).send({
                success: false,
                error: 'User context required',
                code: 'USER_CONTEXT_MISSING',
                statusCode: 401
            });
            return;
        }

        // Validate user context format
        if (!request.user._id || typeof request.user._id !== 'string') {
            reply.code(401).send({
                success: false,
                error: 'Invalid user context',
                code: 'USER_CONTEXT_INVALID',
                statusCode: 401
            });
            return;
        }

        // Check for empty user context
        if (request.user._id.trim() === '') {
            reply.code(401).send({
                success: false,
                error: 'Empty user context not allowed',
                code: 'USER_CONTEXT_EMPTY',
                statusCode: 401
            });
            return;
        }

        // Validate user ID format (should be a valid MongoDB ObjectId)
        if (!isValidObjectId(request.user._id)) {
            reply.code(401).send({
                success: false,
                error: 'Invalid user ID format',
                code: 'USER_ID_INVALID',
                statusCode: 401
            });
            return;
        }

    } catch (error) {
        reply.code(401).send({
            success: false,
            error: 'Authorization failed',
            code: 'AUTHORIZATION_FAILED',
            statusCode: 401
        });
        return;
    }
}

function isValidObjectId(id: string): boolean {
    // Basic MongoDB ObjectId validation (24 hex characters)
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    return objectIdRegex.test(id);
}

export function requireAuthorization() {
    return authorizationMiddleware;
}
