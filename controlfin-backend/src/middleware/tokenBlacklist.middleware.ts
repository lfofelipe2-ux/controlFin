import { FastifyReply, FastifyRequest } from 'fastify';
import { redisService } from '../services/redis.service';
import logger from '../utils/logger';

interface AuthenticatedRequest extends FastifyRequest {
    user?: {
        _id: string;
        email: string;
        firstName: string;
        lastName: string;
        avatar?: string;
        isEmailVerified: boolean;
        spaceId?: string;
        tokenId?: string;
    };
}

export async function tokenBlacklistMiddleware(
    request: AuthenticatedRequest,
    reply: FastifyReply
): Promise<void> {
    try {
        // Skip blacklist check for public routes
        const publicRoutes = ['/health', '/api/auth/login', '/api/auth/register'];
        if (publicRoutes.some(route => request.url.startsWith(route))) {
            return;
        }

        // Get token from Authorization header
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return; // Let other middleware handle authentication
        }

        const token = authHeader.substring(7);

        // Extract token ID from JWT (assuming it's in the payload)
        // For now, we'll use the token itself as the ID
        // In a real implementation, you'd decode the JWT and extract the jti (JWT ID)
        const tokenId = token.split('.')[0]; // Simple extraction for demo

        if (!tokenId) {
            return; // Invalid token format
        }

        // Check if token is blacklisted
        const isBlacklisted = await redisService.isTokenBlacklisted(tokenId);

        if (isBlacklisted) {
            logger.warn(`Blacklisted token used: ${tokenId}`);
            reply.status(401).send({
                error: 'Token has been revoked',
                code: 'TOKEN_BLACKLISTED'
            });
            return;
        }

        // Add token ID to request for potential use in other middleware
        if (request.user && tokenId) {
            request.user.tokenId = tokenId;
        }

    } catch (error) {
        logger.error('Token blacklist middleware error:', error);
        // Don't block the request if Redis is unavailable
        // Let other middleware handle authentication
    }
}

export default tokenBlacklistMiddleware;
