/**
 * Complete react-i18next mock for testing
 * 
 * This mock provides all the methods and properties used by components
 * that depend on react-i18next, including the TFunctionBrand property.
 */

import { vi } from 'vitest';

// Create a mock translation function with TFunctionBrand
const createMockTFunction = () => {
    const mockT = (key: string) => key;

    // Add the TFunctionBrand property that TypeScript expects
    Object.defineProperty(mockT, '$TFunctionBrand', {
        value: Symbol('TFunctionBrand'),
        writable: false,
        enumerable: false,
        configurable: false
    });

    return mockT;
};

// Mock useTranslation hook
export const useTranslation = vi.fn(() => ({
    t: createMockTFunction(),
    i18n: {
        changeLanguage: vi.fn(),
        language: 'en',
        languages: ['en', 'pt'],
        isInitialized: true,
        hasResourceBundle: vi.fn(() => true),
        getResourceBundle: vi.fn(() => ({})),
        addResourceBundle: vi.fn(),
        removeResourceBundle: vi.fn(),
        loadNamespaces: vi.fn(),
        loadLanguages: vi.fn(),
        reloadResources: vi.fn(),
        setDefaultNamespace: vi.fn(),
        dir: vi.fn(() => 'ltr'),
        exists: vi.fn(() => true),
        getFixedT: vi.fn(() => createMockTFunction()),
        getDataByLanguage: vi.fn(() => ({})),
        hasLoadedNamespace: vi.fn(() => true),
    },
    ready: true,
}));

// Mock Trans component
export const Trans = vi.fn(({ children, ...props }) => {
    return children || props.i18nKey || 'translation.key';
});

// Mock I18nextProvider
export const I18nextProvider = vi.fn(({ children }) => children);

// Mock initReactI18next
export const initReactI18next = {
    type: '3rdParty',
    init: vi.fn(),
};

// Mock useSSR
export const useSSR = vi.fn(() => ({
    i18n: {},
    ready: true,
}));

// Mock useSuspense
export const useSuspense = vi.fn(() => ({
    t: createMockTFunction(),
    i18n: {},
    ready: true,
}));

// Default export
export default {
    useTranslation,
    Trans,
    I18nextProvider,
    initReactI18next,
    useSSR,
    useSuspense,
};