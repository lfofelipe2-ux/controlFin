import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Typography } from 'antd';
import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { AuthPage } from './components/auth';
import BlockAIThemeProvider from './components/BlockAIThemeProvider';
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
                  ControlFin Dashboard
                </Title>
                <Paragraph
                  style={{
                    color: colors.textSecondary,
                    fontSize: typography.sizes.desktop.body,
                    marginBottom: '32px',
                  }}
                >
                  Welcome to your personal finance management dashboard
                </Paragraph>
              </div>

              {/* Theme Demo */}
              <div>
                <Title level={3} style={{ color: colors.textPrimary, marginBottom: '16px' }}>
                  BlockAI Design System Demo
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
                      Button Components:
                    </Text>
                    <Space wrap>
                      <Button type='primary' icon={<UserOutlined />}>
                        Primary Button
                      </Button>
                      <Button icon={<MailOutlined />}>Default Button</Button>
                      <Button type='text' icon={<LockOutlined />}>
                        Text Button
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
                      Color Palette:
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
                          Primary
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
                          Success
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
                          Warning
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
                          Error
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
                      Typography:
                    </Text>
                    <Space direction='vertical' size='small'>
                      <Title level={1} style={{ color: colors.textPrimary, margin: 0 }}>
                        Heading 1 - Inter Semibold
                      </Title>
                      <Title level={2} style={{ color: colors.textPrimary, margin: 0 }}>
                        Heading 2 - Inter Semibold
                      </Title>
                      <Text style={{ color: colors.textPrimary, fontSize: '16px' }}>
                        Body Text - Inter Regular
                      </Text>
                      <Text style={{ color: colors.textSecondary, fontSize: '14px' }}>
                        Secondary Text - Inter Regular
                      </Text>
                      <Text style={{ color: colors.textSecondary, fontSize: '12px' }}>
                        Caption Text - Inter Light
                      </Text>
                    </Space>
                  </div>
                </Space>
              </div>

              {/* Footer */}
              <div style={{ textAlign: 'center', marginTop: '32px' }}>
                <Text style={{ color: colors.textSecondary, fontSize: '12px' }}>
                  © 2025 ControlFin - Built with BlockAI Design System
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
  return (
    <BlockAIThemeProvider>
      <Router>
        <Routes>
          {/* Authentication Routes */}
          <Route path='/auth' element={<AuthPage />} />
          <Route path='/login' element={<AuthPage initialMode='login' />} />
          <Route path='/register' element={<AuthPage initialMode='register' />} />
          <Route path='/auth/callback' element={<OAuthCallbackPage />} />

          {/* Protected Routes */}
          <Route path='/dashboard' element={<Dashboard />} />

          {/* Default Route */}
          <Route path='/' element={<Navigate to='/auth' replace />} />
        </Routes>
      </Router>
    </BlockAIThemeProvider>
  );
};

export default App;
