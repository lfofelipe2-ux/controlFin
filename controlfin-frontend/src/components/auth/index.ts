/**
 * Authentication Components Export
 *
 * This file exports all authentication-related components
 * for easy importing throughout the application.
 */

export { default as LoginForm } from './LoginForm';
export { default as RegisterForm } from './RegisterForm';
export { default as AuthPage } from './AuthPage';

// Re-export types and hooks for convenience
export type { LoginFormData, RegisterFormData } from '../../types/auth';
export { useAuth } from '../../hooks/useAuth';
export { usePasswordStrength } from '../../types/auth';
