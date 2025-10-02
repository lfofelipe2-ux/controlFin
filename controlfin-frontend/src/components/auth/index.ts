/**
 * Authentication Components Export
 *
 * This file exports all authentication-related components
 * for easy importing throughout the application.
 */

export { default as AuthPage } from './AuthPage';
export { default as ForgotPasswordForm } from './ForgotPasswordForm';
export { default as LoginForm } from './LoginForm';
export { default as RegisterForm } from './RegisterForm';
export { default as ResetPasswordForm } from './ResetPasswordForm';

// Re-export types and hooks for convenience
export { useAuth } from '../../hooks/useAuth';
export { usePasswordStrength } from '../../types/auth';
export type {
  ForgotPasswordFormData,
  LoginFormData,
  RegisterFormData,
  ResetPasswordFormData,
} from '../../types/auth';
