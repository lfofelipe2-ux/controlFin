/* eslint-disable no-hardcoded-strings/no-hardcoded-strings */
/**
 * Account Linking Service
 *
 * Handles the process of linking Google OAuth accounts with existing user accounts
 * and managing account conflicts during the authentication process.
 */

import logger from '../utils/logger';

// Helper function to make API requests
const makeRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  const url = `${baseUrl}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export interface AccountLinkingRequest {
  email: string;
  googleId: string;
  googleProfile: {
    name: string;
    given_name: string;
    family_name: string;
    picture?: string;
  };
}

export interface AccountLinkingResponse {
  success: boolean;
  message: string;
  user?: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    isEmailVerified: boolean;
    googleId?: string;
  };
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface AccountConflictInfo {
  hasExistingAccount: boolean;
  existingAccountEmail: string;
  canLink: boolean;
  reason?: string;
}

/**
 * Check if there's an account conflict for the given email
 */
export const checkAccountConflict = async (email: string): Promise<AccountConflictInfo> => {
  try {
    const response = await makeRequest<AccountConflictInfo>('/auth/check-account-conflict', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    return response;
  } catch (error) {
    logger.error('Error checking account conflict:', error);
    throw new Error('Failed to check account conflict');
  }
};

/**
 * Link Google account with existing user account
 */
export const linkGoogleAccount = async (
  request: AccountLinkingRequest
): Promise<AccountLinkingResponse> => {
  try {
    const response = await makeRequest<AccountLinkingResponse>('/auth/link-google-account', {
      method: 'POST',
      body: JSON.stringify(request),
    });

    // Store tokens if provided
    if (response.tokens) {
      localStorage.setItem('accessToken', response.tokens.accessToken);
      localStorage.setItem('refreshToken', response.tokens.refreshToken);
    }

    return response;
  } catch (error) {
    logger.error('Error linking Google account:', error);
    throw new Error('Failed to link Google account');
  }
};

/**
 * Create new account with Google OAuth (when user chooses not to link)
 */
export const createAccountWithGoogle = async (
  request: AccountLinkingRequest
): Promise<AccountLinkingResponse> => {
  try {
    const response = await makeRequest<AccountLinkingResponse>('/auth/create-google-account', {
      method: 'POST',
      body: JSON.stringify(request),
    });

    // Store tokens if provided
    if (response.tokens) {
      localStorage.setItem('accessToken', response.tokens.accessToken);
      localStorage.setItem('refreshToken', response.tokens.refreshToken);
    }

    return response;
  } catch (error) {
    logger.error('Error creating Google account:', error);
    throw new Error('Failed to create Google account');
  }
};

/**
 * Handle OAuth callback with account linking logic
 */
export const handleOAuthCallbackWithLinking = async (googleProfile: {
  id: string;
  email: string;
  name: string;
  given_name: string;
  family_name: string;
  picture?: string;
}): Promise<{
  needsLinking: boolean;
  conflictInfo?: AccountConflictInfo;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
}> => {
  try {
    // Check for account conflicts
    const conflictInfo = await checkAccountConflict(googleProfile.email);

    if (conflictInfo.hasExistingAccount && conflictInfo.canLink) {
      // Account exists and can be linked
      return {
        needsLinking: true,
        conflictInfo,
      };
    } else if (conflictInfo.hasExistingAccount && !conflictInfo.canLink) {
      // Account exists but cannot be linked (e.g., already has Google account)
      throw new Error(conflictInfo.reason || 'Account cannot be linked');
    } else {
      // No conflict, proceed with normal OAuth flow
      const response = await makeRequest<{
        user: {
          id: string;
          email: string;
          firstName: string;
          lastName: string;
          avatar?: string;
        };
        tokens: {
          accessToken: string;
          refreshToken: string;
        };
      }>('/auth/google/callback', {
        method: 'POST',
        body: JSON.stringify({
          code: 'DIRECT_OAUTH_FLOW', // Special code for direct OAuth flow
          profile: googleProfile,
        }),
      });

      return {
        needsLinking: false,
        user: response.user,
        tokens: response.tokens,
      };
    }
  } catch (error) {
    logger.error('Error handling OAuth callback with linking:', error);
    throw error;
  }
};

export default {
  checkAccountConflict,
  linkGoogleAccount,
  createAccountWithGoogle,
  handleOAuthCallbackWithLinking,
};
