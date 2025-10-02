import type { ButtonProps as AntButtonProps } from 'antd';
import React from 'react';

/**
 * Button Variant Types
 */
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'link'
  | 'text'
  | 'danger'
  | 'dashed';

/**
 * Button size types
 */
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Button component props extending Ant Design's Button props
 */
export interface ButtonProps extends Omit<AntButtonProps, 'size' | 'type' | 'variant'> {
  /** Button text content (can be a translation key) */
  children?: React.ReactNode;
  /** Whether the content should be translated */
  translateContent?: boolean;
  /** Button variant */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Full width button */
  fullWidth?: boolean;
  /** Icon to display at the start */
  startIcon?: React.ReactNode;
  /** Icon to display at the end */
  endIcon?: React.ReactNode;
  /** Loading state */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  /** Custom className */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}
