/**
 * OAuth Callback Page
 *
 * Handles the OAuth callback from Google, processes the authentication result,
 * and redirects the user to the appropriate page.
 */

import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Spin } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AccountLinkingModal from '../components/auth/AccountLinkingModal';
import OAuthErrorBoundary from '../components/auth/OAuthErrorBoundary';
import { useBlockAITheme } from '../hooks/useBlockAITheme';
import { authService } from '../services/authService';
import OAuthErrorHandler, {
  type OAuthError,
  type OAuthErrorContext,
} from '../services/oauthErrorHandler';

type CallbackStatus = 'loading' | 'success' | 'error';

interface OAuthCallbackParams {
  access_token?: string;
  refresh_token?: string;
  is_new_user?: string;
  user_id?: string;
  error?: string;
  message?: string;
}

const OAuthCallbackPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { colors } = useBlockAITheme();

  const [status, setStatus] = useState<CallbackStatus>('loading');
  const [message, setMessage] = useState<string>('');
  const [isNewUser, setIsNewUser] = useState<boolean>(false);
  const [showLinkingModal, setShowLinkingModal] = useState<boolean>(false);
  const [googleProfile] = useState<{
    id: string;
    email: string;
    given_name: string;
    family_name: string;
    picture: string;
    verified_email: boolean;
  } | null>(null);

  const handleOAuthCallback = useCallback(async () => {
    try {
      // Get parameters from URL
      const params: OAuthCallbackParams = {
        access_token: searchParams.get('access_token') || undefined,
        refresh_token: searchParams.get('refresh_token') || undefined,
        is_new_user: searchParams.get('is_new_user') || undefined,
        user_id: searchParams.get('user_id') || undefined,
        error: searchParams.get('error') || undefined,
        message: searchParams.get('message') || undefined,
      };

      // Check for OAuth errors
      if (params.error) {
        setStatus('error');
        setMessage(params.message || t('auth.oauth.error.generic'));
        return;
      }

      // Check for required parameters
      if (!params.access_token || !params.refresh_token) {
        setStatus('error');
        setMessage(t('auth.oauth.error.missing_tokens'));
        return;
      }

      // Store tokens in localStorage
      localStorage.setItem('accessToken', params.access_token);
      localStorage.setItem('refreshToken', params.refresh_token);

      // Set user status
      setIsNewUser(params.is_new_user === 'true');

      // Update auth state
      await authService.refreshAccessToken();

      // Set success status
      setStatus('success');
      setMessage(
        isNewUser
          ? t('auth.oauth.success.account_created')
          : t('auth.oauth.success.login_successful')
      );

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('OAuth callback error:', error);

      const context: OAuthErrorContext = {
        step: 'callback',
        originalError: error,
        userEmail: 'unknown',
      };

      const oauthError = OAuthErrorHandler.handleError(error, context);
      setStatus('error');
      setMessage(oauthError.userMessage);
    }
  }, [searchParams, t, navigate, isNewUser]);

  useEffect(() => {
    handleOAuthCallback();
  }, [handleOAuthCallback]);

  const handleRetry = () => {
    navigate('/auth');
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleAccountLinkingSuccess = () => {
    setShowLinkingModal(false);
    setStatus('success');
    setMessage(t('auth.account_linking.success.linked'));
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  const handleCreateNewAccount = () => {
    setShowLinkingModal(false);
    // Handle creating new account logic here
    setStatus('success');
    setMessage(t('auth.account_linking.success.new_account_created'));
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  const handleCloseLinkingModal = () => {
    setShowLinkingModal(false);
    navigate('/auth');
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <LoadingOutlined style={{ fontSize: 48, color: colors.accentPrimary }} />;
      case 'success':
        return <CheckCircleOutlined style={{ fontSize: 48, color: colors.success }} />;
      case 'error':
        return <CloseCircleOutlined style={{ fontSize: 48, color: colors.error }} />;
      default:
        return null;
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case 'loading':
        return t('auth.oauth.status.authenticating');
      case 'success':
        return isNewUser
          ? t('auth.oauth.status.account_created')
          : t('auth.oauth.status.login_successful');
      case 'error':
        return t('auth.oauth.status.authentication_failed');
      default:
        return '';
    }
  };

  const getStatusSubtitle = () => {
    switch (status) {
      case 'loading':
        return t('auth.oauth.status.please_wait');
      case 'success':
        return t('auth.oauth.status.redirecting');
      case 'error':
        return message;
      default:
        return '';
    }
  };

  const getActions = () => {
    if (status === 'error') {
      return [
        <Button key='retry' type='primary' onClick={handleRetry}>
          {t('auth.oauth.actions.try_again')}
        </Button>,
        <Button key='home' onClick={() => navigate('/')}>
          {t('auth.oauth.actions.go_home')}
        </Button>,
      ];
    }

    if (status === 'success') {
      return [
        <Button key='dashboard' type='primary' onClick={handleGoToDashboard}>
          {t('auth.oauth.actions.go_to_dashboard')}
        </Button>,
      ];
    }

    return [];
  };

  return (
    <OAuthErrorBoundary
      onError={(error: OAuthError, context: OAuthErrorContext) => {
        console.error('OAuth Error Boundary caught error:', error, context);
      }}
    >
      <div
        className='oauth-callback-page'
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${colors.backgroundPrimary} 0%, ${colors.backgroundSidebar} 100%)`,
          padding: '20px',
        }}
      >
        <div
          className='callback-container'
          style={{
            background: colors.backgroundCards,
            borderRadius: '12px',
            padding: '48px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            maxWidth: '400px',
            width: '100%',
          }}
        >
          <div className='callback-content'>
            <div style={{ marginBottom: '24px' }}>{getStatusIcon()}</div>

            <h2
              style={{
                color: colors.textPrimary,
                margin: '24px 0 12px',
                fontSize: '24px',
                fontWeight: 600,
              }}
            >
              {getStatusTitle()}
            </h2>

            <p
              style={{
                color: colors.textSecondary,
                margin: '0 0 24px',
                fontSize: '16px',
                lineHeight: 1.5,
              }}
            >
              {getStatusSubtitle()}
            </p>

            {status === 'loading' && <Spin size='large' />}

            {status !== 'loading' && getActions().length > 0 && (
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                {getActions()}
              </div>
            )}
          </div>
        </div>

        {/* Account Linking Modal */}
        <AccountLinkingModal
          visible={showLinkingModal}
          onClose={handleCloseLinkingModal}
          onSuccess={handleAccountLinkingSuccess}
          onCreateNew={handleCreateNewAccount}
          email={googleProfile?.email || ''}
          googleProfile={
            googleProfile
              ? {
                  name: `${googleProfile.given_name} ${googleProfile.family_name}`,
                  picture: googleProfile.picture,
                }
              : undefined
          }
        />
      </div>
    </OAuthErrorBoundary>
  );
};

export default OAuthCallbackPage;
