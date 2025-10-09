/**
 * TEST SETUP - ControlFin Project
 * 
 * This file provides the global test setup for Vitest,
 * including mocks, utilities, and configuration.
 */

import '@testing-library/jest-dom';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
    value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
    },
    writable: true,
});

// Mock sessionStorage
Object.defineProperty(window, 'sessionStorage', {
    value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
    },
    writable: true,
});

// Mock fetch
global.fetch = vi.fn();

// Mock console methods to avoid noise in tests
global.console = {
    ...console,
    log: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
};

// Mock react-i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: {
            changeLanguage: vi.fn(),
            language: 'pt-BR',
        },
    }),
    Trans: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
    ...vi.importActual('react-router-dom'),
    useNavigate: () => vi.fn(),
    useLocation: () => ({
        pathname: '/',
        search: '',
        hash: '',
        state: null,
    }),
    useParams: () => ({}),
}));

// Mock Zustand stores
vi.mock('@/store/authStore', () => ({
    useAuthStore: () => ({
        user: null,
        isAuthenticated: false,
        login: vi.fn(),
        logout: vi.fn(),
        register: vi.fn(),
    }),
}));

vi.mock('@/store/transactionStore', () => ({
    useTransactionStore: () => ({
        transactions: [],
        loading: false,
        fetchTransactions: vi.fn(),
        createTransaction: vi.fn(),
        updateTransaction: vi.fn(),
        deleteTransaction: vi.fn(),
    }),
}));

// Mock API services
vi.mock('@/services/api', () => ({
    apiService: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
    },
}));

// Mock Highcharts
vi.mock('highcharts', () => ({
    chart: vi.fn(),
    seriesTypes: {},
    color: vi.fn(),
}));

// Mock Ant Design Icons
vi.mock('@ant-design/icons', () => ({
    ShoppingCartOutlined: () => 'ShoppingCartOutlined',
    DollarCircleOutlined: () => 'DollarCircleOutlined',
    CarOutlined: () => 'CarOutlined',
    HomeOutlined: () => 'HomeOutlined',
    HeartOutlined: () => 'HeartOutlined',
    BookOutlined: () => 'BookOutlined',
    ShoppingOutlined: () => 'ShoppingOutlined',
    MoreOutlined: () => 'MoreOutlined',
    PlusOutlined: () => 'PlusOutlined',
    EditOutlined: () => 'EditOutlined',
    DeleteOutlined: () => 'DeleteOutlined',
    SearchOutlined: () => 'SearchOutlined',
    FilterOutlined: () => 'FilterOutlined',
    ReloadOutlined: () => 'ReloadOutlined',
    BarChartOutlined: () => 'BarChartOutlined',
    UserOutlined: () => 'UserOutlined',
    LogoutOutlined: () => 'LogoutOutlined',
    SettingOutlined: () => 'SettingOutlined',
    EyeInvisibleOutlined: () => 'EyeInvisibleOutlined',
    EyeOutlined: () => 'EyeOutlined',
}));

// Setup and teardown
beforeAll(() => {
    // Set up any global test configuration
    process.env.NODE_ENV = 'test';
});

afterEach(() => {
    // Clean up after each test
    vi.clearAllMocks();
});

afterAll(() => {
    // Clean up after all tests
    vi.restoreAllMocks();
});

// Custom matchers for BlockAI theme testing
expect.extend({
    toHaveBlockAIColors(received: HTMLElement) {
        const computedStyle = window.getComputedStyle(received);
        const hasBlockAIBackground =
            computedStyle.backgroundColor.includes('54, 61, 101') || // #363d65
            computedStyle.backgroundColor.includes('45, 52, 112') || // #2d3561
            computedStyle.backgroundColor.includes('31, 35, 71');   // #1f2347

        return {
            pass: hasBlockAIBackground,
            message: () =>
                `Expected element to have BlockAI background colors, but got ${computedStyle.backgroundColor}`,
        };
    },

    toHaveBlockAITypography(received: HTMLElement) {
        const computedStyle = window.getComputedStyle(received);
        const hasInterFont = computedStyle.fontFamily.includes('Inter');
        const hasBlockAITextColor =
            computedStyle.color.includes('255, 255, 255') ||      // #ffffff
            computedStyle.color.includes('160, 164, 184');       // #a0a4b8

        return {
            pass: hasInterFont && hasBlockAITextColor,
            message: () =>
                `Expected element to have BlockAI typography (Inter font and BlockAI text colors), but got font: ${computedStyle.fontFamily}, color: ${computedStyle.color}`,
        };
    },
});

// Declare custom matchers for TypeScript
declare global {
    namespace jest {
        interface Matchers<R> {
            toHaveBlockAIColors(): R;
            toHaveBlockAITypography(): R;
        }
    }
}
