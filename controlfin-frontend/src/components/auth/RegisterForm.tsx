/**
 * Registration Form Component
 *
 * This component provides a registration form with email/password authentication
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
  Progress,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  GoogleOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { useForm } from 'antd/es/form/Form';
import { useNavigate } from 'react-router-dom';
import { type RegisterFormData, usePasswordStrength } from '../../types/auth';
import { useAuth } from '../../hooks/useAuth';
import { useBlockAITheme } from '../../hooks/useBlockAITheme';
import authService from '../../services/authService';

const { Title, Text, Paragraph } = Typography;

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Registration Form Component
 */
const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onSwitchToLogin,
  className,
  style,
}) => {
  // === HOOKS ===
  const [form] = useForm<RegisterFormData>();
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuth();
  const { colors, typography } = useBlockAITheme();

  // === STATE ===
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState('');

  // === PASSWORD STRENGTH ===
  const passwordStrength = usePasswordStrength(password);

  // === HANDLERS ===

  /**
   * Handle form submission
   */
  const handleSubmit = async (values: RegisterFormData) => {
    try {
      setIsSubmitting(true);
      clearError();

      await register({
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
      });

      // Handle success
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      // Error is handled by the auth hook
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle Google OAuth registration
   */
  const handleGoogleRegister = () => {
    try {
      authService.initiateGoogleLogin();
    } catch (error: any) {
      console.error('Google registration error:', error);
    }
  };

  /**
   * Handle password change
   */
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  /**
   * Get password strength color
   */
  const getPasswordStrengthColor = (level: string) => {
    switch (level) {
      case 'weak':
        return colors.error;
      case 'fair':
        return colors.warning;
      case 'good':
        return colors.accentSecondary;
      case 'strong':
        return colors.success;
      default:
        return colors.textSecondary;
    }
  };

  /**
   * Get password strength percentage
   */
  const getPasswordStrengthPercent = () => {
    return (passwordStrength.score / 5) * 100;
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
            Create Account
          </Title>
          <Paragraph
            style={{
              color: colors.textSecondary,
              fontSize: typography.sizes.desktop.body,
              marginBottom: '32px',
            }}
          >
            Join ControlFin and start managing your finances
          </Paragraph>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert
            message='Registration Failed'
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

        {/* Registration Form */}
        <Form
          form={form}
          name='register'
          onFinish={handleSubmit}
          layout='vertical'
          requiredMark={false}
          size='large'
        >
          {/* Name Fields */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name='firstName'
                label={
                  <Text
                    style={{
                      color: colors.textPrimary,
                      fontSize: typography.sizes.desktop.small,
                      fontWeight: typography.weights.semibold,
                    }}
                  >
                    First Name
                  </Text>
                }
                rules={[
                  {
                    required: true,
                    message: 'Please enter your first name',
                  },
                  {
                    min: 2,
                    message: 'First name must be at least 2 characters',
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: colors.textSecondary }} />}
                  placeholder='First name'
                  style={{
                    background: colors.backgroundCards,
                    border: `1px solid rgba(255, 255, 255, 0.1)`,
                    borderRadius: '8px',
                    height: '48px',
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='lastName'
                label={
                  <Text
                    style={{
                      color: colors.textPrimary,
                      fontSize: typography.sizes.desktop.small,
                      fontWeight: typography.weights.semibold,
                    }}
                  >
                    Last Name
                  </Text>
                }
                rules={[
                  {
                    required: true,
                    message: 'Please enter your last name',
                  },
                  {
                    min: 2,
                    message: 'Last name must be at least 2 characters',
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: colors.textSecondary }} />}
                  placeholder='Last name'
                  style={{
                    background: colors.backgroundCards,
                    border: `1px solid rgba(255, 255, 255, 0.1)`,
                    borderRadius: '8px',
                    height: '48px',
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

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
              prefix={<MailOutlined style={{ color: colors.textSecondary }} />}
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
                message: 'Please enter a password',
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
              prefix={<LockOutlined style={{ color: colors.textSecondary }} />}
              placeholder='Create a strong password'
              iconRender={(visible) =>
                visible ? (
                  <EyeTwoTone style={{ color: colors.textSecondary }} />
                ) : (
                  <EyeInvisibleOutlined style={{ color: colors.textSecondary }} />
                )
              }
              onChange={handlePasswordChange}
              style={{
                background: colors.backgroundCards,
                border: `1px solid rgba(255, 255, 255, 0.1)`,
                borderRadius: '8px',
                height: '48px',
              }}
            />
          </Form.Item>

          {/* Password Strength Indicator */}
          {password && (
            <div style={{ marginBottom: '16px' }}>
              <Row justify='space-between' align='middle' style={{ marginBottom: '8px' }}>
                <Col>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontSize: typography.sizes.desktop.small,
                    }}
                  >
                    Password Strength
                  </Text>
                </Col>
                <Col>
                  <Text
                    style={{
                      color: getPasswordStrengthColor(passwordStrength.level),
                      fontSize: typography.sizes.desktop.small,
                      fontWeight: typography.weights.semibold,
                      textTransform: 'capitalize',
                    }}
                  >
                    {passwordStrength.level}
                  </Text>
                </Col>
              </Row>
              <Progress
                percent={getPasswordStrengthPercent()}
                showInfo={false}
                strokeColor={getPasswordStrengthColor(passwordStrength.level)}
                style={{
                  marginBottom: '8px',
                }}
              />
              <Space direction='vertical' size='small'>
                {passwordStrength.feedback.map((feedback: string, index: number) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                    {passwordStrength.score > index ? (
                      <CheckCircleOutlined
                        style={{
                          color: colors.success,
                          marginRight: '8px',
                          fontSize: '12px',
                        }}
                      />
                    ) : (
                      <CloseCircleOutlined
                        style={{
                          color: colors.textSecondary,
                          marginRight: '8px',
                          fontSize: '12px',
                        }}
                      />
                    )}
                    <Text
                      style={{
                        color:
                          passwordStrength.score > index ? colors.success : colors.textSecondary,
                        fontSize: typography.sizes.desktop.small,
                      }}
                    >
                      {feedback}
                    </Text>
                  </div>
                ))}
              </Space>
            </div>
          )}

          {/* Confirm Password Field */}
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
                Confirm Password
              </Text>
            }
            rules={[
              {
                required: true,
                message: 'Please confirm your password',
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
              prefix={<LockOutlined style={{ color: colors.textSecondary }} />}
              placeholder='Confirm your password'
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

          {/* Terms and Conditions */}
          <Form.Item
            name='termsAccepted'
            valuePropName='checked'
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(new Error('You must accept the terms and conditions')),
              },
            ]}
          >
            <Checkbox
              style={{
                color: colors.textSecondary,
                fontSize: typography.sizes.desktop.small,
              }}
            >
              I agree to the{' '}
              <Button
                type='link'
                style={{
                  color: colors.accentPrimary,
                  fontSize: typography.sizes.desktop.small,
                  padding: 0,
                  height: 'auto',
                }}
              >
                Terms of Service
              </Button>{' '}
              and{' '}
              <Button
                type='link'
                style={{
                  color: colors.accentPrimary,
                  fontSize: typography.sizes.desktop.small,
                  padding: 0,
                  height: 'auto',
                }}
              >
                Privacy Policy
              </Button>
            </Checkbox>
          </Form.Item>

          {/* Submit Button */}
          <Form.Item style={{ marginBottom: '24px' }}>
            <Button
              type='primary'
              htmlType='submit'
              loading={isLoading || isSubmitting}
              disabled={isLoading || isSubmitting || !passwordStrength.isValid}
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
              {isLoading || isSubmitting ? 'Creating Account...' : 'Create Account'}
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
          onClick={handleGoogleRegister}
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

        {/* Switch to Login */}
        {onSwitchToLogin && (
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: typography.sizes.desktop.body,
              }}
            >
              Already have an account?{' '}
            </Text>
            <Button
              type='link'
              onClick={onSwitchToLogin}
              style={{
                color: colors.accentPrimary,
                fontSize: typography.sizes.desktop.body,
                fontWeight: typography.weights.semibold,
                padding: 0,
                height: 'auto',
              }}
            >
              Sign in here
            </Button>
          </div>
        )}
      </Space>
    </Card>
  );
};

export default RegisterForm;
