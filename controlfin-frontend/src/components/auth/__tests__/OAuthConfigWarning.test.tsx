/**
 * OAuthConfigWarning Component Tests
 * 
 * Comprehensive test suite for the OAuthConfigWarning component following
 * the established testing patterns and BlockAI design system.
 */

import { fireEvent, render, screen } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import OAuthConfigWarning from '../OAuthConfigWarning';

// Mock window.open
const mockWindowOpen = vi.fn();
Object.defineProperty(window, 'open', {
    value: mockWindowOpen,
    writable: true,
});

// Mock window.location
const mockLocation = {
    reload: vi.fn(),
};
Object.defineProperty(window, 'location', {
    value: mockLocation,
    writable: true,
});

// Test wrapper with theme and router
const renderWithTheme = (component: React.ReactElement) => {
    return render(
        <ConfigProvider>
            <BrowserRouter>
                {component}
            </BrowserRouter>
        </ConfigProvider>
    );
};

describe('OAuthConfigWarning Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockWindowOpen.mockClear();
        mockLocation.reload.mockClear();
    });

    // BASIC RENDERING TESTS
    describe('Basic Rendering', () => {
        it('should render with default props', () => {
            renderWithTheme(<OAuthConfigWarning />);

            expect(screen.getByText('Google OAuth não configurado')).toBeInTheDocument();
            expect(screen.getByText('Para usar o login com Google, você precisa configurar um Client ID.')).toBeInTheDocument();
        });

        it('should render with custom className', () => {
            renderWithTheme(<OAuthConfigWarning className="custom-warning" />);

            const card = screen.getByText('Google OAuth não configurado').closest('.oauth-config-warning');
            expect(card).toHaveClass('custom-warning');
        });

        it('should render warning alert', () => {
            renderWithTheme(<OAuthConfigWarning />);

            const alert = screen.getByRole('alert');
            expect(alert).toBeInTheDocument();
            expect(alert).toHaveTextContent('Google OAuth não configurado');
        });

        it('should render configuration instructions', () => {
            renderWithTheme(<OAuthConfigWarning />);

            expect(screen.getByText('Como configurar:')).toBeInTheDocument();
            expect(screen.getByText('Acesse o')).toBeInTheDocument();
            expect(screen.getByText('Google Cloud Console')).toBeInTheDocument();
        });

        it('should render action buttons', () => {
            renderWithTheme(<OAuthConfigWarning />);

            expect(screen.getByText('Abrir Google Cloud Console')).toBeInTheDocument();
            expect(screen.getByText('Recarregar após configurar')).toBeInTheDocument();
        });

        it('should render helpful tip', () => {
            renderWithTheme(<OAuthConfigWarning />);

            // Check for tip content (using getAllByText for multiple matches)
            const dicaElements = screen.getAllByText('Dica:');
            expect(dicaElements.length).toBeGreaterThan(0);
            expect(dicaElements[0]).toBeInTheDocument();

            const copyFileElements = screen.getAllByText((content, element) => {
                return element?.textContent?.includes('Você pode copiar o arquivo') ?? false;
            });
            expect(copyFileElements.length).toBeGreaterThan(0);
            expect(copyFileElements[0]).toBeInTheDocument();

            expect(screen.getByText('env.example')).toBeInTheDocument();
        });
    });

    // CONFIGURATION INSTRUCTIONS TESTS
    describe('Configuration Instructions', () => {
        it('should display all configuration steps', () => {
            renderWithTheme(<OAuthConfigWarning />);

            // Check for all configuration steps (using partial text matching for broken text)
            expect(screen.getByText('Crie um novo projeto ou selecione um existente')).toBeInTheDocument();
            expect(screen.getByText('Ative a')).toBeInTheDocument();
            expect(screen.getByText('Google+ API')).toBeInTheDocument();
            // Check for "Vá em" text (using getAllByText for multiple matches)
            const vaEmElements = screen.getAllByText((content, element) => {
                return element?.textContent?.includes('Vá em') ?? false;
            });
            expect(vaEmElements.length).toBeGreaterThan(0);
            expect(vaEmElements[0]).toBeInTheDocument();
            expect(screen.getByText('Credenciais')).toBeInTheDocument();
            expect(screen.getByText('Criar credenciais')).toBeInTheDocument();
            expect(screen.getByText('ID do cliente OAuth 2.0')).toBeInTheDocument();
            expect(screen.getByText('Configure as URIs de redirecionamento:')).toBeInTheDocument();
            expect(screen.getByText('http://localhost:5173/auth/callback')).toBeInTheDocument();
            const copyClientIdElements = screen.getAllByText((content, element) => {
                return element?.textContent?.includes('Copie o Client ID e configure a variável') ?? false;
            });
            expect(copyClientIdElements.length).toBeGreaterThan(0);
            expect(copyClientIdElements[0]).toBeInTheDocument();
            expect(screen.getByText('VITE_GOOGLE_CLIENT_ID')).toBeInTheDocument();
            const noArquivoElements = screen.getAllByText((content, element) => {
                return element?.textContent?.includes('no arquivo') ?? false;
            });
            expect(noArquivoElements.length).toBeGreaterThan(0);
            expect(noArquivoElements[0]).toBeInTheDocument();

            // Check .env elements (there are multiple, so use getAllByText)
            const envElements = screen.getAllByText('.env');
            expect(envElements).toHaveLength(2);
            expect(envElements[0]).toBeInTheDocument();
            expect(envElements[1]).toBeInTheDocument();
        });

        it('should display code elements properly', () => {
            renderWithTheme(<OAuthConfigWarning />);

            // Check for code elements
            const codeElements = screen.getAllByText(/Google Cloud Console|Google\+ API|Credenciais|Criar credenciais|ID do cliente OAuth 2\.0|http:\/\/localhost:5173\/auth\/callback|VITE_GOOGLE_CLIENT_ID|\.env|env\.example/);
            expect(codeElements.length).toBeGreaterThan(0);
        });
    });

    // USER INTERACTIONS TESTS
    describe('User Interactions', () => {
        it('should handle configure button click with callback', () => {
            const mockOnConfigure = vi.fn();
            renderWithTheme(<OAuthConfigWarning onConfigure={mockOnConfigure} />);

            const configureButton = screen.getByText('Abrir Google Cloud Console');
            fireEvent.click(configureButton);

            expect(mockOnConfigure).toHaveBeenCalled();
        });

        it('should handle configure button click without callback', () => {
            renderWithTheme(<OAuthConfigWarning />);

            const configureButton = screen.getByText('Abrir Google Cloud Console');
            fireEvent.click(configureButton);

            expect(mockWindowOpen).toHaveBeenCalledWith(
                'https://console.cloud.google.com/',
                '_blank',
                'noopener,noreferrer'
            );
        });

        it('should handle reload button click', () => {
            renderWithTheme(<OAuthConfigWarning />);

            const reloadButton = screen.getByText('Recarregar após configurar');
            fireEvent.click(reloadButton);

            expect(mockLocation.reload).toHaveBeenCalled();
        });

        it('should handle multiple button clicks', () => {
            const mockOnConfigure = vi.fn();
            renderWithTheme(<OAuthConfigWarning onConfigure={mockOnConfigure} />);

            const configureButton = screen.getByText('Abrir Google Cloud Console');
            const reloadButton = screen.getByText('Recarregar após configurar');

            fireEvent.click(configureButton);
            fireEvent.click(reloadButton);

            expect(mockOnConfigure).toHaveBeenCalledTimes(1);
            expect(mockLocation.reload).toHaveBeenCalledTimes(1);
        });
    });

    // ACCESSIBILITY TESTS
    describe('Accessibility', () => {
        it('should have proper alert role', () => {
            renderWithTheme(<OAuthConfigWarning />);

            const alert = screen.getByRole('alert');
            expect(alert).toBeInTheDocument();
        });

        it('should have accessible buttons', () => {
            renderWithTheme(<OAuthConfigWarning />);

            const buttons = screen.getAllByRole('button');
            expect(buttons).toHaveLength(2);

            buttons.forEach(button => {
                expect(button).toBeInTheDocument();
            });
        });

        it('should have proper heading structure', () => {
            renderWithTheme(<OAuthConfigWarning />);

            const heading = screen.getByRole('heading', { level: 4 });
            expect(heading).toHaveTextContent('Como configurar:');
        });

        it('should have proper list structure', () => {
            renderWithTheme(<OAuthConfigWarning />);

            const list = screen.getByRole('list');
            expect(list).toBeInTheDocument();

            const listItems = screen.getAllByRole('listitem');
            expect(listItems).toHaveLength(6);
        });
    });

    // STYLING TESTS
    describe('Styling', () => {
        it('should apply default className', () => {
            renderWithTheme(<OAuthConfigWarning />);

            const card = screen.getByText('Google OAuth não configurado').closest('.oauth-config-warning');
            expect(card).toHaveClass('oauth-config-warning');
        });

        it('should apply custom className', () => {
            renderWithTheme(<OAuthConfigWarning className="custom-class" />);

            const card = screen.getByText('Google OAuth não configurado').closest('.oauth-config-warning');
            expect(card).toHaveClass('custom-class');
        });

        it('should render with proper card structure', () => {
            renderWithTheme(<OAuthConfigWarning />);

            const card = screen.getByText('Google OAuth não configurado').closest('.ant-card');
            expect(card).toBeInTheDocument();
        });
    });

    // EDGE CASES TESTS
    describe('Edge Cases', () => {
        it('should handle undefined onConfigure callback', () => {
            renderWithTheme(<OAuthConfigWarning onConfigure={undefined} />);

            const configureButton = screen.getByText('Abrir Google Cloud Console');
            fireEvent.click(configureButton);

            expect(mockWindowOpen).toHaveBeenCalledWith(
                'https://console.cloud.google.com/',
                '_blank',
                'noopener,noreferrer'
            );
        });

        it('should handle empty className', () => {
            renderWithTheme(<OAuthConfigWarning className="" />);

            const card = screen.getByText('Google OAuth não configurado').closest('.oauth-config-warning');
            expect(card).toHaveClass('oauth-config-warning');
        });

        it('should handle rapid button clicks', () => {
            const mockOnConfigure = vi.fn();
            renderWithTheme(<OAuthConfigWarning onConfigure={mockOnConfigure} />);

            const configureButton = screen.getByText('Abrir Google Cloud Console');

            fireEvent.click(configureButton);
            fireEvent.click(configureButton);
            fireEvent.click(configureButton);

            expect(mockOnConfigure).toHaveBeenCalledTimes(3);
        });

        it('should render without crashing with all props', () => {
            const mockOnConfigure = vi.fn();
            renderWithTheme(<OAuthConfigWarning onConfigure={mockOnConfigure} className="test-class" />);

            expect(screen.getByText('Google OAuth não configurado')).toBeInTheDocument();
        });
    });

    // CONTENT VERIFICATION TESTS
    describe('Content Verification', () => {
        it('should contain all required text content', () => {
            renderWithTheme(<OAuthConfigWarning />);

            // Check main alert content
            expect(screen.getByText('Google OAuth não configurado')).toBeInTheDocument();
            expect(screen.getByText('Para usar o login com Google, você precisa configurar um Client ID.')).toBeInTheDocument();

            // Check heading
            expect(screen.getByText('Como configurar:')).toBeInTheDocument();

            // Check button texts
            expect(screen.getByText('Abrir Google Cloud Console')).toBeInTheDocument();
            expect(screen.getByText('Recarregar após configurar')).toBeInTheDocument();

            // Check tip section (using getAllByText for multiple matches)
            const dicaElements = screen.getAllByText('Dica:');
            expect(dicaElements.length).toBeGreaterThan(0);
            expect(dicaElements[0]).toBeInTheDocument();

            // Check for partial text content in tip section (using getAllByText for multiple matches)
            const copyFileElements = screen.getAllByText((content, element) => {
                return element?.textContent?.includes('Você pode copiar o arquivo') ?? false;
            });
            expect(copyFileElements.length).toBeGreaterThan(0);
            expect(copyFileElements[0]).toBeInTheDocument();

            const configureElements = screen.getAllByText((content, element) => {
                return element?.textContent?.includes('e configurar suas credenciais') ?? false;
            });
            expect(configureElements.length).toBeGreaterThan(0);
            expect(configureElements[0]).toBeInTheDocument();
        });

        it('should contain all required code elements', () => {
            renderWithTheme(<OAuthConfigWarning />);

            // Check code elements that appear only once
            expect(screen.getByText('Google Cloud Console')).toBeInTheDocument();
            expect(screen.getByText('Google+ API')).toBeInTheDocument();
            expect(screen.getByText('Credenciais')).toBeInTheDocument();
            expect(screen.getByText('Criar credenciais')).toBeInTheDocument();
            expect(screen.getByText('ID do cliente OAuth 2.0')).toBeInTheDocument();
            expect(screen.getByText('http://localhost:5173/auth/callback')).toBeInTheDocument();
            expect(screen.getByText('VITE_GOOGLE_CLIENT_ID')).toBeInTheDocument();
            expect(screen.getByText('env.example')).toBeInTheDocument();

            // Check .env elements (there are multiple, so use getAllByText)
            const envElements = screen.getAllByText('.env');
            expect(envElements).toHaveLength(2);
            expect(envElements[0]).toBeInTheDocument();
            expect(envElements[1]).toBeInTheDocument();
        });
    });
});
