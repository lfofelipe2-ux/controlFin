/**
 * Spacing Design Tokens
 * Based on BlockAI Design System
 *
 * Uses 8px base unit grid system for consistent spacing throughout the application.
 */

export const spacing = {
  // === BASE UNITS (8px grid) ===
  unit: 8,

  // === SPACING SCALE ===
  none: 0,
  xxs: 4, // 0.5 units
  xs: 8, // 1 unit
  sm: 12, // 1.5 units
  md: 16, // 2 units
  lg: 24, // 3 units
  xl: 32, // 4 units
  xxl: 48, // 6 units
  xxxl: 64, // 8 units

  // === COMPONENT-SPECIFIC SPACING ===
  button: {
    padding: {
      horizontal: 24,
      vertical: 12,
    },
    gap: 8,
  },

  input: {
    padding: {
      inline: 16,
      block: 12,
    },
  },

  card: {
    padding: 16,
    paddingLarge: 24,
    gap: 16,
  },

  form: {
    fieldGap: 16,
    labelGap: 8,
    sectionGap: 32,
  },

  layout: {
    sidebarWidth: 256,
    headerHeight: 64,
    contentPadding: 24,
    maxContentWidth: 1200,
  },
} as const;

export type SpacingTokens = typeof spacing;

export default spacing;
