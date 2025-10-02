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
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useBlockAITheme } from '../../hooks/useBlockAITheme';
import authService from '../../services/authService';
import { type ResetPasswordFormData } from '../../types/auth';
import { usePasswordStrength } from '../../hooks/usePasswordStrength';

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
      setError('Invalid or missing reset token');
    }
  }, [searchParams]);

  // === HANDLERS ===

  /**
   * Handle form submission
   */
  const handleSubmit = async (values: ResetPasswordFormData) => {
    if (!token) {
      setError('Invalid or missing reset token');
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
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
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
              Password Reset Successfully
            </Title>
            <Paragraph
              style={{
                color: colors.textSecondary,
                fontSize: typography.sizes.desktop.body,
                marginBottom: '24px',
              }}
            >
              Your password has been reset successfully. You can now log in with your new password.
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
            Reset Your Password
          </Title>
          <Paragraph
            style={{
              color: colors.textSecondary,
              fontSize: typography.sizes.desktop.body,
            }}
          >
            Enter your new password below. Make sure it's strong and secure.
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
                New Password
              </Text>
            }
            rules={[
              {
                required: true,
                message: 'Please enter your new password',
              },
              {
                min: 8,
                message: 'Password must be at least 8 characters',
              },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                message:
                  'Password must contain uppercase, lowercase, number, and special character',
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
              placeholder='Enter your new password'
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
                Password Strength: {passwordStrength.level}
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
                Confirm New Password
              </Text>
            }
            dependencies={['password']}
            rules={[
              {
                required: true,
                message: 'Please confirm your new password',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
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
              placeholder='Confirm your new password'
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
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </Form.Item>
        </Form>
      </Space>
    </Card>
  );
};

export default ResetPasswordForm;
