/* eslint-disable no-hardcoded-strings/no-hardcoded-strings */
import type { ThemeConfig } from 'antd';

/**
 * BlockAI Design System Theme Configuration
 *
 * This theme implements the exact color palette and design specifications
 * from the BlockAI design reference, ensuring 100% visual conformity.
 *
 * Color Palette:
 * - Background Principal: #2d3561 (azul-roxo escuro profundo)
 * - Background Cards: #363d65 (azul médio escuro)
 * - Accent Primário: #00d9ff (ciano elétrico)
 * - Accent Secundário: #2196f3 (azul royal)
 * - Success: #00ff88 (verde neon)
 * - Error/Danger: #ff3366 (vermelho vibrante)
 * - Warning: #ffaa00 (laranja)
 * - Texto Principal: #ffffff (branco)
 * - Texto Secundário: #a0a4b8 (cinza azulado claro)
 */

export const blockAITheme: ThemeConfig = {
  token: {
    // === BLOCKAI COLOR PALETTE ===

    // Primary Colors
    colorPrimary: '#00d9ff', // Accent Primário (ciano elétrico)
    colorSuccess: '#00ff88', // Success (verde neon)
    colorWarning: '#ffaa00', // Warning (laranja)
    colorError: '#ff3366', // Error/Danger (vermelho vibrante)
    colorInfo: '#2196f3', // Accent Secundário (azul royal)

    // Text Colors
    colorText: '#ffffff', // Texto Principal (branco)
    colorTextSecondary: '#a0a4b8', // Texto Secundário (cinza azulado claro)
    colorTextTertiary: '#8a8fa3', // Texto terciário (cinza mais claro)
    colorTextQuaternary: '#6b7080', // Texto quaternário (cinza escuro)

    // Background Colors
    colorBgContainer: '#363d65', // Background Cards (azul médio escuro)
    colorBgElevated: '#2d3561', // Background Principal (azul-roxo escuro)
    colorBgLayout: '#1f2347', // Background Sidebar (azul muito escuro)
    colorBgMask: 'rgba(0, 0, 0, 0.45)', // Background mask
    colorBgSpotlight: 'rgba(0, 0, 0, 0.85)', // Background spotlight

    // Border Colors
    colorBorder: 'rgba(255, 255, 255, 0.1)', // Borda sutil
    colorBorderSecondary: 'rgba(255, 255, 255, 0.06)', // Borda secundária
    colorSplit: 'rgba(255, 255, 255, 0.1)', // Divisor

    // === TYPOGRAPHY ===
    fontFamily: 'Inter, Poppins, Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: 16,
    fontSizeHeading1: 32,
    fontSizeHeading2: 28,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 18,
    fontSizeLG: 18,
    fontSizeSM: 14,

    // Font Weights (BlockAI specification)
    fontWeightStrong: 600, // Semibold for headings

    // Line Heights
    lineHeight: 1.5,
    lineHeightHeading1: 1.2,
    lineHeightHeading2: 1.3,
    lineHeightHeading3: 1.4,

    // === SPACING SYSTEM ===
    // Base unit: 8px (BlockAI specification)
    padding: 16, // 16px base padding
    paddingLG: 24, // 24px large padding
    paddingSM: 12, // 12px small padding
    paddingXS: 8, // 8px extra small padding
    paddingXXS: 4, // 4px extra extra small padding

    margin: 16, // 16px base margin
    marginLG: 24, // 24px large margin
    marginSM: 12, // 12px small margin
    marginXS: 8, // 8px extra small margin
    marginXXS: 4, // 4px extra extra small margin

    // === BORDER RADIUS ===
    borderRadius: 8, // Base border radius
    borderRadiusLG: 12, // Large border radius
    borderRadiusSM: 6, // Small border radius
    borderRadiusXS: 4, // Extra small border radius

    // === SHADOWS ===
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', // Card shadow
    boxShadowSecondary: '0 2px 8px rgba(0, 0, 0, 0.1)', // Secondary shadow
    boxShadowTertiary: '0 1px 4px rgba(0, 0, 0, 0.08)', // Tertiary shadow

    // === ANIMATION ===
    motionDurationFast: '0.1s',
    motionDurationMid: '0.2s',
    motionDurationSlow: '0.3s',
    motionEaseInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    motionEaseOut: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  },

  components: {
    // === BUTTON COMPONENTS ===
    Button: {
      // Primary Button (BlockAI style)
      colorPrimary: '#00d9ff',
      colorPrimaryHover: '#00c4e6',
      colorPrimaryActive: '#00a8cc',
      colorPrimaryBg: 'rgba(0, 217, 255, 0.1)',
      colorPrimaryBgHover: 'rgba(0, 217, 255, 0.2)',
      colorPrimaryBorder: '#00d9ff',
      colorPrimaryBorderHover: '#00c4e6',

      // Text Button
      colorText: '#00d9ff',

      // Button styling
      borderRadius: 8,
      paddingContentHorizontal: 24,
      paddingContentVertical: 12,
      fontWeight: 500,
      fontSize: 16,
      lineHeight: 1.5,
    },

    // === INPUT COMPONENTS ===
    Input: {
      colorBgContainer: '#363d65',
      colorBorder: 'rgba(255, 255, 255, 0.1)',
      colorText: '#ffffff',
      colorTextPlaceholder: '#a0a4b8',
      colorTextDisabled: '#6b7080',
      activeBorderColor: '#00d9ff',
      hoverBorderColor: '#00d9ff',
      activeShadow: '0 0 0 2px rgba(0, 217, 255, 0.2)',

      // Input styling
      borderRadius: 8,
      paddingInline: 16,
      paddingBlock: 12,
      fontSize: 16,
      lineHeight: 1.5,
    },

    // === CARD COMPONENTS ===
    Card: {
      colorBgContainer: '#363d65',
      colorBorder: 'rgba(255, 255, 255, 0.1)',
      colorText: '#ffffff',
      colorTextHeading: '#ffffff',
      colorTextSecondary: '#a0a4b8',

      // Card styling
      borderRadius: 12,
      paddingLG: 24,
      padding: 16,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      boxShadowTertiary: '0 1px 4px rgba(0, 0, 0, 0.08)',
    },

    // === FORM COMPONENTS ===
    Form: {
      labelColor: '#ffffff',
      labelRequiredMarkColor: '#ff3366',
      itemMarginBottom: 24,
    },

    // === MODAL COMPONENTS ===
    Modal: {
      colorBgElevated: '#363d65',
      colorBgMask: 'rgba(0, 0, 0, 0.6)',
      colorText: '#ffffff',
      colorTextHeading: '#ffffff',
      borderRadius: 12,
      paddingLG: 24,
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
    },

    // === MESSAGE COMPONENTS ===
    Message: {
      colorSuccess: '#00ff88',
      colorError: '#ff3366',
      colorWarning: '#ffaa00',
      colorInfo: '#2196f3',
      colorText: '#ffffff',
      borderRadius: 8,
    },

    // === NOTIFICATION COMPONENTS ===
    Notification: {
      colorSuccess: '#00ff88',
      colorError: '#ff3366',
      colorWarning: '#ffaa00',
      colorInfo: '#2196f3',
      colorText: '#ffffff',
      borderRadius: 8,
    },

    // === ALERT COMPONENTS ===
    Alert: {
      colorSuccess: '#00ff88',
      colorError: '#ff3366',
      colorWarning: '#ffaa00',
      colorInfo: '#2196f3',
      colorText: '#ffffff',
      colorTextHeading: '#ffffff',
      borderRadius: 8,
    },

    // === DIVIDER COMPONENTS ===
    Divider: {
      colorSplit: 'rgba(255, 255, 255, 0.1)',
      colorText: '#a0a4b8',
      colorTextHeading: '#ffffff',
    },

    // === TYPOGRAPHY COMPONENTS ===
    Typography: {
      colorText: '#ffffff',
      colorTextSecondary: '#a0a4b8',
      colorTextTertiary: '#8a8fa3',
      colorTextQuaternary: '#6b7080',
      colorTextHeading: '#ffffff',
      colorTextDescription: '#a0a4b8',
      colorTextDisabled: '#6b7080',
      colorLink: '#00d9ff',
      colorLinkHover: '#00c4e6',
      colorLinkActive: '#00a8cc',
    },

    // === LAYOUT COMPONENTS ===
    Layout: {
      colorBgLayout: '#1f2347',
      colorBgContainer: '#2d3561',
      colorBgElevated: '#363d65',
    },

    // === MENU COMPONENTS ===
    Menu: {
      colorBgContainer: '#1f2347',
      colorItemBg: 'transparent',
      colorItemBgHover: 'rgba(0, 217, 255, 0.1)',
      colorItemBgActive: 'rgba(0, 217, 255, 0.2)',
      colorItemBgSelected: 'rgba(0, 217, 255, 0.15)',
      colorItemText: '#a0a4b8',
      colorItemTextHover: '#ffffff',
      colorItemTextSelected: '#00d9ff',
      colorSubItemBg: 'transparent',
    },

    // === DROPDOWN COMPONENTS ===
    Dropdown: {
      colorBgElevated: '#363d65',
      colorText: '#ffffff',
      colorTextSecondary: '#a0a4b8',
      borderRadius: 8,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },

    // === TOOLTIP COMPONENTS ===
    Tooltip: {
      colorBgSpotlight: 'rgba(0, 0, 0, 0.85)',
      colorTextLightSolid: '#ffffff',
      borderRadius: 6,
    },

    // === PROGRESS COMPONENTS ===
    Progress: {
      colorSuccess: '#00ff88',
      colorInfo: '#00d9ff',
      colorWarning: '#ffaa00',
      colorError: '#ff3366',
      colorText: '#ffffff',
      colorTextSecondary: '#a0a4b8',
    },

    // === SPIN COMPONENTS ===
    Spin: {
      colorPrimary: '#00d9ff',
      colorText: '#ffffff',
      colorTextSecondary: '#a0a4b8',
    },

    // === BADGE COMPONENTS ===
    Badge: {
      colorSuccess: '#00ff88',
      colorError: '#ff3366',
      colorWarning: '#ffaa00',
      colorInfo: '#2196f3',
      colorText: '#ffffff',
      colorTextSecondary: '#a0a4b8',
      borderRadius: 16,
    },

    // === TAG COMPONENTS ===
    Tag: {
      colorSuccess: '#00ff88',
      colorError: '#ff3366',
      colorWarning: '#ffaa00',
      colorInfo: '#2196f3',
      colorText: '#ffffff',
      colorTextSecondary: '#a0a4b8',
      borderRadius: 16,
    },
  },

  // === ALGORITHM ===
  // algorithm: 'dark', // Use dark algorithm for better contrast
};

export default blockAITheme;
