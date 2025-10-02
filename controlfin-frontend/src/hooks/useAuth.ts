/**
 * Authentication Hook for ControlFin
 *
 * This hook provides authentication state management and actions
 * using Zustand for state management and the auth service for API calls.
 */

import React from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AuthState,
  AuthActions,
  LoginRequest,
  RegisterRequest,
  PasswordResetConfirmation,
} from '../types/auth';
import authService from '../services/authService';

// === AUTHENTICATION STORE INTERFACE ===

interface AuthStore extends AuthState, AuthActions {
  initializeAuth: () => Promise<void>;
}

// === AUTHENTICATION STORE ===

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // === STATE ===
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      accessToken: null,
      refreshToken: null,

      // === ACTIONS ===

      /**
       * Login user with credentials
       */
      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.loginUser(credentials);

          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          });
        } catch (error: any) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message || 'Login failed',
            accessToken: null,
            refreshToken: null,
          });
          throw error;
        }
      },

      /**
       * Register new user
       */
      register: async (userData: RegisterRequest) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.registerUser(userData);

          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          });
        } catch (error: any) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message || 'Registration failed',
            accessToken: null,
            refreshToken: null,
          });
          throw error;
        }
      },

      /**
       * Logout user
       */
      logout: async () => {
        set({ isLoading: true });

        try {
          await authService.logoutUser();
        } catch (error) {
          console.warn('Logout error:', error);
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            accessToken: null,
            refreshToken: null,
          });
        }
      },

      /**
       * Request password reset
       */
      forgotPassword: async (email: string) => {
        set({ isLoading: true, error: null });

        try {
          await authService.requestPasswordReset(email);
          set({ isLoading: false, error: null });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Password reset request failed',
          });
          throw error;
        }
      },

      /**
       * Reset password with token
       */
      resetPassword: async (data: PasswordResetConfirmation) => {
        set({ isLoading: true, error: null });

        try {
          await authService.resetPassword(data);
          set({ isLoading: false, error: null });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Password reset failed',
          });
          throw error;
        }
      },

      /**
       * Refresh access token
       */
      refreshAccessToken: async () => {
        const { refreshToken } = get();

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        try {
          const response = await authService.refreshAccessToken();

          set({
            accessToken: response.accessToken,
            error: null,
          });
        } catch (error: any) {
          // If refresh fails, logout user
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: 'Session expired. Please login again.',
            accessToken: null,
            refreshToken: null,
          });
          throw error;
        }
      },

      /**
       * Clear error state
       */
      clearError: () => {
        set({ error: null });
      },

      /**
       * Initialize authentication state from stored tokens
       */
      initializeAuth: async () => {
        const token = authService.getAccessToken();

        if (!token) {
          return;
        }

        // Check if token is expired
        if (authService.isTokenExpired(token)) {
          try {
            await get().refreshAccessToken();
          } catch {
            // If refresh fails, clear auth state
            get().logout();
            return;
          }
        }

        // Get current user data
        try {
          set({ isLoading: true });
          const response = await authService.getCurrentUser();

          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          });
        } catch (error: any) {
          // If getting user data fails, logout
          get().logout();
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);

// === CUSTOM HOOK ===

/**
 * Custom hook for authentication
 * Provides convenient access to auth state and actions
 */
export const useAuth = () => {
  const store = useAuthStore();

  return {
    // State
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,

    // Actions
    login: store.login,
    register: store.register,
    logout: store.logout,
    forgotPassword: store.forgotPassword,
    resetPassword: store.resetPassword,
    refreshAccessToken: store.refreshAccessToken,
    clearError: store.clearError,
    initializeAuth: store.initializeAuth,
  };
};

// === AUTHENTICATION GUARD HOOK ===

/**
 * Hook for protecting routes that require authentication
 */
export const useRequireAuth = () => {
  const { isAuthenticated, isLoading, initializeAuth } = useAuth();

  // Initialize auth on mount
  React.useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return {
    isAuthenticated,
    isLoading,
    isReady: !isLoading,
  };
};

// === PASSWORD STRENGTH HOOK ===

/**
 * Hook for password strength validation
 */
export const usePasswordStrength = (password: string) => {
  const [strength, setStrength] = React.useState<{
    level: 'weak' | 'fair' | 'good' | 'strong';
    score: number;
    feedback: string[];
    isValid: boolean;
  }>({
    level: 'weak',
    score: 0,
    feedback: [],
    isValid: false,
  });

  React.useEffect(() => {
    if (!password) {
      setStrength({
        level: 'weak',
        score: 0,
        feedback: [],
        isValid: false,
      });
      return;
    }

    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('At least 8 characters');
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('At least one lowercase letter');
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('At least one uppercase letter');
    }

    // Number check
    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('At least one number');
    }

    // Special character check
    if (/[@$!%*?&]/.test(password)) {
      score += 1;
    } else {
      feedback.push('At least one special character (@$!%*?&)');
    }

    // Determine strength level
    let level: 'weak' | 'fair' | 'good' | 'strong';
    if (score < 3) {
      level = 'weak';
    } else if (score < 4) {
      level = 'fair';
    } else if (score < 5) {
      level = 'good';
    } else {
      level = 'strong';
    }

    setStrength({
      level,
      score,
      feedback,
      isValid: score >= 4,
    });
  }, [password]);

  return strength;
};

export default useAuth;
