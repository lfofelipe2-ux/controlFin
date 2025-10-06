import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

// JWT payload interface
interface JWTPayload {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    isEmailVerified: boolean;
    spaceId?: string;
    iat: number;
    exp: number;
}

// Authentication plugin
const authPlugin: FastifyPluginAsync = async (fastify) => {
    // Decorate request with user property
    fastify.decorateRequest('user', undefined);

    // Add pre-handler hook for authentication
    fastify.addHook('preHandler', async (request) => {
        try {
            const token = request.headers.authorization?.replace('Bearer ', '');

            if (!token) {
                // No token provided - user will be undefined
                return;
            }

            // Verify JWT token


            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const payload = (fastify as any).jwt.verify(token) as JWTPayload;

            // Set user on request
            request.user = {
                _id: payload.userId,
                email: payload.email,
                firstName: payload.firstName,
                lastName: payload.lastName,
                isEmailVerified: payload.isEmailVerified,
                ...(payload.spaceId && { spaceId: payload.spaceId }),
            };
        } catch {
            // Invalid token - user will be undefined
            // Don't throw error here to allow unauthenticated routes
            fastify.log.warn('Invalid JWT token');
        }
    });

    // Add authentication helper
    fastify.decorate('authenticate', async (request, reply) => {
        if (!request.user) {
            reply.code(401).send({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Authentication required',
                    statusCode: 401,
                },
            });
            return;
        }
    });

    // Add authorization helper
    fastify.decorate('authorize', async (request, reply, spaceId: string) => {
        if (!request.user) {
            reply.code(401).send({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Authentication required',
                    statusCode: 401,
                },
            });
            return;
        }


        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((request.user as any).spaceId && (request.user as any).spaceId !== spaceId) {
            reply.code(403).send({
                success: false,
                error: {
                    code: 'FORBIDDEN',
                    message: 'Access denied to this resource',
                    statusCode: 403,
                },
            });
            return;
        }
    });
};

// Extend FastifyInstance interface
declare module 'fastify' {
    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
        authorize: (request: FastifyRequest, reply: FastifyReply, spaceId: string) => Promise<void>;
    }
}

export default fp(authPlugin, {
    name: 'auth',
    dependencies: ['@fastify/jwt'],
});
