/**
 * Input Component
 *
 * Reusable input component with i18n support, error handling, and consistent styling.
 * Built on top of Ant Design's Input component with BlockAI theme customization.
 */

import { Input as AntInput, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useBlockAITheme } from '../../../hooks/useBlockAITheme';
import './Input.scss';
import { InputProps, PasswordInputProps } from './Input.types';

const { Text } = Typography;

/**
 * Base Input Component
 */
export const Input: React.FC<InputProps> = ({
  label,
  translateLabel = false,
  error,
  translateError = true,
  helperText,
  translateHelperText = false,
  size = 'medium',
  fullWidth = false,
  startIcon,
  endIcon,
  className = '',
  style,
  disabled,
  ...antInputProps
}) => {
  const { t } = useTranslation();
  const { colors } = useBlockAITheme();

  // Map size to Ant Design size
  const antSize = size === 'small' ? 'small' : size === 'large' ? 'large' : 'middle';

  // Translate label if needed
  const displayLabel = translateLabel && label ? t(label) : label;
  const displayError = translateError && error ? t(error) : error;
  const displayHelperText = translateHelperText && helperText ? t(helperText) : helperText;

  return (
    <div
      className={`base-input ${fullWidth ? 'base-input--full-width' : ''} ${
        error ? 'base-input--error' : ''
      } ${disabled ? 'base-input--disabled' : ''} ${className}`}
      style={style}
    >
      {label && (
        <label className='base-input__label'>
          <Text strong>{displayLabel}</Text>
          {antInputProps.required && <span className='base-input__required'>*</span>}
        </label>
      )}

      <AntInput
        size={antSize}
        prefix={startIcon}
        suffix={endIcon}
        disabled={disabled}
        status={error ? 'error' : undefined}
        {...antInputProps}
        className={`base-input__field ${antInputProps.className || ''}`}
      />

      {error && (
        <Text type='danger' className='base-input__error'>
          {displayError}
        </Text>
      )}

      {helperText && !error && (
        <Text type='secondary' className='base-input__helper'>
          {displayHelperText}
        </Text>
      )}
    </div>
  );
};

/**
 * Password Input Component
 */
export const PasswordInput: React.FC<PasswordInputProps> = ({
  visibilityToggle = true,
  ...inputProps
}) => {
  return (
    <Input
      {...inputProps}
      type='password'
      endIcon={
        visibilityToggle ? (
          <AntInput.Password
            visibilityToggle={visibilityToggle}
            style={{ border: 'none', padding: 0 }}
          />
        ) : undefined
      }
    />
  );
};

// Export default
export default Input;
