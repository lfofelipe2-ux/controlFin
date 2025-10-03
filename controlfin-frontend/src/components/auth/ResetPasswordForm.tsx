/**
 * Reset Password Form Component
 *
 * This component provides a reset password form with password validation
 * and loading states, following the BlockAI design system.
 */

import {
  CheckCircleOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
} from '@ant-design/icons';
import { Alert, Button, Card, Form, Input, Progress, Space, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useBlockAITheme } from '../../hooks/useBlockAITheme';
import { usePasswordStrength } from '../../hooks/usePasswordStrength';
import authService from '../../services/authService';
import { type ResetPasswordFormData } from '../../types/auth';

const { Title, Text, Paragraph } = Typography;

interface ResetPasswordFormProps {
  onSuccess?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Reset Password Form Component
 */
const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ onSuccess, className, style }) => {
  // === HOOKS ===
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation('auth');
  const { colors, typography } = useBlockAITheme();
  const [form] = useForm<ResetPasswordFormData>();

  // === STATE ===
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // === PASSWORD STRENGTH ===
  const [password, setPassword] = useState('');
  const passwordStrength = usePasswordStrength(password);

  // === EFFECTS ===

  /**
   * Get token from URL parameters
   */
  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError(t('resetPassword.invalidToken'));
    }
  }, [searchParams, t]);

  // === HANDLERS ===

  /**
   * Handle form submission
   */
  const handleSubmit = async (values: ResetPasswordFormData) => {
    if (!token) {
      setError(t('resetPassword.invalidToken'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authService.resetPassword({
        ...values,
        token,
      });
      setIsSuccess(true);
      onSuccess?.();
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || t('resetPassword.errorMessage'));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle back to login
   */
  const handleBackToLogin = () => {
    navigate('/login');
  };

  // === RENDER ===

  if (isSuccess) {
    return (
      <Card
        className={className}
        style={{
          background: colors.backgroundCards,
          border: `1px solid ${colors.colorWhiteOpacity10}`,
          boxShadow: `0 8px 24px ${colors.colorBlackOpacity30}`,
          ...style,
        }}
      >
        <Space direction='vertical' size='large' style={{ width: '100%' }}>
          {/* Success Icon */}
          <div style={{ textAlign: 'center' }}>
            <CheckCircleOutlined
              style={{
                fontSize: '48px',
                color: colors.success,
                marginBottom: '16px',
              }}
            />
          </div>

          {/* Success Message */}
          <div style={{ textAlign: 'center' }}>
            <Title
              level={3}
              style={{
                color: colors.textPrimary,
                fontSize: typography.sizes.desktop.h2,
                fontWeight: typography.weights.semibold,
                marginBottom: '8px',
              }}
            >
              {t('resetPassword.successTitle')}
            </Title>
            <Paragraph
              style={{
                color: colors.textSecondary,
                fontSize: typography.sizes.desktop.body,
                marginBottom: '24px',
              }}
            >
              {t('resetPassword.successMessage')}
            </Paragraph>
          </div>

          {/* Back to Login Button */}
          <Button
            type='primary'
            size='large'
            onClick={handleBackToLogin}
            style={{
              width: '100%',
              height: '48px',
              background: colors.accentPrimary,
              borderColor: colors.accentPrimary,
              fontSize: typography.sizes.desktop.body,
              fontWeight: typography.weights.semibold,
            }}
          >
            {t('resetPassword.backToLogin')}
          </Button>
        </Space>
      </Card>
    );
  }

  return (
    <Card
      className={className}
      style={{
        background: colors.backgroundCards,
        border: `1px solid ${colors.colorWhiteOpacity10}`,
        boxShadow: `0 8px 24px ${colors.colorBlackOpacity30}`,
        ...style,
      }}
    >
      <Space direction='vertical' size='large' style={{ width: '100%' }}>
        {/* Header */}
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
            {t('resetPassword.title')}
          </Title>
          <Paragraph
            style={{
              color: colors.textSecondary,
              fontSize: typography.sizes.desktop.body,
            }}
          >
            {t('resetPassword.subtitle')}
          </Paragraph>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert
            message={t('resetPassword.errorTitle')}
            description={error}
            type='error'
            showIcon
            style={{
              background: colors.error,
              borderColor: colors.error,
              color: colors.textPrimary,
            }}
          />
        )}

        {/* Form */}
        <Form
          form={form}
          name='reset-password'
          onFinish={handleSubmit}
          layout='vertical'
          size='large'
        >
          <Form.Item
            name='password'
            label={
              <Text
                style={{
                  color: colors.textPrimary,
                  fontSize: typography.sizes.desktop.small,
                  fontWeight: typography.weights.semibold,
                }}
              >
                {t('resetPassword.passwordLabel')}
              </Text>
            }
            rules={[
              {
                required: true,
                message: t('resetPassword.validation.passwordRequired'),
              },
              {
                min: 8,
                message: t('resetPassword.validation.passwordMin'),
              },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                message: t('resetPassword.validation.passwordStrong'),
              },
            ]}
          >
            <Input.Password
              prefix={
                <LockOutlined
                  style={{
                    color: colors.textSecondary,
                  }}
                />
              }
              placeholder={t('resetPassword.passwordPlaceholder')}
              onChange={(e) => setPassword(e.target.value)}
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              style={{
                background: colors.backgroundSidebar,
                borderColor: 'rgba(255, 255, 255, 0.1)',
                color: colors.textPrimary,
                fontSize: typography.sizes.desktop.body,
              }}
            />
          </Form.Item>

          {/* Password Strength Indicator */}
          {passwordStrength.score > 0 && (
            <div>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: typography.sizes.desktop.small,
                }}
              >
                {t('resetPassword.passwordStrength.label')}:{' '}
                {t(`resetPassword.passwordStrength.${passwordStrength.level}`)}
              </Text>
              <Progress
                percent={passwordStrength.score * 25}
                showInfo={false}
                strokeColor={
                  passwordStrength.score === 1
                    ? colors.error
                    : passwordStrength.score === 2
                      ? colors.warning
                      : passwordStrength.score === 3
                        ? colors.accentPrimary
                        : colors.success
                }
                style={{
                  marginTop: '4px',
                }}
              />
            </div>
          )}

          <Form.Item
            name='confirmPassword'
            label={
              <Text
                style={{
                  color: colors.textPrimary,
                  fontSize: typography.sizes.desktop.small,
                  fontWeight: typography.weights.semibold,
                }}
              >
                {t('resetPassword.confirmPasswordLabel')}
              </Text>
            }
            dependencies={['password']}
            rules={[
              {
                required: true,
                message: t('resetPassword.validation.confirmPasswordRequired'),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(t('resetPassword.validation.passwordsMustMatch'))
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={
                <LockOutlined
                  style={{
                    color: colors.textSecondary,
                  }}
                />
              }
              placeholder={t('resetPassword.confirmPasswordPlaceholder')}
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              style={{
                background: colors.backgroundSidebar,
                borderColor: 'rgba(255, 255, 255, 0.1)',
                color: colors.textPrimary,
                fontSize: typography.sizes.desktop.body,
              }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              loading={isLoading}
              size='large'
              style={{
                width: '100%',
                height: '48px',
                background: colors.accentPrimary,
                borderColor: colors.accentPrimary,
                fontSize: typography.sizes.desktop.body,
                fontWeight: typography.weights.semibold,
              }}
            >
              {isLoading ? t('resetPassword.resetting') : t('resetPassword.resetButton')}
            </Button>
          </Form.Item>
        </Form>
      </Space>
    </Card>
  );
};

export default ResetPasswordForm;
