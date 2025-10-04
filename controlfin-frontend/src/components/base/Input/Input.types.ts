import type { InputProps as AntInputProps } from 'antd';
import React from 'react';

/**
 * Input component props extending Ant Design's Input props
 */
export interface InputProps extends Omit<AntInputProps, 'size'> {
  /** Label text (can be a translation key) */
  label?: string;
  /** Whether the label should be translated */
  translateLabel?: boolean;
  /** Error message to display */
  error?: string;
  /** Whether the error message should be translated */
  translateError?: boolean;
  /** Helper text to display below the input */
  helperText?: string;
  /** Whether the helper text should be translated */
  translateHelperText?: boolean;
  /** Size variant */
  size?: 'small' | 'medium' | 'large';
  /** Full width */
  fullWidth?: boolean;
  /** Icon to display at the start */
  startIcon?: React.ReactNode;
  /** Icon to display at the end */
  endIcon?: React.ReactNode;
  /** Custom className */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

/**
 * Password Input specific props
 */
export interface PasswordInputProps extends Omit<InputProps, 'type'> {
  /** Show password visibility toggle */
  visibilityToggle?: boolean;
}
