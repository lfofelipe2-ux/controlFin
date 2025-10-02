/**
 * FormField Component
 *
 * Combines Input component with Label and Error handling for forms.
 * Provides a complete form field solution with i18n support.
 */

import React from 'react';
import { Input } from '../Input/Input';
import type { FormFieldProps } from './FormField.types';
import './FormField.scss';

/**
 * FormField Component
 */
export const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  translateLabel = false,
  error,
  translateError = true,
  required = false,
  helperText,
  translateHelperText = false,
  className = '',
  style,
  ...inputProps
}) => {
  return (
    <div className={`form-field ${className}`} style={style}>
      <Input
        {...inputProps}
        id={name}
        name={name}
        label={label}
        translateLabel={translateLabel}
        error={error}
        translateError={translateError}
        helperText={helperText}
        translateHelperText={translateHelperText}
        required={required}
      />
    </div>
  );
};

export default FormField;
