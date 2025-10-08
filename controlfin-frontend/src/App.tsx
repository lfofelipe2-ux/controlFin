/* eslint-disable no-hardcoded-strings/no-hardcoded-strings */
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { AuthPage } from './components/auth';
import BlockAIThemeProvider from './components/BlockAIThemeProvider';
import { TransactionManagement } from './components/transaction/TransactionManagement';
import { useBlockAITheme } from './hooks/useBlockAITheme';
import OAuthCallbackPage from './pages/OAuthCallbackPage';

const { Title, Text, Paragraph } = Typography;

/**
 * Dashboard Component
 *
 * This component demonstrates the BlockAI design system implementation
 * with proper theming and component styling.
 */
const Dashboard: React.FC = () => {
  const { colors, typography } = useBlockAITheme();
  const { t } = useTranslation();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${colors.backgroundPrimary} 0%, ${colors.backgroundSidebar} 100%)`,
        padding: '24px',
      }}
    >
      <Row justify='center' align='middle' style={{ minHeight: '100vh' }}>
        <Col xs={24} sm={20} md={16} lg={12} xl={10}>
          <Card
            style={{
              background: colors.backgroundCards,
              border: `1px solid rgba(255, 255, 255, 0.1)`,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
            }}
          >
            <Space direction='vertical' size='large' style={{ width: '100%' }}>
              {/* Header */}
              <div style={{ textAlign: 'center' }}>
                <Title
                  level={1}
                  style={{
                    color: colors.textPrimary,
                    fontSize: typography.sizes.desktop.h1,
                    fontWeight: typography.weights.semibold,
                    marginBottom: '8px',
                  }}
                >
                  {t('dashboard.title')}
                </Title>
                <Paragraph
                  style={{
                    color: colors.textSecondary,
                    fontSize: typography.sizes.desktop.body,
                    marginBottom: '32px',
                  }}
                >
                  {t('dashboard.welcome')}
                </Paragraph>
              </div>

              {/* Theme Demo */}
              <div>
                <Title level={3} style={{ color: colors.textPrimary, marginBottom: '16px' }}>
                  {t('dashboard.designSystemDemo')}
                </Title>

                <Space direction='vertical' size='middle' style={{ width: '100%' }}>
                  {/* Buttons Demo */}
                  <div>
                    <Text
                      style={{
                        color: colors.textSecondary,
                        display: 'block',
                        marginBottom: '8px',
                      }}
                    >
                      {t('dashboard.buttonComponents')}:
                    </Text>
                    <Space wrap>
                      <Button type='primary' icon={<UserOutlined />}>
                        {t('common.primaryButton')}
                      </Button>
                      <Button icon={<MailOutlined />}>{t('common.defaultButton')}</Button>
                      <Button type='text' icon={<LockOutlined />}>
                        {t('common.textButton')}
                      </Button>
                    </Space>
                  </div>

                  {/* Colors Demo */}
                  <div>
                    <Text
                      style={{
                        color: colors.textSecondary,
                        display: 'block',
                        marginBottom: '8px',
                      }}
                    >
                      {t('dashboard.colorPalette')}:
                    </Text>
                    <Row gutter={[8, 8]}>
                      <Col span={6}>
                        <div
                          style={{
                            height: '40px',
                            background: colors.accentPrimary,
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: colors.textPrimary,
                            fontSize: '12px',
                            fontWeight: 'bold',
                          }}
                        >
                          {t('common.primary')}
                        </div>
                      </Col>
                      <Col span={6}>
                        <div
                          style={{
                            height: '40px',
                            background: colors.success,
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: colors.textPrimary,
                            fontSize: '12px',
                            fontWeight: 'bold',
                          }}
                        >
                          {t('common.success')}
                        </div>
                      </Col>
                      <Col span={6}>
                        <div
                          style={{
                            height: '40px',
                            background: colors.warning,
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: colors.textPrimary,
                            fontSize: '12px',
                            fontWeight: 'bold',
                          }}
                        >
                          {t('common.warning')}
                        </div>
                      </Col>
                      <Col span={6}>
                        <div
                          style={{
                            height: '40px',
                            background: colors.error,
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: colors.textPrimary,
                            fontSize: '12px',
                            fontWeight: 'bold',
                          }}
                        >
                          {t('common.error')}
                        </div>
                      </Col>
                    </Row>
                  </div>

                  {/* Typography Demo */}
                  <div>
                    <Text
                      style={{
                        color: colors.textSecondary,
                        display: 'block',
                        marginBottom: '8px',
                      }}
                    >
                      {t('dashboard.typography')}:
                    </Text>
                    <Space direction='vertical' size='small'>
                      <Title level={1} style={{ color: colors.textPrimary, margin: 0 }}>
                        {t('dashboard.heading1')}
                      </Title>
                      <Title level={2} style={{ color: colors.textPrimary, margin: 0 }}>
                        {t('dashboard.heading2')}
                      </Title>
                      <Text style={{ color: colors.textPrimary, fontSize: '16px' }}>
                        {t('dashboard.bodyText')}
                      </Text>
                      <Text style={{ color: colors.textSecondary, fontSize: '14px' }}>
                        {t('dashboard.secondaryText')}
                      </Text>
                      <Text style={{ color: colors.textSecondary, fontSize: '12px' }}>
                        {t('dashboard.captionText')}
                      </Text>
                    </Space>
                  </div>
                </Space>
              </div>

              {/* Footer */}
              <div style={{ textAlign: 'center', marginTop: '32px' }}>
                <Text style={{ color: colors.textSecondary, fontSize: '12px' }}>
                  {t('dashboard.footer')}
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

/**
 * ControlFin App Component with BlockAI Theme
 *
 * This component provides routing and authentication management
 * with proper theming and component styling.
 */
const App: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <BlockAIThemeProvider>
      <Router>
        <Routes>
          {/* Authentication Routes */}
          <Route path={t('routes.auth')} element={<AuthPage />} />
          <Route path={t('routes.login')} element={<AuthPage initialMode='login' />} />
          <Route path={t('routes.register')} element={<AuthPage initialMode='register' />} />
          <Route path={t('routes.authCallback')} element={<OAuthCallbackPage />} />

          {/* Protected Routes */}
          <Route path={t('routes.dashboard')} element={<Dashboard />} />
          <Route path={t('routes.transactions')} element={<TransactionManagement />} />

          {/* Default Route */}
          <Route path='/' element={<Navigate to={t('routes.auth')} replace />} />
        </Routes>
      </Router>
    </BlockAIThemeProvider>
  );
};

export default App;
// test comment
// test comment

// Test comment for frontend changes

// Test comment for full-stack changes

// Test comment for frontend changes

// Test comment for full-stack changes

// Test comment for frontend changes

// Test comment for full-stack changes

// Test comment for frontend changes

// Test comment for full-stack changes

// Test comment for frontend changes

// Test comment for full-stack changes

// Test comment for frontend changes

// Test comment for full-stack changes

// Test comment for frontend changes

// Test comment for full-stack changes
