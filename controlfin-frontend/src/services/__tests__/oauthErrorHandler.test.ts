/**
 * OAuth Error Handler Tests
 *
 * Tests for the OAuth error handling service including error classification,
 * user message generation, and recovery strategies.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import OAuthErrorHandler, { type OAuthErrorContext } from '../oauthErrorHandler';

// Mock console methods
const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

describe('OAuthErrorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('handleError', () => {
    it('should handle string errors', () => {
      const error = 'OAUTH_INIT_ERROR';
      const context: OAuthErrorContext = { step: 'initiation' };

      const result = OAuthErrorHandler.handleError(error, context);

      expect(result.code).toBe('OAUTH_INIT_ERROR');
      expect(result.recoverable).toBe(true);
      expect(result.action).toBe('retry');
    });

    it('should handle error objects with code', () => {
      const error = { code: 'NETWORK_ERROR', message: 'Network failed' };
      const context: OAuthErrorContext = { step: 'callback' };

      const result = OAuthErrorHandler.handleError(error, context);

      expect(result.code).toBe('NETWORK_ERROR');
      expect(result.recoverable).toBe(true);
      expect(result.action).toBe('check_connection');
    });

    it('should handle error objects with error property', () => {
      const error = { error: 'TOKEN_INVALID', message: 'Token expired' };
      const context: OAuthErrorContext = { step: 'token_exchange' };

      const result = OAuthErrorHandler.handleError(error, context);

      expect(result.code).toBe('TOKEN_INVALID');
      expect(result.recoverable).toBe(true);
      expect(result.action).toBe('retry');
    });

    it('should handle unknown errors', () => {
      const error = { message: 'Some random error' };
      const context: OAuthErrorContext = { step: 'profile_fetch' };

      const result = OAuthErrorHandler.handleError(error, context);

      expect(result.code).toBe('UNKNOWN_ERROR');
      expect(result.recoverable).toBe(true);
      expect(result.action).toBe('retry');
    });

    it('should log errors in development', () => {
      const error = 'OAUTH_INIT_ERROR';
      const context: OAuthErrorContext = { step: 'initiation' };

      OAuthErrorHandler.handleError(error, context);

      expect(mockConsoleError).toHaveBeenCalledWith(
        'OAuth Error:',
        expect.objectContaining({
          error: 'OAUTH_INIT_ERROR',
          context: 'initiation',
        })
      );
    });
  });

  describe('getUserMessage', () => {
    it('should return user-friendly message for known errors', () => {
      const error = 'OAUTH_INIT_ERROR';
      const context: OAuthErrorContext = { step: 'initiation' };

      const message = OAuthErrorHandler.getUserMessage(error, context);

      expect(message).toBe('Unable to start Google sign-in. Please try again.');
    });

    it('should return generic message for unknown errors', () => {
      const error = { message: 'Random error' };
      const context: OAuthErrorContext = { step: 'callback' };

      const message = OAuthErrorHandler.getUserMessage(error, context);

      expect(message).toBe('Something unexpected happened. Please try again.');
    });
  });

  describe('isRecoverable', () => {
    it('should return true for recoverable errors', () => {
      const error = 'OAUTH_INIT_ERROR';
      const context: OAuthErrorContext = { step: 'initiation' };

      const isRecoverable = OAuthErrorHandler.isRecoverable(error, context);

      expect(isRecoverable).toBe(true);
    });

    it('should return false for non-recoverable errors', () => {
      const error = 'OAUTH_CONFIG_ERROR';
      const context: OAuthErrorContext = { step: 'initiation' };

      const isRecoverable = OAuthErrorHandler.isRecoverable(error, context);

      expect(isRecoverable).toBe(false);
    });
  });

  describe('getRecommendedAction', () => {
    it('should return correct action for different error types', () => {
      const testCases = [
        { error: 'OAUTH_INIT_ERROR', expectedAction: 'retry' },
        { error: 'NETWORK_ERROR', expectedAction: 'check_connection' },
        { error: 'OAUTH_CONFIG_ERROR', expectedAction: 'contact_support' },
        { error: 'SERVICE_UNAVAILABLE', expectedAction: 'retry_later' },
      ];

      testCases.forEach(({ error, expectedAction }) => {
        const context: OAuthErrorContext = { step: 'initiation' };
        const action = OAuthErrorHandler.getRecommendedAction(error, context);
        expect(action).toBe(expectedAction);
      });
    });
  });

  describe('getRecoveryStrategies', () => {
    it('should return retry strategies for retry action', () => {
      const error = 'OAUTH_INIT_ERROR';
      const context: OAuthErrorContext = { step: 'initiation' };

      const strategies = OAuthErrorHandler.getRecoveryStrategies(error, context);

      expect(strategies).toContain('Try signing in again');
    });

    it('should return connection strategies for check_connection action', () => {
      const error = 'NETWORK_ERROR';
      const context: OAuthErrorContext = { step: 'callback' };

      const strategies = OAuthErrorHandler.getRecoveryStrategies(error, context);

      expect(strategies).toContain('Check your internet connection');
      expect(strategies).toContain('Try refreshing the page');
    });

    it('should return support strategies for contact_support action', () => {
      const error = 'OAUTH_CONFIG_ERROR';
      const context: OAuthErrorContext = { step: 'initiation' };

      const strategies = OAuthErrorHandler.getRecoveryStrategies(error, context);

      expect(strategies).toContain('Contact technical support');
      expect(strategies).toContain('Report this issue');
    });

    it('should return retry later strategies for retry_later action', () => {
      const error = 'SERVICE_UNAVAILABLE';
      const context: OAuthErrorContext = { step: 'callback' };

      const strategies = OAuthErrorHandler.getRecoveryStrategies(error, context);

      expect(strategies).toContain('Wait a few minutes and try again');
      expect(strategies).toContain('Check if the service is back online');
    });
  });

  describe('error context handling', () => {
    it('should include context information in error details', () => {
      const error = 'OAUTH_CALLBACK_ERROR';
      const context: OAuthErrorContext = {
        step: 'callback',
        userEmail: 'test@example.com',
        googleId: 'google123',
      };

      const result = OAuthErrorHandler.handleError(error, context);

      expect(result.details).toMatchObject({
        context: {
          step: 'callback',
          userEmail: 'test@example.com',
          googleId: 'google123',
        },
      });
    });
  });
});
