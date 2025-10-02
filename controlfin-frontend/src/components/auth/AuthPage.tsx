/**
 * Authentication Page Component
 *
 * This component provides a complete authentication experience with
 * login and registration forms, following the BlockAI design system.
 */

import { Col, Layout, Row, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useBlockAITheme } from '../../hooks/useBlockAITheme';
import ForgotPasswordForm from './ForgotPasswordForm';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ResetPasswordForm from './ResetPasswordForm';

const { Content } = Layout;
const { Text } = Typography;

type AuthMode = 'login' | 'register' | 'forgot-password' | 'reset-password';

interface AuthPageProps {
  initialMode?: AuthMode;
  onSuccess?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Authentication Page Component
 */
const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  onSuccess,
  className,
  style,
}) => {
  // === HOOKS ===
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const { colors, typography } = useBlockAITheme();

  // === STATE ===
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [isAnimating, setIsAnimating] = useState(false);

  // === EFFECTS ===

  /**
   * Redirect if already authenticated
   */
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  /**
   * Handle mode changes with animation
   */
  const handleModeChange = (newMode: AuthMode) => {
    if (newMode === mode) return;

    setIsAnimating(true);
    setTimeout(() => {
      setMode(newMode);
      setIsAnimating(false);
    }, 150);
  };

  // === HANDLERS ===

  /**
   * Handle successful authentication
   */
  const handleAuthSuccess = () => {
    if (onSuccess) {
      onSuccess();
    } else {
      navigate('/dashboard');
    }
  };

  /**
   * Handle back to login
   */
  const handleBackToLogin = () => {
    handleModeChange('login');
  };

  /**
   * Handle switch to register
   */
  const handleSwitchToRegister = () => {
    handleModeChange('register');
  };

  /**
   * Handle switch to login
   */
  const handleSwitchToLogin = () => {
    handleModeChange('login');
  };

  /**
   * Handle forgot password
   */
  const handleForgotPassword = () => {
    handleModeChange('forgot-password');
  };

  // === RENDER HELPERS ===

  /**
   * Render authentication form based on current mode
   */
  const renderAuthForm = () => {
    switch (mode) {
      case 'login':
        return (
          <LoginForm
            onSuccess={handleAuthSuccess}
            onSwitchToRegister={handleSwitchToRegister}
            onForgotPassword={handleForgotPassword}
          />
        );
      case 'register':
        return <RegisterForm onSuccess={handleAuthSuccess} onSwitchToLogin={handleSwitchToLogin} />;
      case 'forgot-password':
        return (
          <ForgotPasswordForm onSuccess={handleAuthSuccess} onBackToLogin={handleBackToLogin} />
        );
      case 'reset-password':
        return <ResetPasswordForm onSuccess={handleAuthSuccess} />;
      default:
        return null;
    }
  };

  // === RENDER ===

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${colors.backgroundPrimary} 0%, ${colors.backgroundSidebar} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: `3px solid ${colors.accentPrimary}`,
              borderTop: `3px solid transparent`,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px',
            }}
          />
          <Text
            style={{
              color: colors.textPrimary,
              fontSize: typography.sizes.desktop.body,
            }}
          >
            Loading...
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        minHeight: '100vh',
        height: '100vh',
        background: `linear-gradient(135deg, ${colors.backgroundPrimary} 0%, ${colors.backgroundSidebar} 100%)`,
        padding: '16px',
        ...style,
      }}
    >
      <Content>
        <Row justify='center' align='middle' style={{ minHeight: '100vh' }}>
          <Col xs={24} sm={20} md={16} lg={12} xl={10}>
            <div
              style={{
                opacity: isAnimating ? 0.7 : 1,
                transition: 'opacity 0.15s ease-in-out',
              }}
            >
              {renderAuthForm()}
            </div>
          </Col>
        </Row>
      </Content>

      {/* CSS Animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default AuthPage;
