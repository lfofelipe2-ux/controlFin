import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  checkAccountConflict,
  linkGoogleAccount,
  createAccountWithGoogle,
  handleOAuthCallbackWithLinking,
  type AccountLinkingRequest,
  type AccountConflictInfo,
  type AccountLinkingResponse,
} from '../accountLinkingService';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock import.meta.env
vi.mock('import.meta', () => ({
  env: {
    VITE_API_URL: 'http://localhost:3000/api',
  },
}));

// Mock logger
vi.mock('../../utils/logger', () => ({
  default: {
    error: vi.fn(),
  },
}));

describe('Account Linking Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.setItem.mockClear();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('checkAccountConflict', () => {
    it('should check account conflict successfully', async () => {
      const mockResponse: AccountConflictInfo = {
        hasExistingAccount: true,
        existingAccountEmail: 'test@example.com',
        canLink: true,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await checkAccountConflict('test@example.com');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/auth/check-account-conflict',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: 'test@example.com' }),
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it('should handle API error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Internal server error' }),
      });

      await expect(checkAccountConflict('test@example.com')).rejects.toThrow(
        'Failed to check account conflict'
      );
    });

    it('should handle network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(checkAccountConflict('test@example.com')).rejects.toThrow(
        'Failed to check account conflict'
      );
    });
  });

  describe('linkGoogleAccount', () => {
    const mockRequest: AccountLinkingRequest = {
      email: 'test@example.com',
      googleId: 'google123',
      googleProfile: {
        name: 'Test User',
        given_name: 'Test',
        family_name: 'User',
        picture: 'https://example.com/avatar.jpg',
      },
    };

    it('should link Google account successfully', async () => {
      const mockResponse: AccountLinkingResponse = {
        success: true,
        message: 'Account linked successfully',
        user: {
          _id: 'user123',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          avatar: 'https://example.com/avatar.jpg',
          isEmailVerified: true,
          googleId: 'google123',
        },
        tokens: {
          accessToken: 'access123',
          refreshToken: 'refresh123',
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await linkGoogleAccount(mockRequest);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/auth/link-google-account',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mockRequest),
        }
      );

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('accessToken', 'access123');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('refreshToken', 'refresh123');
      expect(result).toEqual(mockResponse);
    });

    it('should handle API error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Invalid request' }),
      });

      await expect(linkGoogleAccount(mockRequest)).rejects.toThrow(
        'Failed to link Google account'
      );
    });

    it('should handle response without tokens', async () => {
      const mockResponse: AccountLinkingResponse = {
        success: true,
        message: 'Account linked successfully',
        user: {
          _id: 'user123',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          isEmailVerified: true,
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await linkGoogleAccount(mockRequest);

      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });
  });

  describe('createAccountWithGoogle', () => {
    const mockRequest: AccountLinkingRequest = {
      email: 'newuser@example.com',
      googleId: 'google456',
      googleProfile: {
        name: 'New User',
        given_name: 'New',
        family_name: 'User',
      },
    };

    it('should create account with Google successfully', async () => {
      const mockResponse: AccountLinkingResponse = {
        success: true,
        message: 'Account created successfully',
        user: {
          _id: 'user456',
          email: 'newuser@example.com',
          firstName: 'New',
          lastName: 'User',
          isEmailVerified: true,
          googleId: 'google456',
        },
        tokens: {
          accessToken: 'access456',
          refreshToken: 'refresh456',
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await createAccountWithGoogle(mockRequest);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/auth/create-google-account',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mockRequest),
        }
      );

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('accessToken', 'access456');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('refreshToken', 'refresh456');
      expect(result).toEqual(mockResponse);
    });

    it('should handle API error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 409,
        json: async () => ({ message: 'Account already exists' }),
      });

      await expect(createAccountWithGoogle(mockRequest)).rejects.toThrow(
        'Failed to create Google account'
      );
    });
  });

  describe('handleOAuthCallbackWithLinking', () => {
    const mockGoogleProfile = {
      id: 'google789',
      email: 'existing@example.com',
      name: 'Existing User',
      given_name: 'Existing',
      family_name: 'User',
      picture: 'https://example.com/existing.jpg',
    };

    it('should handle account that needs linking', async () => {
      const mockConflictInfo: AccountConflictInfo = {
        hasExistingAccount: true,
        existingAccountEmail: 'existing@example.com',
        canLink: true,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockConflictInfo,
      });

      const result = await handleOAuthCallbackWithLinking(mockGoogleProfile);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/auth/check-account-conflict',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: 'existing@example.com' }),
        }
      );

      expect(result).toEqual({
        needsLinking: true,
        conflictInfo: mockConflictInfo,
      });
    });

    it('should handle account that cannot be linked', async () => {
      const mockConflictInfo: AccountConflictInfo = {
        hasExistingAccount: true,
        existingAccountEmail: 'existing@example.com',
        canLink: false,
        reason: 'Account already has Google OAuth linked',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockConflictInfo,
      });

      await expect(handleOAuthCallbackWithLinking(mockGoogleProfile)).rejects.toThrow(
        'Account already has Google OAuth linked'
      );
    });

    it('should handle new account (no conflict)', async () => {
      const mockConflictInfo: AccountConflictInfo = {
        hasExistingAccount: false,
        existingAccountEmail: '',
        canLink: false,
      };

      const mockOAuthResponse = {
        user: {
          id: 'user789',
          email: 'existing@example.com',
          firstName: 'Existing',
          lastName: 'User',
          avatar: 'https://example.com/existing.jpg',
        },
        tokens: {
          accessToken: 'access789',
          refreshToken: 'refresh789',
        },
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockConflictInfo,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockOAuthResponse,
        });

      const result = await handleOAuthCallbackWithLinking(mockGoogleProfile);

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch).toHaveBeenNthCalledWith(2, 'http://localhost:3000/api/auth/google/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: 'DIRECT_OAUTH_FLOW',
          profile: mockGoogleProfile,
        }),
      });

      expect(result).toEqual({
        needsLinking: false,
        user: mockOAuthResponse.user,
        tokens: mockOAuthResponse.tokens,
      });
    });

    it('should handle error during conflict check', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(handleOAuthCallbackWithLinking(mockGoogleProfile)).rejects.toThrow(
        'Failed to check account conflict'
      );
    });

    it('should handle error during OAuth callback', async () => {
      const mockConflictInfo: AccountConflictInfo = {
        hasExistingAccount: false,
        existingAccountEmail: '',
        canLink: false,
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockConflictInfo,
        })
        .mockRejectedValueOnce(new Error('OAuth error'));

      await expect(handleOAuthCallbackWithLinking(mockGoogleProfile)).rejects.toThrow(
        'OAuth error'
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      await expect(checkAccountConflict('test@example.com')).rejects.toThrow(
        'Failed to check account conflict'
      );
    });

    it('should handle response without error message', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({}),
      });

      await expect(checkAccountConflict('test@example.com')).rejects.toThrow(
        'Failed to check account conflict'
      );
    });
  });

  describe('Environment Configuration', () => {
    it('should use default API URL when VITE_API_URL is not set', async () => {
      // Mock import.meta.env to return undefined
      vi.doMock('import.meta', () => ({
        env: {},
      }));

      const mockResponse: AccountConflictInfo = {
        hasExistingAccount: false,
        existingAccountEmail: '',
        canLink: false,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await checkAccountConflict('test@example.com');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/auth/check-account-conflict',
        expect.any(Object)
      );
    });
  });
});
