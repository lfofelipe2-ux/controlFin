import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../Button';

// Mock react-i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe('Button Component', () => {
    it('should render with default props', () => {
        render(<Button>Test Button</Button>);

        const button = screen.getByRole('button', { name: 'Test Button' });
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('base-button', 'base-button--primary', 'base-button--medium');
    });

    it('should render with different variants', () => {
        const { rerender } = render(<Button variant="secondary">Secondary</Button>);
        expect(screen.getByRole('button')).toHaveClass('base-button--secondary');

        rerender(<Button variant="danger">Danger</Button>);
        expect(screen.getByRole('button')).toHaveClass('base-button--danger');

        rerender(<Button variant="ghost">Ghost</Button>);
        expect(screen.getByRole('button')).toHaveClass('base-button--ghost');
    });

    it('should render with different sizes', () => {
        const { rerender } = render(<Button size="small">Small</Button>);
        expect(screen.getByRole('button')).toHaveClass('base-button--small');

        rerender(<Button size="large">Large</Button>);
        expect(screen.getByRole('button')).toHaveClass('base-button--large');

        rerender(<Button size="medium">Medium</Button>);
        expect(screen.getByRole('button')).toHaveClass('base-button--medium');
    });

    it('should handle click events', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Clickable</Button>);

        fireEvent.click(screen.getByRole('button'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should be disabled when disabled prop is true', () => {
        render(<Button disabled>Disabled</Button>);

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    it('should show loading state', () => {
        render(<Button loading>Loading</Button>);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('ant-btn-loading');
    });

    it('should render with full width when fullWidth is true', () => {
        render(<Button fullWidth>Full Width</Button>);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('base-button--full-width');
    });

    it('should render with start and end icons', () => {
        const StartIcon = () => <span data-testid="start-icon">Start</span>;
        const EndIcon = () => <span data-testid="end-icon">End</span>;

        render(
            <Button startIcon={<StartIcon />} endIcon={<EndIcon />}>
                With Icons
            </Button>
        );

        expect(screen.getByTestId('start-icon')).toBeInTheDocument();
        expect(screen.getByTestId('end-icon')).toBeInTheDocument();
        expect(screen.getByText('With Icons')).toBeInTheDocument();
    });

    it('should translate content when translateContent is true', () => {
        render(<Button translateContent>translation.key</Button>);

        // The mock t function returns the key as-is
        expect(screen.getByText('translation.key')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
        render(<Button className="custom-class">Custom</Button>);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('custom-class');
    });

    it('should apply custom style', () => {
        const customStyle = { backgroundColor: 'red' };
        render(<Button style={customStyle}>Styled</Button>);

        const button = screen.getByRole('button');
        expect(button).toHaveStyle('background-color: rgb(255, 0, 0)');
    });

    it('should pass through additional props to Ant Design Button', () => {
        render(<Button data-testid="custom-button" aria-label="Custom label">Test</Button>);

        const button = screen.getByTestId('custom-button');
        expect(button).toHaveAttribute('aria-label', 'Custom label');
    });
});
