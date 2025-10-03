import { FastifyReply, FastifyRequest } from 'fastify';
import { authService } from '../modules/auth/auth.service';
import { User } from '../modules/users/user.model';

// Extend FastifyRequest to include user
declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      _id: string;
      email: string;
      firstName: string;
      lastName: string;
      avatar?: string | undefined;
      isEmailVerified: boolean;
    };
  }
}

/**
 * Authentication middleware
 * Verifies JWT access token and adds user to request
 */
export async function authMiddleware(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({
        error: 'Unauthorized',
        message: 'Access token required',
        code: 'MISSING_TOKEN',
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = authService.verifyAccessToken(token);

    if (decoded.type !== 'access') {
      return reply.status(401).send({
        error: 'Unauthorized',
        message: 'Invalid token type',
        code: 'INVALID_TOKEN_TYPE',
      });
    }

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return reply.status(401).send({
        error: 'Unauthorized',
        message: 'User not found',
        code: 'USER_NOT_FOUND',
      });
    }

    // Add user to request
    request.user = {
      _id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar || undefined,
      isEmailVerified: user.isEmailVerified,
    };
  } catch {
    return reply.status(401).send({
      error: 'Unauthorized',
      message: 'Invalid or expired token',
      code: 'INVALID_TOKEN',
    });
  }
}

/**
 * Optional authentication middleware
 * Adds user to request if token is valid, but doesn't require it
 */
export async function optionalAuthMiddleware(
  request: FastifyRequest,
  _reply: FastifyReply
): Promise<void> {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return; // No token provided, continue without user
    }

    const token = authHeader.substring(7);
    const decoded = authService.verifyAccessToken(token);

    if (decoded.type !== 'access') {
      return; // Invalid token type, continue without user
    }

    const user = await User.findById(decoded.userId);
    if (user) {
      request.user = {
        _id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar || undefined,
        isEmailVerified: user.isEmailVerified,
      };
    }
  } catch {
    // Silently continue without user on any error
    return;
  }
}

/**
 * Email verification required middleware
 * Requires user to be authenticated and have verified email
 */
export async function emailVerificationRequiredMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  // First run auth middleware
  await authMiddleware(request, reply);

  // If auth middleware already sent a response, don't continue
  if (reply.sent) {
    return;
  }

  // Check if email is verified
  if (!request.user?.isEmailVerified) {
    return reply.status(403).send({
      error: 'Forbidden',
      message: 'Email verification required',
      code: 'EMAIL_NOT_VERIFIED',
    });
  }
}
