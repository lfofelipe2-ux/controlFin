import 'fastify';
import { AuthenticatedUser } from './request.types';

// Extend FastifyRequest interface to include user authentication
declare module 'fastify' {
    interface FastifyRequest {
        user?: AuthenticatedUser;
    }
}

// Re-export types for convenience
export * from './database.types';
export * from './error.types';
export * from './request.types';
export * from './response.types';
export * from './service.types';

