/**
 * Login Form Component
 *
 * This component provides a login form with email/password authentication
 * and Google OAuth integration, following the BlockAI design system.
 */

import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  Space,
  Divider,
  Alert,
  Card,
  Row,
  Col,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  GoogleOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from '@ant-design/icons';
import { useForm } from 'antd/es/form/Form';
import { useNavigate } from 'react-router-dom';
import { type LoginFormData } from '../../types/auth';
import { useAuth } from '../../hooks/useAuth';
import { useBlockAITheme } from '../../hooks/useBlockAITheme';
import authService from '../../services/authService';

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
    } catch (error: any) {
      console.error('Login error:', error);
      // Error is handled by the auth hook
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle Google OAuth login
   */
  const handleGoogleLogin = () => {
    try {
      authService.initiateGoogleLogin();
    } catch (error: any) {
      console.error('Google login error:', error);
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
            Welcome Back
          </Title>
          <Paragraph
            style={{
              color: colors.textSecondary,
              fontSize: typography.sizes.desktop.body,
              marginBottom: '32px',
            }}
          >
            Sign in to your ControlFin account
          </Paragraph>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert
            message='Login Failed'
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
              prefix={<UserOutlined style={{ color: colors.textSecondary }} />}
              placeholder='Enter your email'
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
                Password
              </Text>
            }
            rules={[
              {
                required: true,
                message: 'Please enter your password',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: colors.textSecondary }} />}
              placeholder='Enter your password'
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
          <Row justify='space-between' align='middle'>
            <Col>
              <Form.Item name='rememberMe' valuePropName='checked' noStyle>
                <Checkbox
                  style={{
                    color: colors.textSecondary,
                    fontSize: typography.sizes.desktop.small,
                  }}
                >
                  Remember me
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
                Forgot password?
              </Button>
            </Col>
          </Row>

          {/* Submit Button */}
          <Form.Item style={{ marginBottom: '24px' }}>
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
              {isLoading || isSubmitting ? 'Signing In...' : 'Sign In'}
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
          Or continue with
        </Divider>

        {/* Google OAuth Button */}
        <Button
          onClick={handleGoogleLogin}
          disabled={isLoading || isSubmitting}
          style={{
            width: '100%',
            height: '48px',
            background: 'transparent',
            border: `1px solid rgba(255, 255, 255, 0.1)`,
            borderRadius: '8px',
            color: colors.textPrimary,
            fontSize: typography.sizes.desktop.body,
            fontWeight: typography.weights.semibold,
          }}
          icon={<GoogleOutlined />}
        >
          Continue with Google
        </Button>

        {/* Switch to Register */}
        {onSwitchToRegister && (
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: typography.sizes.desktop.body,
              }}
            >
              Don't have an account?{' '}
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
              Sign up here
            </Button>
          </div>
        )}
      </Space>
    </Card>
  );
};

export default LoginForm;
