import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

// Import translation files
import enAuth from '../locales/en/auth.json';
import enCommon from '../locales/en/common.json';
import ptAuth from '../locales/pt/auth.json';
import ptCommon from '../locales/pt/common.json';

// Define resources with proper TypeScript typing
const resources = {
  en: {
    auth: enAuth,
    common: enCommon,
  },
  pt: {
    auth: ptAuth,
    common: ptCommon,
  },
} as const;

i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'auth'],

    // Language detection options
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    react: {
      useSuspense: false, // Disable suspense for now
    },
  });

export default i18n;
