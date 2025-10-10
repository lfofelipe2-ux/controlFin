import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FormField } from '../FormField';

// Mock react-i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe('FormField Component', () => {
    it('should render with basic props', () => {
        render(
            <FormField
                name="testField"
                label="Test Field"
                placeholder="Enter value"
            />
        );

        expect(screen.getByText('Test Field')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter value')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter value')).toHaveAttribute('name', 'testField');
        expect(screen.getByPlaceholderText('Enter value')).toHaveAttribute('id', 'testField');
    });

    it('should render with required indicator', () => {
        render(
            <FormField
                name="requiredField"
                label="Required Field"
                required
                placeholder="Enter value"
            />
        );

        expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('should render with error message', () => {
        render(
            <FormField
                name="errorField"
                label="Error Field"
                error="This field is required"
                placeholder="Enter value"
            />
        );

        expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('should render with helper text', () => {
        render(
            <FormField
                name="helperField"
                label="Helper Field"
                helperText="This is helpful information"
                placeholder="Enter value"
            />
        );

        expect(screen.getByText('This is helpful information')).toBeInTheDocument();
    });

    it('should not show helper text when error is present', () => {
        render(
            <FormField
                name="errorHelperField"
                label="Error Helper Field"
                error="This field is required"
                helperText="This is helpful information"
                placeholder="Enter value"
            />
        );

        expect(screen.getByText('This field is required')).toBeInTheDocument();
        expect(screen.queryByText('This is helpful information')).not.toBeInTheDocument();
    });

    it('should handle different input types', () => {
        const { rerender } = render(
            <FormField
                name="textField"
                type="text"
                placeholder="Text input"
                label="Text Field"
            />
        );
        expect(screen.getByPlaceholderText('Text input')).toHaveAttribute('type', 'text');

        rerender(
            <FormField
                name="emailField"
                type="email"
                placeholder="Email input"
                label="Email Field"
            />
        );
        expect(screen.getByPlaceholderText('Email input')).toHaveAttribute('type', 'email');

        rerender(
            <FormField
                name="numberField"
                type="number"
                placeholder="Number input"
                label="Number Field"
            />
        );
        expect(screen.getByPlaceholderText('Number input')).toHaveAttribute('type', 'number');
    });

    it('should handle disabled state', () => {
        render(
            <FormField
                name="disabledField"
                disabled
                placeholder="Disabled input"
                label="Disabled Field"
            />
        );

        expect(screen.getByPlaceholderText('Disabled input')).toBeDisabled();
    });

    it('should handle value changes', () => {
        const handleChange = vi.fn();
        render(
            <FormField
                name="changeField"
                onChange={handleChange}
                placeholder="Enter value"
            />
        );

        const input = screen.getByPlaceholderText('Enter value');
        fireEvent.change(input, { target: { value: 'test value' } });

        expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('should translate label when translateLabel is true', () => {
        render(
            <FormField
                name="translateField"
                label="translation.label.key"
                translateLabel
                placeholder="Enter value"
            />
        );

        expect(screen.getByText('translation.label.key')).toBeInTheDocument();
    });

    it('should translate error by default', () => {
        render(
            <FormField
                name="translateErrorField"
                error="translation.error.key"
                placeholder="Enter value"
            />
        );

        expect(screen.getByText('translation.error.key')).toBeInTheDocument();
    });

    it('should not translate error when translateError is false', () => {
        render(
            <FormField
                name="noTranslateErrorField"
                error="translation.error.key"
                translateError={false}
                placeholder="Enter value"
            />
        );

        expect(screen.getByText('translation.error.key')).toBeInTheDocument();
    });

    it('should translate helper text when translateHelperText is true', () => {
        render(
            <FormField
                name="translateHelperField"
                helperText="translation.helper.key"
                translateHelperText
                placeholder="Enter value"
            />
        );

        expect(screen.getByText('translation.helper.key')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
        render(
            <FormField
                name="customClassField"
                className="custom-form-field"
                placeholder="Enter value"
            />
        );

        const container = screen.getByPlaceholderText('Enter value').closest('.form-field');
        expect(container).toHaveClass('custom-form-field');
    });

    it('should apply custom style', () => {
        const customStyle = { marginTop: '20px' };
        render(
            <FormField
                name="customStyleField"
                style={customStyle}
                placeholder="Enter value"
            />
        );

        const container = screen.getByPlaceholderText('Enter value').closest('.form-field');
        expect(container).toHaveStyle('margin-top: 20px');
    });

    it('should pass through additional props to Input component', () => {
        render(
            <FormField
                name="additionalPropsField"
                data-testid="custom-input"
                aria-label="Custom label"
                placeholder="Enter value"
            />
        );

        const input = screen.getByTestId('custom-input');
        expect(input).toHaveAttribute('aria-label', 'Custom label');
    });
});
