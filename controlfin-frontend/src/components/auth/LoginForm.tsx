/* eslint-disable no-hardcoded-strings/no-hardcoded-strings */
/**
 * Login Form Component
 *
 * This component provides a login form with email/password authentication
 * and Google OAuth integration, following the BlockAI design system.
 */

import { EyeInvisibleOutlined, EyeTwoTone, LockOutlined, UserOutlined } from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Space,
  Typography,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useBlockAITheme } from '../../hooks/useBlockAITheme';
import { type LoginFormData } from '../../types/auth';
import logger from '../../utils/logger';
import GoogleOAuthButton from './GoogleOAuthButton';

const { Title, Text, Paragraph } = Typography;

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
  onForgotPassword?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Login Form Component
 */
const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onSwitchToRegister,
  onForgotPassword,
  className,
  style,
}) => {
  // === HOOKS ===
  const [form] = useForm<LoginFormData>();
  const navigate = useNavigate();
  const { t } = useTranslation('auth');
  const { login, isLoading, error, clearError } = useAuth();
  const { colors, typography } = useBlockAITheme();

  // === STATE ===
  const [isSubmitting, setIsSubmitting] = useState(false);

  // === HANDLERS ===

  /**
   * Handle form submission
   */
  const handleSubmit = async (values: LoginFormData) => {
    try {
      setIsSubmitting(true);
      clearError();

      await login({
        email: values.email,
        password: values.password,
      });

      // Handle success
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/dashboard');
      }
    } catch (error: unknown) {
      logger.error('Login error:', error as Error);
      // Error is handled by the auth hook
    } finally {
      setIsSubmitting(false);
    }
  };

  // === RENDER ===

  return (
    <Card
      className={className}
      style={{
        background: colors.backgroundCards,
        border: `1px solid rgba(255, 255, 255, 0.1)`,
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
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
            {t('login.title')}
          </Title>
          <Paragraph
            style={{
              color: colors.textSecondary,
              fontSize: typography.sizes.desktop.body,
              marginBottom: '32px',
            }}
          >
            {t('login.subtitle')}
          </Paragraph>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert
            message={t('login.errorTitle')}
            description={error}
            type='error'
            showIcon
            closable
            onClose={clearError}
            style={{
              background: 'rgba(255, 51, 102, 0.1)',
              border: `1px solid ${colors.error}`,
              borderRadius: '8px',
            }}
          />
        )}

        {/* Login Form */}
        <Form
          form={form}
          name='login'
          onFinish={handleSubmit}
          layout='vertical'
          requiredMark={false}
          size='large'
        >
          {/* Email Field */}
          <Form.Item
            name='email'
            label={
              <Text
                style={{
                  color: colors.textPrimary,
                  fontSize: typography.sizes.desktop.small,
                  fontWeight: typography.weights.semibold,
                }}
              >
                {t('login.emailLabel')}
              </Text>
            }
            rules={[
              {
                required: true,
                message: t('login.validation.emailRequired'),
              },
              {
                type: 'email',
                message: t('login.validation.emailInvalid'),
              },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: colors.textSecondary }} />}
              placeholder={t('login.emailPlaceholder')}
              style={{
                background: colors.backgroundCards,
                border: `1px solid rgba(255, 255, 255, 0.1)`,
                borderRadius: '8px',
                height: '48px',
              }}
            />
          </Form.Item>

          {/* Password Field */}
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
                {t('login.passwordLabel')}
              </Text>
            }
            rules={[
              {
                required: true,
                message: t('login.validation.passwordRequired'),
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: colors.textSecondary }} />}
              placeholder={t('login.passwordPlaceholder')}
              iconRender={(visible) =>
                visible ? (
                  <EyeTwoTone style={{ color: colors.textSecondary }} />
                ) : (
                  <EyeInvisibleOutlined style={{ color: colors.textSecondary }} />
                )
              }
              style={{
                background: colors.backgroundCards,
                border: `1px solid rgba(255, 255, 255, 0.1)`,
                borderRadius: '8px',
                height: '48px',
              }}
            />
          </Form.Item>

          {/* Remember Me & Forgot Password */}
          <Row
            justify='space-between'
            align='middle'
            style={{ marginTop: '16px', marginBottom: '24px' }}
          >
            <Col>
              <Form.Item name='rememberMe' valuePropName='checked' noStyle>
                <Checkbox
                  style={{
                    color: colors.textSecondary,
                    fontSize: typography.sizes.desktop.small,
                  }}
                >
                  {t('login.rememberMe')}
                </Checkbox>
              </Form.Item>
            </Col>
            <Col>
              <Button
                type='link'
                onClick={onForgotPassword}
                style={{
                  color: colors.accentPrimary,
                  fontSize: typography.sizes.desktop.small,
                  padding: 0,
                  height: 'auto',
                }}
              >
                {t('login.forgotPassword')}
              </Button>
            </Col>
          </Row>

          {/* Submit Button */}
          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              loading={isLoading || isSubmitting}
              disabled={isLoading || isSubmitting}
              style={{
                width: '100%',
                height: '48px',
                background: colors.accentPrimary,
                borderColor: colors.accentPrimary,
                borderRadius: '8px',
                fontSize: typography.sizes.desktop.body,
                fontWeight: typography.weights.semibold,
              }}
            >
              {isLoading || isSubmitting ? t('login.loggingIn') : t('login.loginButton')}
            </Button>
          </Form.Item>
        </Form>

        {/* Divider */}
        <Divider
          style={{
            color: colors.textSecondary,
            fontSize: typography.sizes.desktop.small,
            margin: '24px 0',
          }}
        >
          {t('login.orContinueWith')}
        </Divider>

        {/* Google OAuth Button */}
        <GoogleOAuthButton
          type='login'
          loading={isLoading || isSubmitting}
          disabled={isLoading || isSubmitting}
          fullWidth
          size='large'
        />

        {/* Switch to Register */}
        {onSwitchToRegister && (
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: typography.sizes.desktop.body,
              }}
            >
              {t('login.noAccount')}{' '}
            </Text>
            <Button
              type='link'
              onClick={onSwitchToRegister}
              style={{
                color: colors.accentPrimary,
                fontSize: typography.sizes.desktop.body,
                fontWeight: typography.weights.semibold,
                padding: 0,
                height: 'auto',
              }}
            >
              {t('login.signUp')}
            </Button>
          </div>
        )}
      </Space>
    </Card>
  );
};

export default LoginForm;
