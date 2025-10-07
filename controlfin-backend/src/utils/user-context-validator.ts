import { FastifyRequest } from 'fastify';

interface AuthenticatedUser {
    _id: string;
    email: string;
    role?: string;
}

interface AuthenticatedRequest extends FastifyRequest {
    user?: AuthenticatedUser;
}

export function validateUserContext(request: AuthenticatedRequest): boolean {
    return !!(request.user && request.user._id && isValidObjectId(request.user._id));
}

export function validateUserOwnership(request: AuthenticatedRequest, resourceUserId: string): boolean {
    if (!validateUserContext(request)) {
        return false;
    }

    return request.user!._id === resourceUserId;
}

export function isValidObjectId(id: string): boolean {
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    return objectIdRegex.test(id);
}

export function extractUserId(request: AuthenticatedRequest): string | null {
    if (!validateUserContext(request)) {
        return null;
    }

    return request.user!._id;
}
