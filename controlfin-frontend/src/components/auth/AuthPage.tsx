/**
 * Authentication Page Component
 *
 * This component provides a complete authentication experience with
 * login and registration forms, following the BlockAI design system.
 */

import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Typography, Space, Button, Card } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useBlockAITheme } from '../../hooks/useBlockAITheme';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

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
          <Card
            style={{
              background: colors.backgroundCards,
              border: `1px solid rgba(255, 255, 255, 0.1)`,
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
            }}
          >
            <Space direction='vertical' size='large' style={{ width: '100%' }}>
              <div style={{ textAlign: 'center' }}>
                <Title
                  level={2}
                  style={{
                    color: colors.textPrimary,
                    fontSize: typography.sizes.desktop.h2,
                    fontWeight: typography.weights.semibold,
                    marginBottom: '8px',
                  }}
                >
                  Forgot Password?
                </Title>
                <Paragraph
                  style={{
                    color: colors.textSecondary,
                    fontSize: typography.sizes.desktop.body,
                    marginBottom: '32px',
                  }}
                >
                  Enter your email address and we'll send you a link to reset your password.
                </Paragraph>
              </div>

              <Button
                type='link'
                onClick={handleBackToLogin}
                style={{
                  color: colors.accentPrimary,
                  fontSize: typography.sizes.desktop.body,
                  fontWeight: typography.weights.semibold,
                  padding: 0,
                  height: 'auto',
                }}
                icon={<ArrowLeftOutlined />}
              >
                Back to Login
              </Button>
            </Space>
          </Card>
        );
      case 'reset-password':
        return (
          <Card
            style={{
              background: colors.backgroundCards,
              border: `1px solid rgba(255, 255, 255, 0.1)`,
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
            }}
          >
            <Space direction='vertical' size='large' style={{ width: '100%' }}>
              <div style={{ textAlign: 'center' }}>
                <Title
                  level={2}
                  style={{
                    color: colors.textPrimary,
                    fontSize: typography.sizes.desktop.h2,
                    fontWeight: typography.weights.semibold,
                    marginBottom: '8px',
                  }}
                >
                  Reset Password
                </Title>
                <Paragraph
                  style={{
                    color: colors.textSecondary,
                    fontSize: typography.sizes.desktop.body,
                    marginBottom: '32px',
                  }}
                >
                  Enter your new password below.
                </Paragraph>
              </div>

              <Button
                type='link'
                onClick={handleBackToLogin}
                style={{
                  color: colors.accentPrimary,
                  fontSize: typography.sizes.desktop.body,
                  fontWeight: typography.weights.semibold,
                  padding: 0,
                  height: 'auto',
                }}
                icon={<ArrowLeftOutlined />}
              >
                Back to Login
              </Button>
            </Space>
          </Card>
        );
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
        background: `linear-gradient(135deg, ${colors.backgroundPrimary} 0%, ${colors.backgroundSidebar} 100%)`,
        padding: '24px',
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
