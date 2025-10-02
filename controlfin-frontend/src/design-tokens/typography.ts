/**
 * Typography Design Tokens
 * Based on BlockAI Design System
 *
 * Defines font families, sizes, weights, and line heights for consistent typography.
 */

export const typography = {
  // === FONT FAMILIES ===
  fontFamily: {
    primary: 'Inter, Poppins, Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },

  // === FONT SIZES ===
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 36,
    '6xl': 48,
  },

  // === FONT WEIGHTS ===
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // === LINE HEIGHTS ===
  lineHeight: {
    none: 1,
    tight: 1.2,
    snug: 1.3,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  // === HEADING STYLES ===
  heading: {
    h1: {
      fontSize: 32,
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: 28,
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: 24,
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: 20,
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: 18,
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: 16,
      fontWeight: 600,
      lineHeight: 1.5,
    },
  },

  // === BODY TEXT STYLES ===
  body: {
    large: {
      fontSize: 18,
      fontWeight: 400,
      lineHeight: 1.5,
    },
    medium: {
      fontSize: 16,
      fontWeight: 400,
      lineHeight: 1.5,
    },
    small: {
      fontSize: 14,
      fontWeight: 400,
      lineHeight: 1.5,
    },
    tiny: {
      fontSize: 12,
      fontWeight: 400,
      lineHeight: 1.5,
    },
  },

  // === CAPTION STYLES ===
  caption: {
    fontSize: 12,
    fontWeight: 400,
    lineHeight: 1.5,
  },

  // === BUTTON TEXT STYLES ===
  button: {
    large: {
      fontSize: 18,
      fontWeight: 500,
      lineHeight: 1.5,
    },
    medium: {
      fontSize: 16,
      fontWeight: 500,
      lineHeight: 1.5,
    },
    small: {
      fontSize: 14,
      fontWeight: 500,
      lineHeight: 1.5,
    },
  },
} as const;

export type TypographyTokens = typeof typography;

export default typography;
