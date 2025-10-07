import { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';

interface AuthenticatedUser {
  _id: string;
  email: string;
  role?: string;
}

interface AuthenticatedRequest extends FastifyRequest {
  user?: AuthenticatedUser;
}

export async function authMiddleware(
  request: AuthenticatedRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const token = extractToken(request);

    if (!token) {
      reply.code(401).send({
        success: false,
        error: 'Authentication token required',
        code: 'AUTH_TOKEN_MISSING',
        statusCode: 401
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;

    if (!decoded || !decoded.userId) {
      reply.code(401).send({
        success: false,
        error: 'Invalid authentication token',
        code: 'AUTH_TOKEN_INVALID',
        statusCode: 401
      });
      return;
    }

    // Add user context to request
    request.user = {
      _id: decoded.userId,
      email: decoded.email || '',
      role: decoded.role || 'user'
    };


  } catch (error) {
    reply.code(401).send({
      success: false,
      error: 'Authentication failed',
      code: 'AUTH_FAILED',
      statusCode: 401
    });
    return;
  }
}

function extractToken(request: FastifyRequest): string | null {
  const authHeader = request.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
}

export function requireAuth() {
  return authMiddleware;
}