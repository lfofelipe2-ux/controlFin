/* eslint-disable no-hardcoded-strings/no-hardcoded-strings */
import { useState, useEffect } from 'react';

/**
 * Password strength level
 */
export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

/**
 * Password strength result
 */
export interface PasswordStrengthResult {
  level: PasswordStrength;
  score: number;
  feedback: string[];
  isValid: boolean;
}

/**
 * Password strength checker
 */
export const checkPasswordStrength = (password: string): PasswordStrengthResult => {
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
  let level: PasswordStrength;
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
export const getPasswordStrengthColor = (level: PasswordStrength): string => {
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

/**
 * Password strength hook
 */
export const usePasswordStrength = (password: string): PasswordStrengthResult => {
  const [strength, setStrength] = useState<PasswordStrengthResult>({
    level: 'weak',
    score: 0,
    feedback: [],
    isValid: false,
  });

  useEffect(() => {
    if (!password) {
      setStrength({
        level: 'weak',
        score: 0,
        feedback: [],
        isValid: false,
      });
      return;
    }

    const result = checkPasswordStrength(password);
    setStrength(result);
  }, [password]);

  return strength;
};
