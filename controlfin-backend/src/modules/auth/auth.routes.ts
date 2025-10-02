import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { authMiddleware } from '../../middlewares/auth.middleware';
import rateLimit from '@fastify/rate-limit';
import {
  changePasswordSchema,
  ChangePasswordInput,
  LoginInput,
  loginSchema,
  passwordResetRequestSchema,
  passwordResetSchema,
  RefreshTokenInput,
  refreshTokenSchema,
  RegisterInput,
  registerSchema,
  UpdateProfileInput,
  updateProfileSchema,
} from './auth.schemas';
import { authService } from './auth.service';

export async function authRoutes(fastify: FastifyInstance) {
  // Register rate limit plugin if not already registered
  // (if registered globally elsewhere, this will be a noop)
  if (!fastify.hasDecorator('rateLimit')) {
    await fastify.register(rateLimit);
  }
  // Register user
  fastify.post(
    '/register',
    {
      // Applying rate limit: max 3 requests per minute per IP
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
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const result = await authService.register(request.body as RegisterInput);

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
    },
  );

  // Login user
  fastify.post(
    '/login',
    {
      // Applying rate limit: max 5 requests per minute per IP
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
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const result = await authService.login(request.body as LoginInput);

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
    },
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
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const tokens = await authService.refreshToken(request.body as RefreshTokenInput);

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
    },
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
        await authService.logout(request.user!._id);

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
    },
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
        const user = await authService.getProfile(request.user!._id);

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
    },
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
        const user = await authService.updateProfile(request.user!._id, request.body as UpdateProfileInput);

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
    },
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
        await authService.changePassword(request.user!._id, request.body as ChangePasswordInput);

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
    },
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
    async (_request: FastifyRequest, reply: FastifyReply) => {
      // TODO: Implement email service for password reset
      return reply.send({
        message: 'Password reset email sent (placeholder)',
      });
    },
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
    async (_request: FastifyRequest, reply: FastifyReply) => {
      // TODO: Implement password reset with token validation
      return reply.send({
        message: 'Password reset successful (placeholder)',
      });
    },
  );
}
