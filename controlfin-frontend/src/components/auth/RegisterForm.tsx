/**
 * Registration Form Component
 *
 * This component provides a registration form with email/password authentication
 * and Google OAuth integration, following the BlockAI design system.
 */

import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  GoogleOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  Progress,
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
import { usePasswordStrength } from '../../hooks/usePasswordStrength';
import authService from '../../services/authService';
import { type RegisterFormData } from '../../types/auth';

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
  const { t } = useTranslation('auth');
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
    } catch (error: unknown) {
      console.error('Registration error:', error as Error);
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
    } catch (error: unknown) {
      console.error('Google registration error:', error as Error);
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
            {t('register.title')}
          </Title>
          <Paragraph
            style={{
              color: colors.textSecondary,
              fontSize: typography.sizes.desktop.body,
              marginBottom: '32px',
            }}
          >
            {t('register.subtitle')}
          </Paragraph>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert
            message={t('register.errorTitle')}
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
                    {t('register.firstNameLabel')}
                  </Text>
                }
                rules={[
                  {
                    required: true,
                    message: t('register.validation.firstNameRequired'),
                  },
                  {
                    min: 2,
                    message: t('register.validation.firstNameMin'),
                  },
                ]}
              >
                <Input
                  prefix={
                    <UserOutlined style={{ color: colors.textSecondary, marginRight: '8px' }} />
                  }
                  placeholder={t('register.firstNamePlaceholder')}
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
                    {t('register.lastNameLabel')}
                  </Text>
                }
                rules={[
                  {
                    required: true,
                    message: t('register.validation.lastNameRequired'),
                  },
                  {
                    min: 2,
                    message: t('register.validation.lastNameMin'),
                  },
                ]}
              >
                <Input
                  prefix={
                    <UserOutlined style={{ color: colors.textSecondary, marginRight: '8px' }} />
                  }
                  placeholder={t('register.lastNamePlaceholder')}
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
                {t('register.emailLabel')}
              </Text>
            }
            rules={[
              {
                required: true,
                message: t('register.validation.emailRequired'),
              },
              {
                type: 'email',
                message: t('register.validation.emailInvalid'),
              },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: colors.textSecondary, marginRight: '8px' }} />}
              placeholder={t('register.emailPlaceholder')}
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
                {t('register.passwordLabel')}
              </Text>
            }
            rules={[
              {
                required: true,
                message: t('register.validation.passwordRequired'),
              },
              {
                min: 8,
                message: t('register.validation.passwordMin'),
              },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                message: t('register.validation.passwordPattern'),
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: colors.textSecondary, marginRight: '8px' }} />}
              placeholder={t('register.passwordPlaceholder')}
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
                    {t('register.passwordStrength.label')}
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
                    {t(`register.passwordStrength.${passwordStrength.level}`)}
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
                  <div key={feedback} style={{ display: 'flex', alignItems: 'center' }}>
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
                {t('register.confirmPasswordLabel')}
              </Text>
            }
            rules={[
              {
                required: true,
                message: t('register.validation.confirmPasswordRequired'),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t('register.validation.passwordsMustMatch')));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: colors.textSecondary, marginRight: '8px' }} />}
              placeholder={t('register.confirmPasswordPlaceholder')}
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
            style={{ marginTop: '16px', marginBottom: '24px' }}
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(new Error(t('register.validation.termsRequired'))),
              },
            ]}
          >
            <Checkbox
              style={{
                color: colors.textSecondary,
                fontSize: typography.sizes.desktop.small,
              }}
            >
              {t('register.termsLabel')}{' '}
              <Button
                type='link'
                style={{
                  color: colors.accentPrimary,
                  fontSize: typography.sizes.desktop.small,
                  padding: 0,
                  height: 'auto',
                  border: 'none',
                  boxShadow: 'none',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.outline = 'none';
                }}
                onFocus={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.outline = 'none';
                }}
              >
                {t('register.termsLink')}
              </Button>{' '}
              {t('register.and')}{' '}
              <Button
                type='link'
                style={{
                  color: colors.accentPrimary,
                  fontSize: typography.sizes.desktop.small,
                  padding: 0,
                  height: 'auto',
                  border: 'none',
                  boxShadow: 'none',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.outline = 'none';
                }}
                onFocus={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.outline = 'none';
                }}
              >
                {t('register.privacyLink')}
              </Button>
            </Checkbox>
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
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
              {isLoading || isSubmitting ? t('register.registering') : t('register.registerButton')}
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
          {t('register.orContinueWith')}
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
          {t('register.googleButton')}
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
              {t('register.haveAccount')}{' '}
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
              {t('register.signIn')}
            </Button>
          </div>
        )}
      </Space>
    </Card>
  );
};

export default RegisterForm;
