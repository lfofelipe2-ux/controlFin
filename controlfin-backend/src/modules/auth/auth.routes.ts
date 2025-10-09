import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { registerAccountLinkingRoutes } from './auth.account-linking.routes';
import { registerOAuthRoutes } from './auth.oauth.routes';
import {
  changePasswordSchema,
  loginSchema,
  passwordResetRequestSchema,
  passwordResetSchema,
  refreshTokenSchema,
  registerSchema,
  updateProfileSchema,
} from './auth.schemas';
import { authService } from './auth.service';

export async function authRoutes(fastify: FastifyInstance) {
  // Register user
  fastify.post(
    '/register',
    {
      // Applying route-level rate limit as an extra guard (global is also enabled)
      config: {
        rateLimit: {
          max: 3,
          timeWindow: '1 minute',
        },
      },
      schema: {
        body: registerSchema,
        response: {
          201: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              user: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  email: { type: 'string' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  avatar: { type: 'string', nullable: true },
                  isEmailVerified: { type: 'boolean' },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' },
                },
              },
              tokens: {
                type: 'object',
                properties: {
                  accessToken: { type: 'string' },
                  refreshToken: { type: 'string' },
                },
              },
            },
          },
          400: {
            type: 'object',
            properties: {
              error: { type: 'string' },
              message: { type: 'string' },
              code: { type: 'string' },
            },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{ Body: import('./auth.schemas').RegisterInput }>,
      reply: FastifyReply
    ) => {
      try {
        const result = await authService.register(request.body);

        return reply.status(201).send({
          message: 'User registered successfully',
          user: result.user,
          tokens: result.tokens,
        });
      } catch (error) {
        fastify.log.error(error);

        if (error instanceof Error) {
          return reply.status(400).send({
            error: 'Bad Request',
            message: error.message,
            code: 'REGISTRATION_FAILED',
          });
        }

        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'An unexpected error occurred',
          code: 'INTERNAL_ERROR',
        });
      }
    }
  );

  // Login user
  fastify.post(
    '/login',
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: '1 minute',
        },
      },
      schema: {
        body: loginSchema,
        response: {
          200: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              user: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  email: { type: 'string' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  avatar: { type: 'string', nullable: true },
                  isEmailVerified: { type: 'boolean' },
                  lastLoginAt: { type: 'string', nullable: true },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' },
                },
              },
              tokens: {
                type: 'object',
                properties: {
                  accessToken: { type: 'string' },
                  refreshToken: { type: 'string' },
                },
              },
            },
          },
          401: {
            type: 'object',
            properties: {
              error: { type: 'string' },
              message: { type: 'string' },
              code: { type: 'string' },
            },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{ Body: import('./auth.schemas').LoginInput }>,
      reply: FastifyReply
    ) => {
      try {
        const result = await authService.login(request.body);

        return reply.send({
          message: 'Login successful',
          user: result.user,
          tokens: result.tokens,
        });
      } catch (error) {
        fastify.log.error(error);

        if (error instanceof Error) {
          return reply.status(401).send({
            error: 'Unauthorized',
            message: error.message,
            code: 'LOGIN_FAILED',
          });
        }

        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'An unexpected error occurred',
          code: 'INTERNAL_ERROR',
        });
      }
    }
  );

  // Refresh token
  fastify.post(
    '/refresh',
    {
      schema: {
        body: refreshTokenSchema,
        response: {
          200: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              tokens: {
                type: 'object',
                properties: {
                  accessToken: { type: 'string' },
                  refreshToken: { type: 'string' },
                },
              },
            },
          },
          401: {
            type: 'object',
            properties: {
              error: { type: 'string' },
              message: { type: 'string' },
              code: { type: 'string' },
            },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{ Body: import('./auth.schemas').RefreshTokenInput }>,
      reply: FastifyReply
    ) => {
      try {
        const tokens = await authService.refreshToken(request.body);

        return reply.send({
          message: 'Token refreshed successfully',
          tokens,
        });
      } catch (error) {
        fastify.log.error(error);

        if (error instanceof Error) {
          return reply.status(401).send({
            error: 'Unauthorized',
            message: error.message,
            code: 'REFRESH_FAILED',
          });
        }

        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'An unexpected error occurred',
          code: 'INTERNAL_ERROR',
        });
      }
    }
  );

  // Logout user
  fastify.post(
    '/logout',
    {
      preHandler: [authMiddleware],
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        // Extract token ID from request (set by auth middleware)
        const tokenId = (request as any).user?.tokenId;
        await authService.logout(tokenId);

        return reply.send({
          message: 'Logout successful',
        });
      } catch (error) {
        fastify.log.error(error);

        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'An unexpected error occurred',
          code: 'INTERNAL_ERROR',
        });
      }
    }
  );

  // Get current user profile
  fastify.get(
    '/me',
    {
      preHandler: [authMiddleware],
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              user: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  email: { type: 'string' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  avatar: { type: 'string', nullable: true },
                  isEmailVerified: { type: 'boolean' },
                  lastLoginAt: { type: 'string', nullable: true },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        if (!request.user?._id) {
          return reply.status(401).send({ message: 'User not authenticated' });
        }
        const user = await authService.getProfile(request.user._id);

        return reply.send({
          user,
        });
      } catch (error) {
        fastify.log.error(error);

        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'An unexpected error occurred',
          code: 'INTERNAL_ERROR',
        });
      }
    }
  );

  // Update user profile
  fastify.put(
    '/me',
    {
      preHandler: [authMiddleware],
      schema: {
        body: updateProfileSchema,
        response: {
          200: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              user: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  email: { type: 'string' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  avatar: { type: 'string', nullable: true },
                  isEmailVerified: { type: 'boolean' },
                  lastLoginAt: { type: 'string', nullable: true },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        if (!request.user?._id) {
          return reply.status(401).send({ message: 'User not authenticated' });
        }
        const user = await authService.updateProfile(
          request.user._id,
          request.body as Record<string, unknown>
        );

        return reply.send({
          message: 'Profile updated successfully',
          user,
        });
      } catch (error) {
        fastify.log.error(error);

        if (error instanceof Error) {
          return reply.status(400).send({
            error: 'Bad Request',
            message: error.message,
            code: 'UPDATE_FAILED',
          });
        }

        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'An unexpected error occurred',
          code: 'INTERNAL_ERROR',
        });
      }
    }
  );

  // Change password
  fastify.put(
    '/change-password',
    {
      preHandler: [authMiddleware],
      schema: {
        body: changePasswordSchema,
        response: {
          200: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
          400: {
            type: 'object',
            properties: {
              error: { type: 'string' },
              message: { type: 'string' },
              code: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        if (!request.user?._id) {
          return reply.status(401).send({ message: 'User not authenticated' });
        }
        await authService.changePassword(
          request.user._id,
          request.body as { currentPassword: string; newPassword: string }
        );

        return reply.send({
          message: 'Password changed successfully',
        });
      } catch (error) {
        fastify.log.error(error);

        if (error instanceof Error) {
          return reply.status(400).send({
            error: 'Bad Request',
            message: error.message,
            code: 'PASSWORD_CHANGE_FAILED',
          });
        }

        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'An unexpected error occurred',
          code: 'INTERNAL_ERROR',
        });
      }
    }
  );

  // Request password reset (placeholder - requires email service)
  fastify.post(
    '/forgot-password',
    {
      schema: {
        body: passwordResetRequestSchema,
        response: {
          200: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (
      _request: FastifyRequest<{ Body: import('./auth.schemas').PasswordResetRequestInput }>,
      reply: FastifyReply
    ) => {
      // TODO: Implement email service for password reset
      return reply.send({
        message: 'Password reset email sent (placeholder)',
      });
    }
  );

  // Reset password (placeholder - requires email service)
  fastify.post(
    '/reset-password',
    {
      schema: {
        body: passwordResetSchema,
        response: {
          200: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (
      _request: FastifyRequest<{ Body: import('./auth.schemas').PasswordResetInput }>,
      reply: FastifyReply
    ) => {
      // TODO: Implement password reset with token validation
      return reply.send({
        message: 'Password reset successful (placeholder)',
      });
    }
  );

  // Register OAuth routes
  await registerOAuthRoutes(fastify);

  // Register account linking routes
  await registerAccountLinkingRoutes(fastify);
}
