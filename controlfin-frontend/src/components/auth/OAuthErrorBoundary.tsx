/**
 * OAuth Error Boundary Component
 *
 * Provides comprehensive error handling and recovery UI for OAuth-related errors
 * including error display, recovery strategies, and user guidance.
 */

import {
  ClockCircleOutlined,
  CustomerServiceOutlined,
  ExclamationCircleOutlined,
  HomeOutlined,
  ReloadOutlined,
  WifiOutlined,
} from '@ant-design/icons';
import { Alert, Button, Card, Divider, Space, Typography } from 'antd';
import React, { Component, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useBlockAITheme } from '../../hooks/useBlockAITheme';
import OAuthErrorHandler, {
  type OAuthError,
  type OAuthErrorContext,
} from '../../services/oauthErrorHandler';

const { Title, Text, Paragraph } = Typography;

interface OAuthErrorBoundaryProps {
  children: ReactNode;
  onError?: (error: OAuthError, context: OAuthErrorContext) => void;
  fallback?: ReactNode;
}

interface OAuthErrorBoundaryState {
  hasError: boolean;
  error: OAuthError | null;
  context: OAuthErrorContext | null;
  retryCount: number;
}

class OAuthErrorBoundary extends Component<OAuthErrorBoundaryProps, OAuthErrorBoundaryState> {
  private maxRetries = 3;

  constructor(props: OAuthErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      context: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(): Partial<OAuthErrorBoundaryState> {
    return {
      hasError: true,
      error: null, // Will be set in componentDidCatch
      context: null,
    };
  }

  componentDidCatch(error: Error) {
    const context: OAuthErrorContext = {
      step: 'callback', // Default context
      originalError: error,
    };

    const oauthError = OAuthErrorHandler.handleError(error, context);

    this.setState({
      error: oauthError,
      context,
    });

    // Call error callback if provided
    if (this.props.onError) {
      this.props.onError(oauthError, context);
    }
  }

  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState((prevState) => ({
        hasError: false,
        error: null,
        context: null,
        retryCount: prevState.retryCount + 1,
      }));
    }
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleContactSupport = () => {
    // In a real app, this would open a support ticket or contact form
    const errorCode = this.state.error?.code || 'UNKNOWN_ERROR';
    const errorMessage = this.state.error?.message || 'An unknown error occurred';
    // Internal error reporting - not user-facing (kept in English for support team)
    const errorCodeLabel = 'Error Code: ';
    const errorMessageLabel = 'Error Message: ';
    const emailBody = errorCodeLabel + errorCode + '\n' + errorMessageLabel + errorMessage;
    window.open(
      'mailto:support@controlfin.com?subject=OAuth Error&body=' + encodeURIComponent(emailBody),
      '_blank'
    );
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <OAuthErrorDisplay
          error={this.state.error}
          context={this.state.context}
          retryCount={this.state.retryCount}
          maxRetries={this.maxRetries}
          onRetry={this.handleRetry}
          onGoHome={this.handleGoHome}
          onContactSupport={this.handleContactSupport}
        />
      );
    }

    return this.props.children;
  }
}

interface OAuthErrorDisplayProps {
  error: OAuthError;
  context: OAuthErrorContext | null;
  retryCount: number;
  maxRetries: number;
  onRetry: () => void;
  onGoHome: () => void;
  onContactSupport: () => void;
}

const OAuthErrorDisplay: React.FC<OAuthErrorDisplayProps> = ({
  error,
  context,
  retryCount,
  maxRetries,
  onRetry,
  onGoHome,
  onContactSupport,
}) => {
  const { t } = useTranslation();
  const { colors } = useBlockAITheme();

  const getErrorIcon = () => {
    switch (error.action) {
      case 'check_connection':
        return <WifiOutlined style={{ fontSize: '48px', color: colors.warning }} />;
      case 'retry_later':
        return <ClockCircleOutlined style={{ fontSize: '48px', color: colors.warning }} />;
      case 'contact_support':
        return <CustomerServiceOutlined style={{ fontSize: '48px', color: colors.error }} />;
      default:
        return <ExclamationCircleOutlined style={{ fontSize: '48px', color: colors.error }} />;
    }
  };

  const getErrorTitle = () => {
    switch (error.action) {
      case 'check_connection':
        return t('auth.oauth.errors.connection.title');
      case 'retry_later':
        return t('auth.oauth.errors.service.title');
      case 'contact_support':
        return t('auth.oauth.errors.support.title');
      default:
        return t('auth.oauth.errors.generic.title');
    }
  };

  const getErrorDescription = () => {
    switch (error.action) {
      case 'check_connection':
        return t('auth.oauth.errors.connection.description');
      case 'retry_later':
        return t('auth.oauth.errors.service.description');
      case 'contact_support':
        return t('auth.oauth.errors.support.description');
      default:
        return t('auth.oauth.errors.generic.description');
    }
  };

  const recoveryStrategies = OAuthErrorHandler.getRecoveryStrategies(
    error,
    context || { step: 'callback' }
  );

  const canRetry = error.recoverable && retryCount < maxRetries;

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${colors.backgroundPrimary} 0%, ${colors.backgroundSidebar} 100%)`,
        padding: '20px',
      }}
    >
      <Card
        style={{
          maxWidth: '500px',
          width: '100%',
          background: colors.backgroundCards,
          border: `1px solid rgba(255, 255, 255, 0.1)`,
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div style={{ textAlign: 'center', padding: '20px' }}>
          {/* Error Icon */}
          <div style={{ marginBottom: '24px' }}>{getErrorIcon()}</div>

          {/* Error Title */}
          <Title
            level={3}
            style={{
              color: colors.textPrimary,
              marginBottom: '12px',
              fontSize: '24px',
              fontWeight: 600,
            }}
          >
            {getErrorTitle()}
          </Title>

          {/* Error Description */}
          <Paragraph
            style={{
              color: colors.textSecondary,
              marginBottom: '24px',
              fontSize: '16px',
              lineHeight: 1.5,
            }}
          >
            {getErrorDescription()}
          </Paragraph>

          {/* Error Details (Development Only) */}
          {import.meta.env.DEV && (
            <Alert
              message={t('auth.oauth.errors.development.title')}
              description={
                <div>
                  <Text code>{error.code}</Text>
                  <br />
                  <Text type='secondary'>{error.message}</Text>
                  {context && (
                    <>
                      <br />
                      <Text type='secondary'>Context: {context.step}</Text>
                    </>
                  )}
                </div>
              }
              type='info'
              style={{ marginBottom: '24px', textAlign: 'left' }}
            />
          )}

          {/* Recovery Strategies */}
          <div style={{ marginBottom: '24px' }}>
            <Text
              strong
              style={{ color: colors.textPrimary, marginBottom: '12px', display: 'block' }}
            >
              {t('auth.oauth.errors.recovery.title')}
            </Text>
            <ul style={{ textAlign: 'left', color: colors.textSecondary, paddingLeft: '20px' }}>
              {recoveryStrategies.map((strategy, index) => (
                <li key={index} style={{ marginBottom: '8px' }}>
                  {strategy}
                </li>
              ))}
            </ul>
          </div>

          <Divider style={{ margin: '24px 0', borderColor: 'rgba(255, 255, 255, 0.1)' }} />

          {/* Action Buttons */}
          <Space direction='vertical' size='middle' style={{ width: '100%' }}>
            {canRetry && (
              <Button
                type='primary'
                size='large'
                icon={<ReloadOutlined />}
                onClick={onRetry}
                style={{
                  width: '100%',
                  height: '48px',
                  background: `linear-gradient(135deg, ${colors.accentPrimary} 0%, ${colors.accentSecondary} 100%)`,
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                }}
              >
                {t('auth.oauth.errors.actions.try_again')} ({retryCount + 1}/{maxRetries})
              </Button>
            )}

            <Button
              size='large'
              icon={<HomeOutlined />}
              onClick={onGoHome}
              style={{
                width: '100%',
                height: '48px',
                background: 'transparent',
                border: `1px solid rgba(255, 255, 255, 0.2)`,
                borderRadius: '8px',
                color: colors.textSecondary,
              }}
            >
              {t('auth.oauth.errors.actions.go_home')}
            </Button>

            {error.action === 'contact_support' && (
              <Button
                size='large'
                icon={<CustomerServiceOutlined />}
                onClick={onContactSupport}
                style={{
                  width: '100%',
                  height: '48px',
                  background: 'transparent',
                  border: `1px solid ${colors.accentPrimary}50`,
                  borderRadius: '8px',
                  color: colors.accentPrimary,
                }}
              >
                {t('auth.oauth.errors.actions.contact_support')}
              </Button>
            )}
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default OAuthErrorBoundary;
