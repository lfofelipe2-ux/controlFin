/**
 * Google OAuth Button Component
 *
 * A reusable button component for Google OAuth authentication that follows
 * Google's brand guidelines and integrates with the BlockAI design system.
 */

import { GoogleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { authService } from '../../services/authService';

export interface GoogleOAuthButtonProps {
  /** Button text type */
  type?: 'login' | 'register';
  /** Loading state */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Full width button */
  fullWidth?: boolean;
  /** Button size */
  size?: 'small' | 'middle' | 'large';
  /** Custom className */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

const GoogleOAuthButton: React.FC<GoogleOAuthButtonProps> = ({
  type = 'login',
  loading = false,
  disabled = false,
  onClick,
  fullWidth = true,
  size = 'large',
  className = '',
  style = {},
}) => {
  const { t } = useTranslation();

  const handleClick = async () => {
    if (onClick) {
      onClick();
    }

    try {
      // Initiate Google OAuth flow
      authService.initiateGoogleLogin();
    } catch (error) {
      console.error('Error initiating Google OAuth:', error);
      // Error handling is managed by the authService
    }
  };

  const getButtonText = () => {
    if (type === 'login') {
      return t('auth.oauth.continue_with_google');
    }
    return t('auth.oauth.sign_up_with_google');
  };

  const getSizeConfig = () => {
    switch (size) {
      case 'small':
        return { height: '32px', fontSize: '14px', iconSize: 16 };
      case 'middle':
        return { height: '40px', fontSize: '16px', iconSize: 18 };
      case 'large':
        return { height: '48px', fontSize: '16px', iconSize: 20 };
      default:
        return { height: '48px', fontSize: '16px', iconSize: 20 };
    }
  };

  const sizeConfig = getSizeConfig();

  const buttonStyle: React.CSSProperties = {
    width: fullWidth ? '100%' : 'auto',
    height: sizeConfig.height,
    backgroundColor: '#ffffff',
    borderColor: '#dadce0',
    color: '#3c4043',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    fontSize: sizeConfig.fontSize,
    borderRadius: '8px',
    border: '1px solid #dadce0',
    transition: 'all 0.2s ease-in-out',
    ...style,
  };

  const hoverStyle: React.CSSProperties = {
    backgroundColor: '#f8f9fa',
    borderColor: '#dadce0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  };

  const activeStyle: React.CSSProperties = {
    backgroundColor: '#f1f3f4',
    borderColor: '#dadce0',
    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
  };

  return (
    <Button
      type='default'
      size={size}
      loading={loading}
      disabled={disabled}
      onClick={handleClick}
      className={`google-oauth-button ${className}`}
      icon={
        <GoogleOutlined
          style={{
            fontSize: sizeConfig.iconSize,
            color: '#4285f4',
          }}
        />
      }
      style={buttonStyle}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          Object.assign(e.currentTarget.style, hoverStyle);
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          Object.assign(e.currentTarget.style, buttonStyle);
        }
      }}
      onMouseDown={(e) => {
        if (!disabled && !loading) {
          Object.assign(e.currentTarget.style, activeStyle);
        }
      }}
      onMouseUp={(e) => {
        if (!disabled && !loading) {
          Object.assign(e.currentTarget.style, hoverStyle);
        }
      }}
    >
      {getButtonText()}
    </Button>
  );
};

export default GoogleOAuthButton;
