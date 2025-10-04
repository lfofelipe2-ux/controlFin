/**
 * Design Tokens Index
 *
 * Central export file for all design tokens.
 * Import design tokens from this file for consistent styling across the application.
 *
 * @example
 * import { colors, spacing, typography, components } from '@/design-tokens';
 *
 * const myStyle = {
 *   color: colors.primary.main,
 *   padding: spacing.md,
 *   fontSize: typography.fontSize.base,
 *   borderRadius: components.borderRadius.md,
 * };
 */

export { colors, type ColorTokens } from './colors';
export { components, type ComponentTokens } from './components';
export { spacing, type SpacingTokens } from './spacing';
export { typography, type TypographyTokens } from './typography';

// Export all tokens as a single object
export { default as designTokens } from './tokens';
