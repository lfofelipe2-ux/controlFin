/**
 * OAuth Authentication Routes
 *
 * Handles Google OAuth 2.0 authentication endpoints:
 * - GET /auth/google - Initiate OAuth flow
 * - GET /auth/google/callback - Handle OAuth callback
 * - POST /auth/google/callback - Frontend callback handler
 */

import crypto from 'crypto';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { z } from 'zod';
import { GoogleProfile, handleOAuthCallback, validateGoogleProfile } from './auth.oauth.service';
import rateLimit from '@fastify/rate-limit';

// Rate limiting configuration
const rateLimitConfig = {
  max: 10, // Maximum 10 requests
  timeWindow: '15 minutes', // Per 15 minutes
  errorResponseBuilder: (_request: FastifyRequest, context: { after: string }) => {
    return {
      statusCode: 429,
      error: 'Too Many Requests',
      message: 'OAuth rate limit exceeded. Please try again later.',
      retryAfter: Math.round(parseInt(context.after) / 1000) || 15,
    };
  },
};

// Google OAuth callback schema
const googleCallbackSchema = z.object({
  code: z.string().min(1, 'Authorization code is required'),
  state: z.string().min(1, 'State parameter is required for security'),
});

// OAuth response schema
const oauthResponseSchema = z.object({
  message: z.string(),
  user: z.object({
    _id: z.string(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    avatar: z.string().optional(),
    isEmailVerified: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
  tokens: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
  }),
  isNewUser: z.boolean(),
});

/**
 * Configure Google OAuth strategy
 */
const configureGoogleStrategy = () => {
  const googleClientId = process.env['GOOGLE_CLIENT_ID'];
  const googleClientSecret = process.env['GOOGLE_CLIENT_SECRET'];
  const googleRedirectUri = process.env['GOOGLE_REDIRECT_URI'];

  if (!googleClientId || !googleClientSecret || !googleRedirectUri) {
    throw new Error('Google OAuth configuration missing. Please check environment variables.');
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: googleRedirectUri,
        scope: ['profile', 'email'],
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          // Validate profile data
          if (!validateGoogleProfile(profile)) {
            return done(new Error('Invalid Google profile data'), undefined);
          }

          // Handle OAuth callback
          const result = await handleOAuthCallback(profile);

          return done(null, result);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Google OAuth strategy error:', error);
          return done(error, undefined);
        }
      }
    )
  );
};

/**
 * Register OAuth routes
 */
export const registerOAuthRoutes = async (fastify: FastifyInstance) => {
  // Configure Google strategy
  configureGoogleStrategy();

  /**
   * GET /auth/google
   * Initiate Google OAuth flow
   */
  fastify.register(async function (fastify) {
    await fastify.register(rateLimit, rateLimitConfig);

    fastify.get('/auth/google', async (_request: FastifyRequest, reply: FastifyReply) => {
      try {
        const frontendUrl = process.env['FRONTEND_URL'] || 'http://localhost:5173';
        const redirectUri = `${frontendUrl}/auth/callback`;

        // Generate cryptographically secure state parameter for CSRF protection
        const stateData = {
          timestamp: Date.now(),
          redirectUri,
          nonce: crypto.randomBytes(16).toString('hex'),
        };

        // Create HMAC signature for state validation
        const stateString = JSON.stringify(stateData);
        const signature = crypto
          .createHmac('sha256', process.env['GOOGLE_CLIENT_SECRET'] || 'fallback-secret')
          .update(stateString)
          .digest('hex');

        const state = Buffer.from(
          JSON.stringify({
            ...stateData,
            signature,
          })
        ).toString('base64');

        const googleClientId = process.env['GOOGLE_CLIENT_ID'];
        const googleRedirectUri = process.env['GOOGLE_REDIRECT_URI'];

        if (!googleClientId || !googleRedirectUri) {
          throw new Error('Google OAuth configuration missing');
        }

        const googleAuthUrl = new URL('https://accounts.google.com/oauth/authorize');
        googleAuthUrl.searchParams.set('client_id', googleClientId);
        googleAuthUrl.searchParams.set('redirect_uri', googleRedirectUri);
        googleAuthUrl.searchParams.set('response_type', 'code');
        googleAuthUrl.searchParams.set('scope', 'openid email profile');
        googleAuthUrl.searchParams.set('access_type', 'offline');
        googleAuthUrl.searchParams.set('prompt', 'consent');
        googleAuthUrl.searchParams.set('state', state);

        return reply.redirect(googleAuthUrl.toString());
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error initiating Google OAuth:', error);
        return reply.status(500).send({
          message: 'Failed to initiate Google authentication',
          error: 'OAUTH_INIT_ERROR',
        });
      }
    });
  });

  /**
   * GET /auth/google/callback
   * Handle Google OAuth callback (server-side redirect)
   */
  fastify.register(async function (fastify) {
    await fastify.register(rateLimit, rateLimitConfig);

    fastify.get('/auth/google/callback', async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { code, state } = request.query as { code?: string; state?: string };

        // Strict validation of authorization code
        if (!code || typeof code !== 'string' || code.trim().length === 0) {
          // eslint-disable-next-line no-console
          console.error('Invalid or missing authorization code:', { code, state });
          return reply.redirect(
            `${process.env['FRONTEND_URL']}/auth?error=oauth_error&message=Invalid authorization code`
          );
        }

        // Additional validation: ensure code is not a malicious string
        if (code.length > 1000 || !/^[a-zA-Z0-9._-]+$/.test(code)) {
          // eslint-disable-next-line no-console
          console.error('Suspicious authorization code format:', { codeLength: code.length });
          return reply.redirect(
            `${process.env['FRONTEND_URL']}/auth?error=oauth_error&message=Invalid authorization code format`
          );
        }

        // Validate state parameter with HMAC signature verification (MANDATORY)
        if (!state || typeof state !== 'string' || state.trim().length === 0) {
          // eslint-disable-next-line no-console
          console.error('Missing or invalid state parameter:', { state });
          return reply.redirect(
            `${process.env['FRONTEND_URL']}/auth?error=oauth_error&message=Missing state parameter`
          );
        }

        try {
          const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
          const now = Date.now();
          const maxAge = 10 * 60 * 1000; // 10 minutes

          // Validate state data structure
          if (!stateData.timestamp || !stateData.nonce || !stateData.signature) {
            // eslint-disable-next-line no-console
            console.error('Invalid state data structure:', { stateData });
            return reply.redirect(
              `${process.env['FRONTEND_URL']}/auth?error=oauth_error&message=Invalid state structure`
            );
          }

          // Check timestamp
          if (now - stateData.timestamp > maxAge) {
            // eslint-disable-next-line no-console
            console.error('State parameter expired:', {
              timestamp: stateData.timestamp,
              now,
              age: now - stateData.timestamp,
            });
            return reply.redirect(
              `${process.env['FRONTEND_URL']}/auth?error=oauth_error&message=State expired`
            );
          }

          // Verify HMAC signature
          const { signature, ...stateDataWithoutSignature } = stateData;
          const stateString = JSON.stringify(stateDataWithoutSignature);
          const expectedSignature = crypto
            .createHmac('sha256', process.env['GOOGLE_CLIENT_SECRET'] || 'fallback-secret')
            .update(stateString)
            .digest('hex');

          if (signature !== expectedSignature) {
            // eslint-disable-next-line no-console
            console.error('Invalid state signature:', {
              provided: signature,
              expected: expectedSignature,
            });
            return reply.redirect(
              `${process.env['FRONTEND_URL']}/auth?error=oauth_error&message=Invalid state signature`
            );
          }
        } catch (stateError) {
          // eslint-disable-next-line no-console
          console.error('Invalid state parameter:', stateError);
          return reply.redirect(
            `${process.env['FRONTEND_URL']}/auth?error=oauth_error&message=Invalid state`
          );
        }

        // Exchange code for tokens and user info
        const googleClientId = process.env['GOOGLE_CLIENT_ID'];
        const googleClientSecret = process.env['GOOGLE_CLIENT_SECRET'];
        const googleRedirectUri = process.env['GOOGLE_REDIRECT_URI'];

        if (!googleClientId || !googleClientSecret || !googleRedirectUri) {
          throw new Error('Google OAuth configuration missing for token exchange');
        }

        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: googleClientId,
            client_secret: googleClientSecret,
            code,
            grant_type: 'authorization_code',
            redirect_uri: googleRedirectUri,
          }),
        });

        if (!tokenResponse.ok) {
          throw new Error('Failed to exchange code for tokens');
        }

        const tokenData = (await tokenResponse.json()) as { access_token: string };
        const { access_token } = tokenData;

        // Get user profile from Google
        const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        if (!profileResponse.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const profile = (await profileResponse.json()) as GoogleProfile;

        // Handle OAuth callback
        const result = await handleOAuthCallback(profile);

        // Redirect to frontend with tokens
        const frontendUrl = process.env['FRONTEND_URL'] || 'http://localhost:5173';
        const redirectUrl = new URL(`${frontendUrl}/auth/callback`);
        redirectUrl.searchParams.set('access_token', result.tokens.accessToken);
        redirectUrl.searchParams.set('refresh_token', result.tokens.refreshToken);
        redirectUrl.searchParams.set('is_new_user', result.isNewUser.toString());
        redirectUrl.searchParams.set('user_id', result.user._id.toString());

        return reply.redirect(redirectUrl.toString());
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error handling Google OAuth callback:', error);
        return reply.redirect(
          `${process.env['FRONTEND_URL']}/auth?error=oauth_error&message=Authentication failed`
        );
      }
    });
  });

  /**
   * POST /auth/google/callback
   * Handle OAuth callback from frontend (alternative method)
   */
  fastify.register(async function (fastify) {
    await fastify.register(rateLimit, rateLimitConfig);

    fastify.post(
      '/auth/google/callback',
      {
        schema: {
          body: googleCallbackSchema,
          response: {
            200: oauthResponseSchema,
          },
        },
      },
      async (request: FastifyRequest, reply: FastifyReply) => {
        try {
          const { code, state } = request.body as { code: string; state?: string };

          // Strict validation of authorization code
          if (!code || typeof code !== 'string' || code.trim().length === 0) {
            // eslint-disable-next-line no-console
            console.error('Invalid or missing authorization code in POST request:', { code });
            return reply.status(400).send({
              message: 'Invalid authorization code',
              error: 'OAUTH_INVALID_CODE',
            });
          }

          // Additional validation: ensure code is not a malicious string
          if (code.length > 1000 || !/^[a-zA-Z0-9._-]+$/.test(code)) {
            // eslint-disable-next-line no-console
            console.error('Suspicious authorization code format in POST request:', {
              codeLength: code.length,
            });
            return reply.status(400).send({
              message: 'Invalid authorization code format',
              error: 'OAUTH_INVALID_CODE_FORMAT',
            });
          }

          // Validate state parameter (MANDATORY for security)
          if (!state || typeof state !== 'string' || state.trim().length === 0) {
            // eslint-disable-next-line no-console
            console.error('Missing or invalid state parameter in POST request:', { state });
            return reply.status(400).send({
              message: 'Missing state parameter',
              error: 'OAUTH_MISSING_STATE',
            });
          }

          // Validate state parameter with HMAC signature verification
          try {
            const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
            const now = Date.now();
            const maxAge = 10 * 60 * 1000; // 10 minutes

            // Validate state data structure
            if (!stateData.timestamp || !stateData.nonce || !stateData.signature) {
              // eslint-disable-next-line no-console
              console.error('Invalid state data structure in POST request:', { stateData });
              return reply.status(400).send({
                message: 'Invalid state structure',
                error: 'OAUTH_INVALID_STATE_STRUCTURE',
              });
            }

            // Check timestamp
            if (now - stateData.timestamp > maxAge) {
              // eslint-disable-next-line no-console
              console.error('State parameter expired in POST request:', {
                timestamp: stateData.timestamp,
                now,
                age: now - stateData.timestamp,
              });
              return reply.status(400).send({
                message: 'State expired',
                error: 'OAUTH_STATE_EXPIRED',
              });
            }

            // Verify HMAC signature
            const { signature, ...stateDataWithoutSignature } = stateData;
            const stateString = JSON.stringify(stateDataWithoutSignature);
            const expectedSignature = crypto
              .createHmac('sha256', process.env['GOOGLE_CLIENT_SECRET'] || 'fallback-secret')
              .update(stateString)
              .digest('hex');

            if (signature !== expectedSignature) {
              // eslint-disable-next-line no-console
              console.error('Invalid state signature in POST request:', {
                provided: signature,
                expected: expectedSignature,
              });
              return reply.status(400).send({
                message: 'Invalid state signature',
                error: 'OAUTH_INVALID_STATE_SIGNATURE',
              });
            }
          } catch (stateError) {
            // eslint-disable-next-line no-console
            console.error('Invalid state parameter in POST request:', stateError);
            return reply.status(400).send({
              message: 'Invalid state parameter',
              error: 'OAUTH_INVALID_STATE',
            });
          }

          // Exchange code for tokens and user info
          const googleClientId = process.env['GOOGLE_CLIENT_ID'];
          const googleClientSecret = process.env['GOOGLE_CLIENT_SECRET'];
          const googleRedirectUri = process.env['GOOGLE_REDIRECT_URI'];

          if (!googleClientId || !googleClientSecret || !googleRedirectUri) {
            throw new Error('Google OAuth configuration missing for token exchange');
          }

          const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              client_id: googleClientId,
              client_secret: googleClientSecret,
              code,
              grant_type: 'authorization_code',
              redirect_uri: googleRedirectUri,
            }),
          });

          if (!tokenResponse.ok) {
            const errorData = (await tokenResponse.json()) as { error_description?: string };
            throw new Error(errorData.error_description || 'Failed to exchange code for tokens');
          }

          const tokenData = (await tokenResponse.json()) as { access_token: string };
          const { access_token } = tokenData;

          // Get user profile from Google
          const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          });

          if (!profileResponse.ok) {
            throw new Error('Failed to fetch user profile');
          }

          const profile = (await profileResponse.json()) as GoogleProfile;

          // Handle OAuth callback
          const result = await handleOAuthCallback(profile);

          return reply.send({
            message: result.isNewUser ? 'Account created successfully' : 'Login successful',
            user: {
              _id: result.user._id.toString(),
              email: result.user.email,
              firstName: result.user.firstName,
              lastName: result.user.lastName,
              avatar: result.user.avatar,
              isEmailVerified: result.user.isEmailVerified,
              createdAt: result.user.createdAt.toISOString(),
              updatedAt: result.user.updatedAt.toISOString(),
            },
            tokens: result.tokens,
            isNewUser: result.isNewUser,
          });
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Error handling Google OAuth callback:', error);
          return reply.status(400).send({
            message: 'OAuth authentication failed',
            error: 'OAUTH_CALLBACK_ERROR',
            details: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }
    );
  });
};

export default registerOAuthRoutes;
