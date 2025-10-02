/**
 * Forgot Password Form Component
 *
 * This component provides a forgot password form with email validation
 * and loading states, following the BlockAI design system.
 */

import { ArrowLeftOutlined, CheckCircleOutlined, MailOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Form, Input, Space, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlockAITheme } from '../../hooks/useBlockAITheme';
import authService from '../../services/authService';
import { type ForgotPasswordFormData } from '../../types/auth';

const { Title, Text, Paragraph } = Typography;

interface ForgotPasswordFormProps {
  onSuccess?: () => void;
  onBackToLogin?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Forgot Password Form Component
 */
const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSuccess,
  onBackToLogin,
  className,
  style,
}) => {
  // === HOOKS ===
  const navigate = useNavigate();
  const { colors, typography } = useBlockAITheme();
  const [form] = useForm<ForgotPasswordFormData>();

  // === STATE ===
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // === HANDLERS ===

  /**
   * Handle form submission
   */
  const handleSubmit = async (values: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.forgotPassword(values.email);
      setIsSuccess(true);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle back to login
   */
  const handleBackToLogin = () => {
    onBackToLogin?.();
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
              Check Your Email
            </Title>
            <Paragraph
              style={{
                color: colors.textSecondary,
                fontSize: typography.sizes.desktop.body,
                marginBottom: '24px',
              }}
            >
              We've sent a password reset link to your email address. Please check your inbox and
              follow the instructions to reset your password.
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
            Back to Login
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
            Forgot Password?
          </Title>
          <Paragraph
            style={{
              color: colors.textSecondary,
              fontSize: typography.sizes.desktop.body,
            }}
          >
            Enter your email address and we'll send you a link to reset your password.
          </Paragraph>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert
            message='Error'
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
          name='forgot-password'
          onFinish={handleSubmit}
          layout='vertical'
          size='large'
        >
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
                Email Address
              </Text>
            }
            rules={[
              {
                required: true,
                message: 'Please enter your email address',
              },
              {
                type: 'email',
                message: 'Please enter a valid email address',
              },
            ]}
          >
            <Input
              prefix={
                <MailOutlined
                  style={{
                    color: colors.textSecondary,
                  }}
                />
              }
              placeholder='Enter your email address'
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
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </Form.Item>
        </Form>

        {/* Back to Login */}
        <div style={{ textAlign: 'center' }}>
          <Button
            type='link'
            onClick={handleBackToLogin}
            style={{
              color: colors.accentPrimary,
              fontSize: typography.sizes.desktop.body,
              fontWeight: typography.weights.regular,
            }}
          >
            <ArrowLeftOutlined style={{ marginRight: '8px' }} />
            Back to Login
          </Button>
        </div>
      </Space>
    </Card>
  );
};

export default ForgotPasswordForm;
