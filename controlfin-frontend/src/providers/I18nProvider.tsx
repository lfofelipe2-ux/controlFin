/**
 * I18nProvider Component
 *
 * Provides internationalization (i18n) support to the entire application.
 * This component initializes i18next and makes translations available to all child components.
 */

import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../config/i18n';

interface I18nProviderProps {
  children: React.ReactNode;
}

/**
 * I18nProvider wraps the application with i18next context
 */
export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [isI18nInitialized, setIsI18nInitialized] = useState(false);

  useEffect(() => {
    // Ensure i18n is initialized before rendering children
    if (i18n.isInitialized) {
      setIsI18nInitialized(true);
    } else {
      i18n.on('initialized', () => {
        setIsI18nInitialized(true);
      });
    }

    return () => {
      i18n.off('initialized');
    };
  }, []);

  // Show a minimal loader while i18n initializes
  if (!isI18nInitialized) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '16px',
          color: '#666',
        }}
      >Loading...</div>
    );
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default I18nProvider;
