import { FastifyReply, FastifyRequest } from 'fastify';
import { isAuthenticatedRequest } from '../types/request.types';

// Helper function to extract user from authenticated request
export function getAuthenticatedUser(request: FastifyRequest) {
    if (!isAuthenticatedRequest(request)) {
        throw new Error('Authentication required');
    }
    return request.user;
}

// Helper function to safely extract request body with type assertion
export function getRequestBody<T>(request: FastifyRequest): T {
    return request.body as T;
}

// Helper function to create error response
export function createErrorResponse(
    reply: FastifyReply,
    code: string,
    message: string,
    statusCode: number,
    details?: Record<string, unknown>
) {
    reply.code(statusCode).send({
        success: false,
        error: message,
        code,
        statusCode,
        ...(details && { details }),
    });
}

// Helper function to create success response
export function createSuccessResponse<T>(
    reply: FastifyReply,
    data: T,
    message?: string,
    statusCode: number = 200
) {
    const response = {
        success: true,
        data,
        ...(message && { message }),
    };
    reply.statusCode = statusCode;
    return reply.send(response);
}

// Helper function to handle route errors
export function handleRouteError(error: unknown, reply: FastifyReply) {
    // eslint-disable-next-line no-console
    console.error('Route error:', error);

    if (error instanceof Error) {
        return createErrorResponse(
            reply,
            'INTERNAL_SERVER_ERROR',
            error.message,
            500
        );
    }

    return createErrorResponse(
        reply,
        'INTERNAL_SERVER_ERROR',
        'An unexpected error occurred',
        500
    );
}

// Helper function to validate space access
export function validateSpaceAccess(userSpaceId: string | undefined, requiredSpaceId: string): boolean {
    if (!userSpaceId) {
        return false; // User has no space assigned
    }
    return userSpaceId === requiredSpaceId;
}
