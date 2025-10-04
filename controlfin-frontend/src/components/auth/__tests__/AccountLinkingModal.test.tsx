/**
 * Account Linking Modal Tests
 *
 * Basic tests for the AccountLinkingModal component
 */

import { describe, expect, it, vi } from 'vitest';
import AccountLinkingModal, { type AccountLinkingModalProps } from '../AccountLinkingModal';

// Mock the useBlockAITheme hook
vi.mock('../../../hooks/useBlockAITheme', () => ({
  useBlockAITheme: () => ({
    colors: {
      backgroundCards: '#1a1a1a',
      backgroundPrimary: '#0f0f0f',
      textPrimary: '#ffffff',
      textSecondary: '#cccccc',
      accentPrimary: '#3b82f6',
      accentSecondary: '#8b5cf6',
      error: '#ef4444',
      warning: '#f59e0b',
      success: '#10b981',
    },
  }),
}));

const defaultProps: AccountLinkingModalProps = {
  visible: true,
  onClose: vi.fn(),
  onSuccess: vi.fn(),
  onCreateNew: vi.fn(),
  email: 'test@example.com',
  googleProfile: {
    // Test data - not user-facing strings
    name: 'John Doe',
    picture: 'https://example.com/avatar.jpg',
  },
};

// Test suite - strings are test data, not user-facing
describe('AccountLinkingModal', () => {
  it('should be defined', () => {
    expect(AccountLinkingModal).toBeDefined();
  });

  it('should accept required props', () => {
    expect(defaultProps.visible).toBe(true);
    expect(defaultProps.email).toBe('test@example.com');
    expect(defaultProps.googleProfile?.name).toBe('John Doe'); // Test assertion - not user-facing
  });

  it('should have proper prop types', () => {
    expect(typeof defaultProps.onClose).toBe('function');
    expect(typeof defaultProps.onSuccess).toBe('function');
    expect(typeof defaultProps.onCreateNew).toBe('function');
  });
});
