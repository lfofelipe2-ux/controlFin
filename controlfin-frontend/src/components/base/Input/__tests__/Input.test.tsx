import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Input, PasswordInput } from '../Input';

// Mock react-i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe('Input Component', () => {
    it('should render with default props', () => {
        render(<Input placeholder="Enter text" />);

        const input = screen.getByPlaceholderText('Enter text');
        expect(input).toBeInTheDocument();
        expect(input).toHaveClass('ant-input');
    });

    it('should render with label', () => {
        render(<Input label="Test Label" placeholder="Enter text" />);

        expect(screen.getByText('Test Label')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('should render with required indicator', () => {
        render(<Input label="Required Field" required placeholder="Enter text" />);

        expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('should render with error state', () => {
        render(<Input error="This field is required" placeholder="Enter text" />);

        expect(screen.getByText('This field is required')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter text')).toHaveClass('ant-input-status-error');
    });

    it('should render with helper text', () => {
        render(<Input helperText="This is helpful information" placeholder="Enter text" />);

        expect(screen.getByText('This is helpful information')).toBeInTheDocument();
    });

    it('should not show helper text when error is present', () => {
        render(
            <Input
                error="This field is required"
                helperText="This is helpful information"
                placeholder="Enter text"
            />
        );

        expect(screen.getByText('This field is required')).toBeInTheDocument();
        expect(screen.queryByText('This is helpful information')).not.toBeInTheDocument();
    });

    it('should handle different sizes', () => {
        const { rerender } = render(<Input size="small" placeholder="Small" />);
        expect(screen.getByPlaceholderText('Small')).toHaveClass('ant-input-sm');

        rerender(<Input size="large" placeholder="Large" />);
        expect(screen.getByPlaceholderText('Large')).toHaveClass('ant-input-lg');

        rerender(<Input size="medium" placeholder="Medium" />);
        expect(screen.getByPlaceholderText('Medium')).toHaveClass('ant-input');
    });

    it('should handle full width', () => {
        render(<Input fullWidth placeholder="Full width" />);

        const container = screen.getByPlaceholderText('Full width').closest('.blockai-input');
        expect(container).toHaveClass('blockai-input--full-width');
    });

    it('should handle disabled state', () => {
        render(<Input disabled placeholder="Disabled" />);

        const input = screen.getByPlaceholderText('Disabled');
        expect(input).toBeDisabled();

        const container = input.closest('.blockai-input');
        expect(container).toHaveClass('blockai-input--disabled');
    });

    it('should handle value changes', () => {
        const handleChange = vi.fn();
        render(<Input onChange={handleChange} placeholder="Enter text" />);

        const input = screen.getByPlaceholderText('Enter text');
        fireEvent.change(input, { target: { value: 'test value' } });

        expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('should translate label when translateLabel is true', () => {
        render(<Input label="translation.key" translateLabel placeholder="Enter text" />);

        // The mock t function returns the key as-is
        expect(screen.getByText('translation.key')).toBeInTheDocument();
    });

    it('should translate error when translateError is true', () => {
        render(<Input error="translation.error.key" translateError placeholder="Enter text" />);

        expect(screen.getByText('translation.error.key')).toBeInTheDocument();
    });

    it('should translate helper text when translateHelperText is true', () => {
        render(<Input helperText="translation.helper.key" translateHelperText placeholder="Enter text" />);

        expect(screen.getByText('translation.helper.key')).toBeInTheDocument();
    });
});

describe('PasswordInput Component', () => {
    it('should render password input', () => {
        render(<PasswordInput placeholder="Enter password" />);

        const input = screen.getByPlaceholderText('Enter password');
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('type', 'password');
    });

    it('should render with visibility toggle by default', () => {
        render(<PasswordInput placeholder="Enter password" />);

        const toggleIcon = screen.getByLabelText('eye-invisible');
        expect(toggleIcon).toBeInTheDocument();
    });

    it('should disable visibility toggle when visibilityToggle is false', () => {
        render(<PasswordInput visibilityToggle={false} placeholder="Enter password" />);

        const toggleIcon = screen.queryByLabelText('eye-invisible');
        expect(toggleIcon).not.toBeInTheDocument();
    });

    it('should toggle password visibility', () => {
        render(<PasswordInput placeholder="Enter password" />);

        const input = screen.getByPlaceholderText('Enter password');
        const toggleIcon = screen.getByLabelText('eye-invisible');

        // Initially should be password type
        expect(input).toHaveAttribute('type', 'password');

        // Click to show password
        fireEvent.click(toggleIcon);
        expect(input).toHaveAttribute('type', 'text');

        // Verify the toggle functionality works (the icon may change after click)
        expect(input).toBeInTheDocument();
    });

    it('should render with label and error', () => {
        render(
            <PasswordInput
                label="Password"
                error="Password is required"
                placeholder="Enter password"
            />
        );

        expect(screen.getByText('Password')).toBeInTheDocument();
        expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
});
