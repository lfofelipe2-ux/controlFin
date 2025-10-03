/**
 * Authentication Service for ControlFin
 *
 * This service handles all authentication-related API calls,
 * including login, registration, password reset, and token management.
 */

import type {
  ApiError,
  AuthResponse,
  LoginRequest,
  PasswordResetConfirmation,
  RegisterRequest,
} from '../types/auth';

// === API CONFIGURATION ===

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const API_VERSION = 'v1';

/**
 * Get full API endpoint URL
 */
const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}/${API_VERSION}${endpoint}`;
};

/**
 * Get authorization header with access token
 */
const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// === API ERROR HANDLING ===

/**
 * Handle API errors and convert to standardized format
 */
const handleApiError = async (response: Response): Promise<never> => {
  let errorData: ApiError;

  try {
    errorData = await response.json();
  } catch {
    errorData = {
      message: 'An unexpected error occurred',
      status: response.status,
      code: 'UNKNOWN_ERROR',
    };
  }

  const error: ApiError = {
    message: errorData.message || 'An unexpected error occurred',
    status: response.status,
    code: errorData.code,
    details: errorData.details,
  };

  throw error;
};

/**
 * Make authenticated API request
 */
const makeRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = getApiUrl(endpoint);
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    await handleApiError(response);
  }

  return response.json();
};

// === AUTHENTICATION API METHODS ===

/**
 * Login user with email and password
 */
export const loginUser = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const response = await makeRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  // Store tokens in localStorage
  if ((response as any).accessToken && (response as any).refreshToken) {
    localStorage.setItem('accessToken', (response as any).accessToken);
    localStorage.setItem('refreshToken', (response as any).refreshToken);
  } else if ((response as any).tokens) {
    const tokens = (response as any).tokens as { accessToken: string; refreshToken: string };
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }

  return response;
};

/**
 * Register new user
 */
export const registerUser = async (userData: RegisterRequest): Promise<AuthResponse> => {
  const response = await makeRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });

  // Store tokens in localStorage
  if ((response as any).accessToken && (response as any).refreshToken) {
    localStorage.setItem('accessToken', (response as any).accessToken);
    localStorage.setItem('refreshToken', (response as any).refreshToken);
  } else if ((response as any).tokens) {
    const tokens = (response as any).tokens as { accessToken: string; refreshToken: string };
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }

  return response;
};

/**
 * Logout user
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await makeRequest('/auth/logout', {
      method: 'POST',
    });
  } catch (error) {
    // Even if logout fails on server, clear local tokens
    console.warn('Logout request failed, but clearing local tokens:', error);
  } finally {
    // Always clear local tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};

/**
 * Refresh access token
 */
export const refreshAccessToken = async (): Promise<{ accessToken: string }> => {
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await makeRequest<
    { accessToken?: string; tokens?: { accessToken: string; refreshToken: string } }
  >('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });

  // Update stored access token
  if (response.tokens?.accessToken) {
    localStorage.setItem('accessToken', response.tokens.accessToken);
  } else if (response.accessToken) {
    localStorage.setItem('accessToken', response.accessToken);
  }

  return { accessToken: response.tokens?.accessToken || (response.accessToken as string) };
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (): Promise<AuthResponse> => {
  return makeRequest<AuthResponse>('/auth/me');
};

/**
 * Request password reset
 */
export const requestPasswordReset = async (email: string): Promise<{ message: string }> => {
  return makeRequest<{ message: string }>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

/**
 * Forgot password - alias for requestPasswordReset
 */
export const forgotPassword = requestPasswordReset;

/**
 * Reset password with token
 */
export const resetPassword = async (
  data: PasswordResetConfirmation
): Promise<{ message: string }> => {
  return makeRequest<{ message: string }>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * Verify email address
 */
export const verifyEmail = async (token: string): Promise<{ message: string }> => {
  return makeRequest<{ message: string }>('/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
};

/**
 * Resend email verification
 */
export const resendEmailVerification = async (): Promise<{ message: string }> => {
  return makeRequest<{ message: string }>('/auth/resend-verification', {
    method: 'POST',
  });
};

/**
 * Update user profile
 */
export const updateProfile = async (
  userData: Partial<{
    firstName: string;
    lastName: string;
    email: string;
  }>
): Promise<AuthResponse> => {
  return makeRequest<AuthResponse>('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
};

/**
 * Change password
 */
export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ message: string }> => {
  return makeRequest<{ message: string }>('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// === TOKEN MANAGEMENT UTILITIES ===

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('accessToken');
  return !!token;
};

/**
 * Get stored access token
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

/**
 * Get stored refresh token
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken');
};

/**
 * Clear all stored tokens
 */
export const clearTokens = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

/**
 * Check if token is expired (basic check)
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch {
    return true; // If we can't parse the token, consider it expired
  }
};

// === GOOGLE OAUTH ===

/**
 * Initiate Google OAuth login
 */
export const initiateGoogleLogin = (): void => {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const redirectUri = `${window.location.origin}/auth/callback`;

  if (!googleClientId) {
    throw new Error('Google Client ID not configured');
  }

  const googleAuthUrl = new URL('https://accounts.google.com/oauth/authorize');
  googleAuthUrl.searchParams.set('client_id', googleClientId);
  googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'openid email profile');
  googleAuthUrl.searchParams.set('access_type', 'offline');
  googleAuthUrl.searchParams.set('prompt', 'consent');

  window.location.href = googleAuthUrl.toString();
};

/**
 * Handle Google OAuth callback
 */
export const handleGoogleCallback = async (code: string): Promise<AuthResponse> => {
  const response = await makeRequest<AuthResponse>('/auth/google/callback', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });

  // Store tokens in localStorage
  if (response.accessToken && response.refreshToken) {
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
  }

  return response;
};

// === EXPORT ALL METHODS ===

const authService = {
  // Authentication
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,

  // Password management
  requestPasswordReset,
  forgotPassword,
  resetPassword,
  changePassword,

  // Email verification
  verifyEmail,
  resendEmailVerification,

  // Profile management
  updateProfile,

  // Token management
  refreshAccessToken,
  isAuthenticated,
  getAccessToken,
  getRefreshToken,
  clearTokens,
  isTokenExpired,

  // OAuth
  initiateGoogleLogin,
  handleGoogleCallback,
};

export default authService;
export { authService };
