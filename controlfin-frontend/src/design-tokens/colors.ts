/* eslint-disable no-hardcoded-strings/no-hardcoded-strings */
/**
 * Color Design Tokens
 * Based on BlockAI Design System
 *
 * This file centralizes all color values used throughout the application.
 * Colors are organized by purpose and follow the BlockAI specifications.
 */

export const colors = {
  // === PRIMARY COLORS ===
  primary: {
    main: '#00d9ff', // Ciano elétrico (BlockAI primary)
    hover: '#00c4e6',
    active: '#00a8cc',
    bg: 'rgba(0, 217, 255, 0.1)',
    bgHover: 'rgba(0, 217, 255, 0.2)',
  },

  // === SECONDARY COLORS ===
  secondary: {
    main: '#2196f3', // Azul royal (BlockAI secondary)
    hover: '#1976d2',
    active: '#0d47a1',
  },

  // === STATUS COLORS ===
  success: {
    main: '#00ff88', // Verde neon
    hover: '#00e67a',
    active: '#00cc6c',
    bg: 'rgba(0, 255, 136, 0.1)',
  },

  error: {
    main: '#ff3366', // Vermelho vibrante
    hover: '#ff4d7a',
    active: '#e62e5c',
    bg: 'rgba(255, 51, 102, 0.1)',
  },

  warning: {
    main: '#ffaa00', // Laranja
    hover: '#ffb733',
    active: '#e69900',
    bg: 'rgba(255, 170, 0, 0.1)',
  },

  info: {
    main: '#2196f3', // Azul royal
    hover: '#42a5f5',
    active: '#1976d2',
    bg: 'rgba(33, 150, 243, 0.1)',
  },

  // === BACKGROUND COLORS ===
  background: {
    primary: '#2d3561', // Background Principal (azul-roxo escuro)
    secondary: '#363d65', // Background Cards (azul médio escuro)
    tertiary: '#1f2347', // Background Sidebar (azul muito escuro)
    elevated: '#363d65',
    layout: '#1f2347',
    mask: 'rgba(0, 0, 0, 0.45)',
    spotlight: 'rgba(0, 0, 0, 0.85)',
  },

  // === TEXT COLORS ===
  text: {
    primary: '#ffffff', // Texto principal (branco)
    secondary: '#a0a4b8', // Texto secundário (cinza azulado claro)
    tertiary: '#8a8fa3', // Texto terciário
    quaternary: '#6b7080', // Texto quaternário
    disabled: '#6b7080',
    inverse: '#2d3561',
  },

  // === BORDER COLORS ===
  border: {
    primary: 'rgba(255, 255, 255, 0.1)', // Borda sutil
    secondary: 'rgba(255, 255, 255, 0.06)', // Borda secundária
    focus: '#00d9ff', // Borda em foco
  },

  // === LINK COLORS ===
  link: {
    default: '#00d9ff',
    hover: '#00c4e6',
    active: '#00a8cc',
    visited: '#a3d9ff',
  },

  // === OVERLAY COLORS ===
  overlay: {
    light: 'rgba(0, 0, 0, 0.3)',
    medium: 'rgba(0, 0, 0, 0.6)',
    dark: 'rgba(0, 0, 0, 0.85)',
  },

  // === GRADIENT PRESETS ===
  gradients: {
    primary: 'linear-gradient(135deg, #0066cc 0%, #4da6ff 100%)',
    primaryHover: 'linear-gradient(135deg, #0052a3 0%, #3d8cd9 100%)',
    primaryActive: 'linear-gradient(135deg, #004080 0%, #2d73b3 100%)',
    cyanElectric: 'linear-gradient(135deg, #00d9ff 0%, #2196f3 100%)',
    success: 'linear-gradient(135deg, #00ff88 0%, #00cc6c 100%)',
    error: 'linear-gradient(135deg, #ff3366 0%, #e62e5c 100%)',
    warning: 'linear-gradient(135deg, #ffaa00 0%, #ff8800 100%)',
  },
} as const;

export type ColorTokens = typeof colors;

export default colors;
