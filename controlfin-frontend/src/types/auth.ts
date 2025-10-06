/* eslint-disable no-hardcoded-strings/no-hardcoded-strings */
/**
 * Authentication Types for ControlFin
 *
 * This file contains TypeScript interfaces and Zod schemas for authentication
 * components, ensuring type safety and validation consistency.
 */

import { z } from 'zod';

// === ZOD VALIDATION SCHEMAS ===

/**
 * Login form validation schema
 * Matches backend validation requirements
 */
export const loginSchema = z.object({
  email: z.string().min(1, 'Email address is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
});

/**
 * Registration form validation schema
 * Matches backend validation requirements
 */
export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email address is required')
      .email('Please enter a valid email address')
      .max(255, 'Email address is too long'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password is too long')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        'Password must contain uppercase, lowercase, number, and special character'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    firstName: z
      .string()
      .min(1, 'First name is required')
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name cannot exceed 50 characters'),
    lastName: z
      .string()
      .min(1, 'Last name is required')
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name cannot exceed 50 characters'),
    termsAccepted: z
      .boolean()
      .refine((val) => val === true, 'You must accept the terms and conditions'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/**
 * Forgot password form validation schema
 */
export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email address is required').email('Please enter a valid email address'),
});

/**
 * Reset password form validation schema
 */
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password is too long')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        'Password must contain uppercase, lowercase, number, and special character'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    token: z.string().min(1, 'Reset token is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// === TYPESCRIPT INTERFACES ===

/**
 * Login form data type
 */
export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Registration form data type
 */
export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Forgot password form data type
 */
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * Reset password form data type
 */
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

/**
 * User interface matching backend response
 */
export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Authentication response interface
 */
export interface AuthResponse {
  message: string;
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

/**
 * Login request interface
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Registration request interface
 */
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/**
 * Password reset request interface
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * Password reset confirmation interface
 */
export interface PasswordResetConfirmation {
  password: string;
  token: string;
}

/**
 * API error response interface
 */
export interface ApiErrorDetails {
  [key: string]: unknown;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: ApiErrorDetails;
}

/**
 * Form field error interface
 */
export interface FieldError {
  field: string;
  message: string;
  code?: string;
}

/**
 * Authentication state interface
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;
}

/**
 * Authentication actions interface
 */
export interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (data: PasswordResetConfirmation) => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  clearError: () => void;
}

// Password strength types are now exported from src/hooks/usePasswordStrength

/**
 * Form validation error
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Form state interface
 */
export interface FormState {
  isLoading: boolean;
  isSubmitting: boolean;
  errors: ValidationError[];
  touched: Record<string, boolean>;
}

// === VALIDATION UTILITIES ===

/**
 * Password strength checker
 */
export const checkPasswordStrength = (password: string) => {
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

  return {
    level,
    score,
    feedback,
    isValid: score >= 4,
  };
};

/**
 * Get password strength color based on level
 */
export const getPasswordStrengthColor = (level: 'weak' | 'fair' | 'good' | 'strong'): string => {
  switch (level) {
    case 'weak':
      return '#ff3366'; // Error color
    case 'fair':
      return '#ffaa00'; // Warning color
    case 'good':
      return '#2196f3'; // Info color
    case 'strong':
      return '#00ff88'; // Success color
    default:
      return '#a0a4b8'; // Secondary text color
  }
};

// Password strength hook is now exported from src/hooks/usePasswordStrength
export {
  usePasswordStrength,
  type PasswordStrength,
  type PasswordStrengthResult,
} from '../hooks/usePasswordStrength';

export default {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  checkPasswordStrength,
  getPasswordStrengthColor,
};
