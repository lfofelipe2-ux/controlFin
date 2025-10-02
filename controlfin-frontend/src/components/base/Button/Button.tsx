/**
 * Button Component
 *
 * Reusable button component with i18n support and consistent styling.
 * Built on top of Ant Design's Button component with BlockAI theme customization.
 */

import { Button as AntButton } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import './Button.scss';
import type { ButtonProps, ButtonVariant } from './Button.types';

/**
 * Map variant to Ant Design button type
 */
const getAntButtonType = (variant: ButtonVariant = 'primary'): any => {
  switch (variant) {
    case 'primary':
      return 'primary';
    case 'secondary':
      return 'default';
    case 'ghost':
      return 'ghost';
    case 'link':
      return 'link';
    case 'text':
      return 'text';
    case 'danger':
      return 'primary'; // We'll handle danger styling separately
    default:
      return 'default';
  }
};

/**
 * Base Button Component
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  translateContent = false,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  startIcon,
  endIcon,
  loading = false,
  disabled = false,
  onClick,
  className = '',
  style,
  ...antButtonProps
}) => {
  const { t } = useTranslation();

  // Map size to Ant Design size
  const antSize = size === 'small' ? 'small' : size === 'large' ? 'large' : 'middle';

  // Translate content if needed
  const displayContent = translateContent && typeof children === 'string' ? t(children) : children;

  // Combine icons with content
  const buttonContent = (
    <>
      {startIcon && <span className='base-button__start-icon'>{startIcon}</span>}
      {displayContent}
      {endIcon && <span className='base-button__end-icon'>{endIcon}</span>}
    </>
  );

  return (
    <AntButton
      type={getAntButtonType(variant)}
      size={antSize}
      loading={loading}
      disabled={disabled}
      onClick={onClick}
      danger={variant === 'danger'}
      block={fullWidth}
      {...antButtonProps}
      className={`base-button base-button--${variant} base-button--${size} ${
        fullWidth ? 'base-button--full-width' : ''
      } ${className}`}
      style={style}
    >
      {buttonContent}
    </AntButton>
  );
};

export default Button;
