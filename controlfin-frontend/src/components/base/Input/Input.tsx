/**
 * Input Component
 *
 * Reusable input component with i18n support, error handling, and consistent styling.
 * Built on top of Ant Design's Input component with BlockAI theme customization.
 */

import { Input as AntInput } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import './Input.scss';
import type { InputProps, PasswordInputProps } from './Input.types';

/**
 * Base Input Component
 */
export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  translateLabel = false,
  translateError = false,
  translateHelperText = false,
  size = 'medium',
  fullWidth = false,
  ...props
}) => {
  const { t } = useTranslation();

  // Map size to Ant Design size
  const sizeMap = {
    small: 'small' as const,
    medium: 'middle' as const,
    large: 'large' as const,
  };

  // Translate label if needed
  const displayLabel = translateLabel && label ? t(label) : label;
  const displayError = translateError && error ? t(error) : error;
  const displayHelperText = translateHelperText && helperText ? t(helperText) : helperText;

  return (
    <div
      className={`blockai-input ${fullWidth ? 'blockai-input--full-width' : ''} ${
        error ? 'blockai-input--error' : ''
      } ${props.disabled ? 'blockai-input--disabled' : ''}`}
    >
      {label && (
        <label className='blockai-input__label'>
          <span className='blockai-input__label-text'>{displayLabel}</span>
          {props.required && <span className='blockai-input__required'>*</span>}
        </label>
      )}

      <AntInput {...props} status={error ? 'error' : undefined} size={sizeMap[size]} />

      {error && <span className='blockai-input__error'>{displayError}</span>}

      {helperText && !error && <span className='blockai-input__helper'>{displayHelperText}</span>}
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
  const { t } = useTranslation();

  // Translate label if needed
  const displayLabel =
    inputProps.translateLabel && inputProps.label ? t(inputProps.label) : inputProps.label;
  const displayError =
    inputProps.translateError && inputProps.error ? t(inputProps.error) : inputProps.error;
  const displayHelperText =
    inputProps.translateHelperText && inputProps.helperText
      ? t(inputProps.helperText)
      : inputProps.helperText;

  return (
    <div className={inputProps.fullWidth ? 'blockai-input--full-width' : ''}>
      {inputProps.label && (
        <label className='blockai-input__label'>
          <span className='blockai-input__label-text'>{displayLabel}</span>
          {inputProps.required && <span className='blockai-input__required'>*</span>}
        </label>
      )}

      <AntInput.Password
        {...inputProps}
        status={inputProps.error ? 'error' : undefined}
        size={
          inputProps.size === 'small' ? 'small' : inputProps.size === 'large' ? 'large' : 'middle'
        }
        visibilityToggle={visibilityToggle}
      />

      {inputProps.error && <span className='blockai-input__error'>{displayError}</span>}

      {inputProps.helperText && !inputProps.error && (
        <span className='blockai-input__helper'>{displayHelperText}</span>
      )}
    </div>
  );
};

// Export default
export default Input;
