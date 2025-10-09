/**
 * TEST UTILITIES - ControlFin Project
 * 
 * This file provides reusable testing utilities and helpers
 * following the ControlFin testing patterns and BlockAI theme.
 */

import { render, RenderOptions } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';

// BlockAI Theme Configuration for Tests
export const testTheme = {
    token: {
        // BlockAI Colors
        colorPrimary: '#00d9ff',
        colorSuccess: '#00ff88',
        colorWarning: '#ffaa00',
        colorError: '#ff3366',
        colorInfo: '#2196f3',

        // BlockAI Backgrounds
        colorBgContainer: '#363d65',
        colorBgElevated: '#363d65',
        colorBgLayout: '#2d3561',
        colorBgSpotlight: '#3d4570',

        // BlockAI Text Colors
        colorText: '#ffffff',
        colorTextSecondary: '#a0a4b8',
        colorTextDisabled: '#6b7280',

        // BlockAI Borders
        colorBorder: 'rgba(255, 255, 255, 0.08)',
        colorBorderSecondary: 'rgba(255, 255, 255, 0.05)',

        // BlockAI Typography
        fontFamily: "'Inter', 'Poppins', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontSize: 14,
        fontSizeHeading1: 32,
        fontSizeHeading2: 24,
        fontSizeHeading3: 20,

        // BlockAI Spacing
        borderRadius: 8,
        controlHeight: 40,

        // BlockAI Effects
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        boxShadowSecondary: '0 4px 16px rgba(0, 0, 0, 0.25)',
    },
    components: {
        Button: {
            algorithm: true,
            primaryShadow: '0 0 20px rgba(0, 217, 255, 0.3)',
            colorPrimaryHover: '#33e0ff',
            fontWeight: 600,
        },
        Input: {
            colorBgContainer: '#363d65',
            activeBorderColor: '#00d9ff',
            activeShadow: '0 0 0 2px rgba(0, 217, 255, 0.2)',
        },
        Table: {
            colorBgContainer: '#363d65',
            colorBorderSecondary: 'rgba(255, 255, 255, 0.05)',
            headerBg: '#2d3561',
            headerColor: '#ffffff',
            rowHoverBg: '#3d4570',
        },
        Card: {
            colorBgContainer: '#363d65',
            boxShadowTertiary: '0 2px 8px rgba(0, 0, 0, 0.15)',
        },
        Menu: {
            darkItemBg: '#1f2347',
            darkItemSelectedBg: '#363d65',
            darkItemHoverBg: '#2a2f52',
            darkItemColor: '#a0a4b8',
            darkItemSelectedColor: '#00d9ff',
        },
        Modal: {
            contentBg: '#363d65',
            headerBg: '#2d3561',
        },
        Select: {
            colorBgContainer: '#363d65',
            colorBgElevated: '#2d3561',
            optionSelectedBg: '#3d4570',
        },
        Pagination: {
            colorPrimary: '#00d9ff',
            colorPrimaryHover: '#33e0ff',
        },
    },
    algorithm: 'darkAlgorithm' as any,
};

// Test Wrapper Component
interface TestWrapperProps {
    children: React.ReactNode;
    withRouter?: boolean;
}

export const TestWrapper: React.FC<TestWrapperProps> = ({
    children,
    withRouter = false
}) => {
    const content = (
        <ConfigProvider theme={testTheme}>
            {children}
        </ConfigProvider>
    );

    if (withRouter) {
        return <BrowserRouter>{content}</BrowserRouter>;
    }

    return content;
};

// Custom Render Function
export const renderWithTheme = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>
) => {
    return render(ui, {
        wrapper: ({ children }) => <TestWrapper>{children}</TestWrapper>,
        ...options,
    });
};

// Custom Render Function with Router
export const renderWithThemeAndRouter = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>
) => {
    return render(ui, {
        wrapper: ({ children }) => (
            <TestWrapper withRouter>{children}</TestWrapper>
        ),
        ...options,
    });
};

// Test Data Factories
export const createTestUser = (overrides: Partial<any> = {}) => ({
    id: '123',
    email: 'test@controlfin.com',
    name: 'Test User',
    avatar: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
});

export const createTestTransaction = (overrides: Partial<any> = {}) => ({
    id: '123',
    spaceId: '456',
    userId: '789',
    type: 'expense',
    amount: 15050, // In cents (R$ 150.50)
    categoryId: 'cat-1',
    description: 'Test Transaction',
    date: new Date().toISOString(),
    paymentMethod: 'credit_card',
    creditCardId: null,
    status: 'completed',
    isRecurring: false,
    recurringConfig: null,
    attachments: [],
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDeleted: false,
    ...overrides,
});

export const createTestCategory = (overrides: Partial<any> = {}) => ({
    id: 'cat-1',
    name: 'Food',
    icon: 'ShoppingCartOutlined',
    color: '#00d9ff',
    type: 'expense',
    isDefault: true,
    spaceId: null,
    createdAt: new Date().toISOString(),
    ...overrides,
});

export const createTestSpace = (overrides: Partial<any> = {}) => ({
    id: '456',
    name: 'Test Financial Space',
    members: [
        {
            userId: '789',
            role: 'owner',
            joinedAt: new Date().toISOString(),
        },
    ],
    invitations: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
});

export const createTestBudget = (overrides: Partial<any> = {}) => ({
    id: 'budget-1',
    spaceId: '456',
    name: 'Monthly Budget',
    type: 'general',
    categoryId: null,
    amount: 500000, // R$ 5,000.00 in cents
    period: 'monthly',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
    ...overrides,
});

export const createTestGoal = (overrides: Partial<any> = {}) => ({
    id: 'goal-1',
    spaceId: '456',
    name: 'Emergency Fund',
    description: 'Build emergency fund',
    targetAmount: 1000000, // R$ 10,000.00 in cents
    currentAmount: 250000, // R$ 2,500.00 in cents
    targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    contributions: [
        {
            amount: 250000,
            date: new Date().toISOString(),
            userId: '789',
        },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: null,
    status: 'active',
    ...overrides,
});

// Mock API Responses
export const mockApiResponses = {
    success: (data: any) => ({
        status: 200,
        data,
    }),

    created: (data: any) => ({
        status: 201,
        data,
    }),

    validationError: (errors: string[]) => ({
        status: 400,
        data: {
            message: 'Validation failed',
            errors,
        },
    }),

    unauthorized: () => ({
        status: 401,
        data: {
            message: 'Unauthorized',
        },
    }),

    forbidden: () => ({
        status: 403,
        data: {
            message: 'Forbidden',
        },
    }),

    notFound: () => ({
        status: 404,
        data: {
            message: 'Not found',
        },
    }),

    conflict: () => ({
        status: 409,
        data: {
            message: 'Conflict',
        },
    }),

    serverError: () => ({
        status: 500,
        data: {
            message: 'Internal server error',
        },
    }),
};

// Mock Functions
export const createMockApiService = () => ({
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
});

export const createMockStore = (initialState: any = {}) => ({
    ...initialState,
    setState: vi.fn(),
    getState: vi.fn(() => initialState),
    subscribe: vi.fn(),
    destroy: vi.fn(),
});

// Test Helpers
export const waitForElementToBeRemoved = async (element: HTMLElement) => {
    await waitFor(() => {
        expect(element).not.toBeInTheDocument();
    });
};

export const expectElementToHaveBlockAIColors = (element: HTMLElement) => {
    const computedStyle = window.getComputedStyle(element);

    // Check for BlockAI background colors
    const hasBlockAIBackground =
        computedStyle.backgroundColor.includes('54, 61, 101') || // #363d65
        computedStyle.backgroundColor.includes('45, 52, 112') || // #2d3561
        computedStyle.backgroundColor.includes('31, 35, 71');   // #1f2347

    expect(hasBlockAIBackground).toBe(true);
};

export const expectElementToHaveBlockAITypography = (element: HTMLElement) => {
    const computedStyle = window.getComputedStyle(element);

    // Check for BlockAI font family
    expect(computedStyle.fontFamily).toContain('Inter');

    // Check for BlockAI text colors
    const hasBlockAITextColor =
        computedStyle.color.includes('255, 255, 255') ||      // #ffffff
        computedStyle.color.includes('160, 164, 184');       // #a0a4b8

    expect(hasBlockAITextColor).toBe(true);
};

// Form Testing Helpers
export const fillFormField = async (
    fieldName: string,
    value: string
) => {
    const field = screen.getByTestId(`${fieldName}-input`);
    fireEvent.change(field, { target: { value } });
    return field;
};

export const submitForm = async (formTestId: string = 'form') => {
    const form = screen.getByTestId(formTestId);
    fireEvent.submit(form);
};

export const expectFormFieldToHaveError = (
    fieldName: string,
    errorMessage: string
) => {
    const errorElement = screen.getByTestId(`${fieldName}-error`);
    expect(errorElement).toHaveTextContent(errorMessage);
};

// Accessibility Testing Helpers
export const expectElementToBeAccessible = (element: HTMLElement) => {
    // Check for required accessibility attributes
    expect(element).toHaveAttribute('role');
    expect(element).toHaveAttribute('aria-label');
};

export const expectElementToSupportKeyboardNavigation = (element: HTMLElement) => {
    // Check if element can receive focus
    element.focus();
    expect(element).toHaveFocus();

    // Check for keyboard event handlers
    fireEvent.keyDown(element, { key: 'Enter' });
    // Add specific assertions based on expected behavior
};

// Performance Testing Helpers
export const measureRenderTime = async (renderFunction: () => void) => {
    const startTime = performance.now();
    renderFunction();
    const endTime = performance.now();
    return endTime - startTime;
};

export const expectRenderTimeToBeAcceptable = (renderTime: number, maxTime: number = 100) => {
    expect(renderTime).toBeLessThan(maxTime);
};

// Error Testing Helpers
export const expectErrorToBeLogged = (errorMessage: string) => {
    expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining(errorMessage)
    );
};

export const expectErrorToBeDisplayed = (errorMessage: string) => {
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
};

// Currency Testing Helpers
export const formatCurrencyForTest = (amountInCents: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(amountInCents / 100);
};

export const parseCurrencyForTest = (currencyString: string) => {
    // Remove currency symbols and parse to cents
    const numericValue = currencyString.replace(/[^\d,.-]/g, '');
    const amount = parseFloat(numericValue.replace(',', '.'));
    return Math.round(amount * 100);
};

// Date Testing Helpers
export const createTestDate = (daysFromNow: number = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString();
};

export const formatDateForTest = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
};

// Export all utilities
export default {
    testTheme,
    TestWrapper,
    renderWithTheme,
    renderWithThemeAndRouter,
    createTestUser,
    createTestTransaction,
    createTestCategory,
    createTestSpace,
    createTestBudget,
    createTestGoal,
    mockApiResponses,
    createMockApiService,
    createMockStore,
    waitForElementToBeRemoved,
    expectElementToHaveBlockAIColors,
    expectElementToHaveBlockAITypography,
    fillFormField,
    submitForm,
    expectFormFieldToHaveError,
    expectElementToBeAccessible,
    expectElementToSupportKeyboardNavigation,
    measureRenderTime,
    expectRenderTimeToBeAcceptable,
    expectErrorToBeLogged,
    expectErrorToBeDisplayed,
    formatCurrencyForTest,
    parseCurrencyForTest,
    createTestDate,
    formatDateForTest,
};
