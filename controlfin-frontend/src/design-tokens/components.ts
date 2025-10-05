/* eslint-disable no-hardcoded-strings/no-hardcoded-strings */
/**
 * Component Design Tokens
 * Based on BlockAI Design System
 *
 * Defines borders, shadows, animations, and other component-specific tokens.
 */

export const components = {
  // === BORDER RADIUS ===
  borderRadius: {
    none: 0,
    xs: 4,
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    full: 9999,
  },

  // === BORDER WIDTH ===
  borderWidth: {
    none: 0,
    thin: 1,
    medium: 2,
    thick: 4,
  },

  // === SHADOWS ===
  shadow: {
    none: 'none',
    sm: '0 1px 4px rgba(0, 0, 0, 0.08)',
    md: '0 2px 8px rgba(0, 0, 0, 0.1)',
    lg: '0 4px 12px rgba(0, 0, 0, 0.15)',
    xl: '0 8px 24px rgba(0, 0, 0, 0.3)',
    // Focus shadows
    focusPrimary: '0 0 0 2px rgba(0, 217, 255, 0.2)',
    focusError: '0 0 0 2px rgba(255, 51, 102, 0.2)',
    focusSuccess: '0 0 0 2px rgba(0, 255, 136, 0.2)',
    // Hover shadows
    hoverButton: '0 4px 12px rgba(0, 102, 204, 0.3)',
    hoverCard: '0 6px 16px rgba(0, 0, 0, 0.2)',
  },

  // === Z-INDEX ===
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    modalBackdrop: 1300,
    modal: 1400,
    popover: 1500,
    tooltip: 1600,
  },

  // === OPACITY ===
  opacity: {
    disabled: 0.5,
    hover: 0.8,
    loading: 0.7,
    overlay: 0.6,
  },

  // === TRANSITIONS ===
  transition: {
    fast: 'all 0.1s cubic-bezier(0.645, 0.045, 0.355, 1)',
    medium: 'all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)',
    slow: 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
    // Easing functions
    easeInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    easeOut: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    easeIn: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
  },

  // === ANIMATION DURATIONS ===
  duration: {
    instant: '0.1s',
    fast: '0.2s',
    normal: '0.3s',
    slow: '0.4s',
    slower: '0.6s',
  },

  // === BREAKPOINTS ===
  breakpoints: {
    xs: 480,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1600,
  },

  // === COMPONENT-SPECIFIC TOKENS ===
  button: {
    height: {
      small: 32,
      medium: 40,
      large: 48,
    },
    minWidth: {
      small: 64,
      medium: 80,
      large: 96,
    },
  },

  input: {
    height: {
      small: 32,
      medium: 40,
      large: 48,
    },
  },

  card: {
    minHeight: 120,
    maxWidth: 600,
  },
} as const;

export type ComponentTokens = typeof components;

export default components;
