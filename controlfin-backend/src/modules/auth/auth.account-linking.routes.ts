/**
 * Account Linking Routes
 *
 * Handles account linking endpoints for Google OAuth integration
 */

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import logger from '../../utils/logger';
import {
  accountConflictCheckSchema,
  AccountLinkingRequest,
  accountLinkingSchema,
  checkAccountConflict,
  createAccountWithGoogle,
  linkGoogleAccount,
} from './auth.account-linking.service';

/**
 * Register account linking routes
 */
export const registerAccountLinkingRoutes = async (fastify: FastifyInstance) => {
  /**
   * POST /auth/check-account-conflict
   * Check if there's an account conflict for the given email
   */
  fastify.post(
    '/auth/check-account-conflict',
    {
      schema: {
        body: accountConflictCheckSchema,
        response: {
          200: {
            type: 'object',
            properties: {
              hasExistingAccount: { type: 'boolean' },
              existingAccountEmail: { type: 'string' },
              canLink: { type: 'boolean' },
              reason: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Body: { email: string } }>, reply: FastifyReply) => {
      try {
        const { email } = request.body;

        const conflictInfo = await checkAccountConflict(email);

        return reply.send(conflictInfo);
      } catch (error) {
        logger.error('Error checking account conflict:', error);
        return reply.status(500).send({
          message: 'Failed to check account conflict',
          error: 'ACCOUNT_CONFLICT_CHECK_ERROR',
          details: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );

  /**
   * POST /auth/link-google-account
   * Link Google account with existing user account
   */
  fastify.post(
    '/auth/link-google-account',
    {
      schema: {
        body: accountLinkingSchema,
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              user: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  email: { type: 'string' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  avatar: { type: 'string' },
                  isEmailVerified: { type: 'boolean' },
                  googleId: { type: 'string' },
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
        },
      },
    },
    async (request: FastifyRequest<{ Body: AccountLinkingRequest }>, reply: FastifyReply) => {
      try {
        const linkingRequest = request.body;

        const result = await linkGoogleAccount(linkingRequest);

        return reply.send(result);
      } catch (error) {
        logger.error('Error linking Google account:', error);
        return reply.status(400).send({
          message: 'Failed to link Google account',
          error: 'ACCOUNT_LINKING_ERROR',
          details: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );

  /**
   * POST /auth/create-google-account
   * Create new account with Google OAuth (when user chooses not to link)
   */
  fastify.post(
    '/auth/create-google-account',
    {
      schema: {
        body: accountLinkingSchema,
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              user: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  email: { type: 'string' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  avatar: { type: 'string' },
                  isEmailVerified: { type: 'boolean' },
                  googleId: { type: 'string' },
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
        },
      },
    },
    async (request: FastifyRequest<{ Body: AccountLinkingRequest }>, reply: FastifyReply) => {
      try {
        const linkingRequest = request.body;

        const result = await createAccountWithGoogle(linkingRequest);

        return reply.send(result);
      } catch (error) {
        logger.error('Error creating Google account:', error);
        return reply.status(400).send({
          message: 'Failed to create Google account',
          error: 'ACCOUNT_CREATION_ERROR',
          details: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );
};
