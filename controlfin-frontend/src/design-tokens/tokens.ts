/**
 * Combined Design Tokens
 *
 * All design tokens combined into a single exportable object.
 */

import { colors } from './colors';
import { components } from './components';
import { spacing } from './spacing';
import { typography } from './typography';

export const designTokens = {
  colors,
  spacing,
  typography,
  components,
} as const;

export type DesignTokens = typeof designTokens;

export default designTokens;
