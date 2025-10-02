import { useMemo } from 'react';
import { theme } from 'antd';
import blockAITheme from '../themes/blockAITheme';
import { blockAIDesignSystem, type BlockAIDesignSystem } from '../types/theme';

/**
 * Custom hook for BlockAI theme management
 *
 * This hook provides access to the BlockAI design system and theme configuration
 * with proper TypeScript support and theme switching capabilities.
 */
export const useBlockAITheme = () => {
  const themeConfig = useMemo(() => {
    return {
      ...blockAITheme,
      algorithm: theme.darkAlgorithm, // Use dark algorithm for BlockAI
    };
  }, []);

  const designSystem: BlockAIDesignSystem = useMemo(() => {
    return blockAIDesignSystem;
  }, []);

  const colors = useMemo(() => designSystem.colors, [designSystem]);
  const typography = useMemo(() => designSystem.typography, [designSystem]);
  const spacing = useMemo(() => designSystem.spacing, [designSystem]);
  const breakpoints = useMemo(() => designSystem.breakpoints, [designSystem]);
  const components = useMemo(() => designSystem.components, [designSystem]);

  return {
    themeConfig,
    designSystem,
    colors,
    typography,
    spacing,
    breakpoints,
    components,
  };
};

/**
 * Hook for responsive design utilities
 *
 * Provides responsive breakpoint utilities and media queries
 * based on the BlockAI design system breakpoints.
 */
export const useBlockAIResponsive = () => {
  const { breakpoints } = useBlockAITheme();

  const mediaQueries = useMemo(() => {
    return {
      xs: `(max-width: ${breakpoints.sm})`,
      sm: `(min-width: ${breakpoints.sm}) and (max-width: ${breakpoints.md})`,
      md: `(min-width: ${breakpoints.md}) and (max-width: ${breakpoints.lg})`,
      lg: `(min-width: ${breakpoints.lg}) and (max-width: ${breakpoints.xl})`,
      xl: `(min-width: ${breakpoints.xl}) and (max-width: ${breakpoints.xxl})`,
      xxl: `(min-width: ${breakpoints.xxl})`,

      // Mobile first queries
      mobile: `(max-width: ${breakpoints.md})`,
      tablet: `(min-width: ${breakpoints.md}) and (max-width: ${breakpoints.lg})`,
      desktop: `(min-width: ${breakpoints.lg})`,
    };
  }, [breakpoints]);

  const isMobile = useMemo(() => {
    return typeof window !== 'undefined' && window.matchMedia(mediaQueries.mobile).matches;
  }, [mediaQueries.mobile]);

  const isTablet = useMemo(() => {
    return typeof window !== 'undefined' && window.matchMedia(mediaQueries.tablet).matches;
  }, [mediaQueries.tablet]);

  const isDesktop = useMemo(() => {
    return typeof window !== 'undefined' && window.matchMedia(mediaQueries.desktop).matches;
  }, [mediaQueries.desktop]);

  return {
    breakpoints,
    mediaQueries,
    isMobile,
    isTablet,
    isDesktop,
  };
};

/**
 * Hook for BlockAI color utilities
 *
 * Provides color manipulation utilities and theme-aware color functions
 * based on the BlockAI design system.
 */
export const useBlockAIColors = () => {
  const { colors } = useBlockAITheme();

  const colorUtils = useMemo(() => {
    return {
      // Get color with opacity
      withOpacity: (color: string, opacity: number) => {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      },

      // Get hover color (slightly lighter)
      getHoverColor: (color: string) => {
        const hex = color.replace('#', '');
        const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + 20);
        const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + 20);
        const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + 20);
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      },

      // Get active color (slightly darker)
      getActiveColor: (color: string) => {
        const hex = color.replace('#', '');
        const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - 20);
        const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - 20);
        const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - 20);
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      },
    };
  }, []);

  return {
    colors,
    colorUtils,
  };
};

export default useBlockAITheme;
