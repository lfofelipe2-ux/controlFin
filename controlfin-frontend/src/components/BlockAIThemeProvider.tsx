import React from 'react';
import { ConfigProvider } from 'antd';
import { useBlockAITheme } from '../hooks/useBlockAITheme';

interface BlockAIThemeProviderProps {
  children: React.ReactNode;
}

/**
 * BlockAI Theme Provider Component
 *
 * This component wraps the application with the BlockAI design system theme
 * and provides theme context to all child components.
 *
 * Features:
 * - Applies BlockAI color palette
 * - Configures Ant Design components with BlockAI styling
 * - Provides responsive design utilities
 * - Enables dark mode algorithm for better contrast
 */
export const BlockAIThemeProvider: React.FC<BlockAIThemeProviderProps> = ({ children }) => {
  const { themeConfig } = useBlockAITheme();

  return <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>;
};

export default BlockAIThemeProvider;
