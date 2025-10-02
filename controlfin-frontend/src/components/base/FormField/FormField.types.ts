import { InputProps } from '../Input/Input.types';

/**
 * FormField component props
 * Combines Input with Label and Error handling
 */
export interface FormFieldProps extends Omit<InputProps, 'error' | 'label'> {
  /** Field name/id */
  name: string;
  /** Label text (can be a translation key) */
  label: string;
  /** Whether the label should be translated */
  translateLabel?: boolean;
  /** Error message to display */
  error?: string;
  /** Whether the error message should be translated */
  translateError?: boolean;
  /** Whether the field is required */
  required?: boolean;
  /** Helper text to display below the input */
  helperText?: string;
  /** Whether the helper text should be translated */
  translateHelperText?: boolean;
  /** Custom className */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}
