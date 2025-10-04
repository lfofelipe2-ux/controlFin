/**
 * OAuth Error Handler Service
 *
 * Provides comprehensive error handling for Google OAuth integration
 * including error classification, user-friendly messages, and recovery strategies.
 */

export interface OAuthError {
  code: string;
  message: string;
  userMessage: string;
  recoverable: boolean;
  action?: string;
  details?: {
    originalError: Error | string | unknown;
    context: OAuthErrorContext;
    timestamp: string;
    userAgent: string;
    url: string;
  };
}

export interface OAuthErrorContext {
  step: 'initiation' | 'callback' | 'token_exchange' | 'profile_fetch' | 'account_linking';
  originalError?: Error | string | unknown;
  userEmail?: string;
  googleId?: string;
}

export class OAuthErrorHandler {
  private static errorMap: Map<string, OAuthError> = new Map([
    // OAuth Initiation Errors
    [
      'OAUTH_INIT_ERROR',
      {
        code: 'OAUTH_INIT_ERROR',
        message: 'Failed to initiate Google authentication',
        userMessage: 'Unable to start Google sign-in. Please try again.',
        recoverable: true,
        action: 'retry',
      },
    ],
    [
      'OAUTH_CONFIG_ERROR',
      {
        code: 'OAUTH_CONFIG_ERROR',
        message: 'OAuth configuration is missing or invalid',
        userMessage: 'Authentication service is not properly configured. Please contact support.',
        recoverable: false,
        action: 'contact_support',
      },
    ],

    // OAuth Callback Errors
    [
      'OAUTH_CALLBACK_ERROR',
      {
        code: 'OAUTH_CALLBACK_ERROR',
        message: 'OAuth callback failed',
        userMessage: 'Authentication failed. Please try signing in again.',
        recoverable: true,
        action: 'retry',
      },
    ],
    [
      'OAUTH_STATE_ERROR',
      {
        code: 'OAUTH_STATE_ERROR',
        message: 'Invalid or expired state parameter',
        userMessage: 'Security validation failed. Please try signing in again.',
        recoverable: true,
        action: 'retry',
      },
    ],
    [
      'OAUTH_CODE_MISSING',
      {
        code: 'OAUTH_CODE_MISSING',
        message: 'Authorization code is missing',
        userMessage: 'Authentication incomplete. Please try signing in again.',
        recoverable: true,
        action: 'retry',
      },
    ],

    // Token Exchange Errors
    [
      'TOKEN_EXCHANGE_ERROR',
      {
        code: 'TOKEN_EXCHANGE_ERROR',
        message: 'Failed to exchange authorization code for tokens',
        userMessage: 'Unable to complete authentication. Please try again.',
        recoverable: true,
        action: 'retry',
      },
    ],
    [
      'TOKEN_INVALID',
      {
        code: 'TOKEN_INVALID',
        message: 'Invalid or expired tokens',
        userMessage: 'Your session has expired. Please sign in again.',
        recoverable: true,
        action: 'retry',
      },
    ],
    [
      'TOKEN_REFRESH_ERROR',
      {
        code: 'TOKEN_REFRESH_ERROR',
        message: 'Failed to refresh access token',
        userMessage: 'Unable to maintain your session. Please sign in again.',
        recoverable: true,
        action: 'retry',
      },
    ],

    // Profile Fetch Errors
    [
      'PROFILE_FETCH_ERROR',
      {
        code: 'PROFILE_FETCH_ERROR',
        message: 'Failed to fetch user profile from Google',
        userMessage: 'Unable to retrieve your profile information. Please try again.',
        recoverable: true,
        action: 'retry',
      },
    ],
    [
      'PROFILE_INVALID',
      {
        code: 'PROFILE_INVALID',
        message: 'Invalid user profile data',
        userMessage: 'Your Google profile information is incomplete. Please try again.',
        recoverable: true,
        action: 'retry',
      },
    ],

    // Account Linking Errors
    [
      'ACCOUNT_CONFLICT_CHECK_ERROR',
      {
        code: 'ACCOUNT_CONFLICT_CHECK_ERROR',
        message: 'Failed to check account conflict',
        userMessage: 'Unable to verify account information. Please try again.',
        recoverable: true,
        action: 'retry',
      },
    ],
    [
      'ACCOUNT_LINKING_ERROR',
      {
        code: 'ACCOUNT_LINKING_ERROR',
        message: 'Failed to link Google account',
        userMessage: 'Unable to link your accounts. Please try again or contact support.',
        recoverable: true,
        action: 'retry_or_support',
      },
    ],
    [
      'ACCOUNT_CREATION_ERROR',
      {
        code: 'ACCOUNT_CREATION_ERROR',
        message: 'Failed to create Google account',
        userMessage: 'Unable to create your account. Please try again or contact support.',
        recoverable: true,
        action: 'retry_or_support',
      },
    ],

    // Network Errors
    [
      'NETWORK_ERROR',
      {
        code: 'NETWORK_ERROR',
        message: 'Network connection failed',
        userMessage: 'Unable to connect to the server. Please check your internet connection.',
        recoverable: true,
        action: 'check_connection',
      },
    ],
    [
      'TIMEOUT_ERROR',
      {
        code: 'TIMEOUT_ERROR',
        message: 'Request timeout',
        userMessage: 'The request took too long. Please try again.',
        recoverable: true,
        action: 'retry',
      },
    ],

    // Server Errors
    [
      'SERVER_ERROR',
      {
        code: 'SERVER_ERROR',
        message: 'Internal server error',
        userMessage: 'Something went wrong on our end. Please try again later.',
        recoverable: true,
        action: 'retry_later',
      },
    ],
    [
      'SERVICE_UNAVAILABLE',
      {
        code: 'SERVICE_UNAVAILABLE',
        message: 'Service temporarily unavailable',
        userMessage:
          'The authentication service is temporarily unavailable. Please try again later.',
        recoverable: true,
        action: 'retry_later',
      },
    ],

    // Generic Errors
    [
      'UNKNOWN_ERROR',
      {
        code: 'UNKNOWN_ERROR',
        message: 'An unknown error occurred',
        userMessage: 'Something unexpected happened. Please try again.',
        recoverable: true,
        action: 'retry',
      },
    ],
  ]);

  /**
   * Classify and handle OAuth errors
   */
  static handleError(error: Error | string | unknown, context: OAuthErrorContext): OAuthError {
    // Extract error code from various error formats
    const errorCode = this.extractErrorCode(error);

    // Get mapped error or create generic error
    const mappedError = this.errorMap.get(errorCode) || this.errorMap.get('UNKNOWN_ERROR')!;

    // Enhance error with context-specific information
    const enhancedError: OAuthError = {
      ...mappedError,
      details: {
        originalError: error,
        context,
        timestamp: new Date().toISOString(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server-side-render',
        url: typeof window !== 'undefined' ? window.location.href : 'ssr-context',
      },
    };

    // Log error for debugging
    this.logError(enhancedError, context);

    return enhancedError;
  }

  /**
   * Extract error code from various error formats
   */
  private static extractErrorCode(error: Error | string | unknown): string {
    if (typeof error === 'string') {
      return error;
    }

    if (error && typeof error === 'object' && 'code' in error) {
      return String(error.code);
    }

    if (error && typeof error === 'object' && 'error' in error) {
      return String(error.error);
    }

    if (error && typeof error === 'object' && 'message' in error) {
      // Try to extract error code from message
      const message = String(error.message).toLowerCase();
      if (message.includes('network')) return 'NETWORK_ERROR';
      if (message.includes('timeout')) return 'TIMEOUT_ERROR';
      if (message.includes('unauthorized')) return 'TOKEN_INVALID';
      if (message.includes('forbidden')) return 'TOKEN_INVALID';
      if (message.includes('not found')) return 'PROFILE_FETCH_ERROR';
      if (message.includes('server error')) return 'SERVER_ERROR';
      if (message.includes('service unavailable')) return 'SERVICE_UNAVAILABLE';
    }

    return 'UNKNOWN_ERROR';
  }

  /**
   * Log error for debugging and monitoring
   */
  private static logError(error: OAuthError, context: OAuthErrorContext): void {
    const logData = {
      error: error.code,
      message: error.message,
      context: context.step,
      userEmail: context.userEmail,
      googleId: context.googleId,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'test-environment',
      url: typeof window !== 'undefined' ? window.location.href : 'test-url',
    };

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('OAuth Error:', logData);
    }

    // In production, you might want to send to error tracking service
    // Example: Sentry.captureException(error, { extra: logData });
  }

  /**
   * Get user-friendly error message
   */
  static getUserMessage(error: Error | string | unknown, context: OAuthErrorContext): string {
    const oauthError = this.handleError(error, context);
    return oauthError.userMessage;
  }

  /**
   * Check if error is recoverable
   */
  static isRecoverable(error: Error | string | unknown, context: OAuthErrorContext): boolean {
    const oauthError = this.handleError(error, context);
    return oauthError.recoverable;
  }

  /**
   * Get recommended action for error
   */
  static getRecommendedAction(error: Error | string | unknown, context: OAuthErrorContext): string {
    const oauthError = this.handleError(error, context);
    return oauthError.action || 'retry';
  }

  /**
   * Create error recovery strategies
   */
  static getRecoveryStrategies(
    error: Error | string | unknown,
    context: OAuthErrorContext
  ): string[] {
    const oauthError = this.handleError(error, context);
    const strategies: string[] = [];

    switch (oauthError.action) {
      case 'retry':
        strategies.push('Try signing in again');
        break;
      case 'retry_later':
        strategies.push('Wait a few minutes and try again');
        strategies.push('Check if the service is back online');
        break;
      case 'check_connection':
        strategies.push('Check your internet connection');
        strategies.push('Try refreshing the page');
        break;
      case 'contact_support':
        strategies.push('Contact technical support');
        strategies.push('Report this issue');
        break;
      case 'retry_or_support':
        strategies.push('Try the process again');
        strategies.push('Contact support if the problem persists');
        break;
      default:
        strategies.push('Try again');
        strategies.push('Contact support if the problem persists');
    }

    return strategies;
  }
}

export default OAuthErrorHandler;
