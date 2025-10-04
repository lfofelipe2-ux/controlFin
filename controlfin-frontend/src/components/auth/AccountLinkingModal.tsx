/**
 * Account Linking Modal Component
 *
 * Handles the process of linking Google OAuth accounts with existing user accounts
 * when a user tries to sign in with Google but already has an account with the same email.
 */

import { GoogleOutlined, InfoCircleOutlined, LinkOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Divider, Modal, Space, Typography } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBlockAITheme } from '../../hooks/useBlockAITheme';
import logger from '../../utils/logger';

const { Title, Text } = Typography;

export interface AccountLinkingModalProps {
  /** Whether the modal is visible */
  visible: boolean;
  /** Callback when modal is closed */
  onClose: () => void;
  /** Callback when account linking is successful */
  onSuccess: () => void;
  /** Callback when user chooses to create new account */
  onCreateNew: () => void;
  /** User email for linking */
  email: string;
  /** Google profile data */
  googleProfile?: {
    name: string;
    picture?: string;
  };
}

const AccountLinkingModal: React.FC<AccountLinkingModalProps> = ({
  visible,
  onClose,
  onSuccess,
  onCreateNew,
  email,
  googleProfile,
}) => {
  const { t } = useTranslation();
  const { colors } = useBlockAITheme();
  const [isLinking, setIsLinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLinkAccount = async () => {
    try {
      setIsLinking(true);
      setError(null);

      // Here we would call the backend to link the Google account
      // For now, we'll simulate the process
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Call success callback
      onSuccess();
    } catch (error) {
      logger.error('Account linking error:', error);
      setError(t('auth.account_linking.error.link_failed'));
    } finally {
      setIsLinking(false);
    }
  };

  const handleCreateNewAccount = () => {
    onCreateNew();
  };

  const modalStyle: React.CSSProperties = {
    background: colors.backgroundCards,
    border: `1px solid rgba(255, 255, 255, 0.1)`,
  };

  const headerStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, ${colors.accentPrimary}20 0%, ${colors.accentSecondary}20 100%)`,
    borderBottom: `1px solid rgba(255, 255, 255, 0.1)`,
    padding: '20px 24px',
  };

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={500}
      centered
      style={modalStyle}
      className='account-linking-modal'
    >
      <div style={headerStyle}>
        <Space direction='vertical' size='small' style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <LinkOutlined
              style={{
                fontSize: '32px',
                color: colors.accentPrimary,
                marginBottom: '8px',
              }}
            />
          </div>
          <Title
            level={3}
            style={{
              color: colors.textPrimary,
              textAlign: 'center',
              margin: 0,
              fontSize: '20px',
              fontWeight: 600,
            }}
          >
            {t('auth.account_linking.title')}
          </Title>
          <Text
            style={{
              color: colors.textSecondary,
              textAlign: 'center',
              display: 'block',
            }}
          >
            {t('auth.account_linking.subtitle')}
          </Text>
        </Space>
      </div>

      <div style={{ padding: '24px' }}>
        <Space direction='vertical' size='large' style={{ width: '100%' }}>
          {/* Account Information */}
          <div>
            <Text
              strong
              style={{ color: colors.textPrimary, marginBottom: '12px', display: 'block' }}
            >
              {t('auth.account_linking.existing_account')}
            </Text>
            <div
              style={{
                background: colors.backgroundPrimary,
                padding: '12px',
                borderRadius: '8px',
                border: `1px solid rgba(255, 255, 255, 0.1)`,
              }}
            >
              <Space>
                <UserOutlined style={{ color: colors.textSecondary }} />
                <Text style={{ color: colors.textPrimary }}>{email}</Text>
              </Space>
            </div>
          </div>

          {/* Google Account Information */}
          {googleProfile && (
            <div>
              <Text
                strong
                style={{ color: colors.textPrimary, marginBottom: '12px', display: 'block' }}
              >
                {t('auth.account_linking.google_account')}
              </Text>
              <div
                style={{
                  background: colors.backgroundPrimary,
                  padding: '12px',
                  borderRadius: '8px',
                  border: `1px solid rgba(255, 255, 255, 0.1)`,
                }}
              >
                <Space>
                  <GoogleOutlined style={{ color: colors.accentPrimary }} />
                  <div>
                    <Text style={{ color: colors.textPrimary, display: 'block' }}>
                      {googleProfile.name}
                    </Text>
                    <Text style={{ color: colors.textSecondary, fontSize: '12px' }}>{email}</Text>
                  </div>
                </Space>
              </div>
            </div>
          )}

          {/* Information Alert */}
          <Alert
            message={t('auth.account_linking.info.title')}
            description={t('auth.account_linking.info.description')}
            type='info'
            icon={<InfoCircleOutlined />}
            style={{
              background: `${colors.accentPrimary}10`,
              border: `1px solid ${colors.accentPrimary}30`,
              borderRadius: '8px',
            }}
          />

          {/* Error Display */}
          {error && (
            <Alert
              message={error}
              type='error'
              showIcon
              style={{
                background: `${colors.error}10`,
                border: `1px solid ${colors.error}30`,
                borderRadius: '8px',
              }}
            />
          )}

          <Divider style={{ margin: '16px 0', borderColor: 'rgba(255, 255, 255, 0.1)' }} />

          {/* Action Buttons */}
          <Space direction='vertical' size='middle' style={{ width: '100%' }}>
            <Button
              type='primary'
              size='large'
              loading={isLinking}
              onClick={handleLinkAccount}
              icon={<LinkOutlined />}
              style={{
                width: '100%',
                height: '48px',
                background: `linear-gradient(135deg, ${colors.accentPrimary} 0%, ${colors.accentSecondary} 100%)`,
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
              }}
            >
              {t('auth.account_linking.actions.link_accounts')}
            </Button>

            <Button
              size='large'
              onClick={handleCreateNewAccount}
              style={{
                width: '100%',
                height: '48px',
                background: 'transparent',
                border: `1px solid rgba(255, 255, 255, 0.2)`,
                borderRadius: '8px',
                color: colors.textSecondary,
              }}
            >
              {t('auth.account_linking.actions.create_new')}
            </Button>

            <Button
              type='text'
              onClick={onClose}
              style={{
                color: colors.textSecondary,
                fontSize: '14px',
              }}
            >
              {t('auth.account_linking.actions.cancel')}
            </Button>
          </Space>
        </Space>
      </div>
    </Modal>
  );
};

export default AccountLinkingModal;
