/**
 * OAuth Configuration Warning Component
 *
 * Shows a helpful warning when Google OAuth is not properly configured,
 * with clear instructions for developers.
 */

import { GoogleOutlined, SettingOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Space, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

const { Title, Text, Paragraph } = Typography;

interface OAuthConfigWarningProps {
  onConfigure?: () => void;
  className?: string;
}

const OAuthConfigWarning: React.FC<OAuthConfigWarningProps> = ({ onConfigure, className = '' }) => {
  const { t } = useTranslation('common');

  const handleConfigure = () => {
    if (onConfigure) {
      onConfigure();
    } else {
      // Abrir documentação de configuração
      window.open('https://console.cloud.google.com/', '_blank');
    }
  };

  return (
    <Card className={`oauth-config-warning ${className}`} style={{ margin: '16px 0' }}>
      <Space direction='vertical' size='middle' style={{ width: '100%' }}>
        <Alert
          message='Google OAuth não configurado'
          description='Para usar o login com Google, você precisa configurar um Client ID.'
          type='warning'
          showIcon
          icon={<GoogleOutlined />}
        />

        <div>
          <Title level={4}>Como configurar:</Title>
          <ol>
            <li>
              <Text>
                Acesse o <Text code>Google Cloud Console</Text>
              </Text>
            </li>
            <li>
              <Text>Crie um novo projeto ou selecione um existente</Text>
            </li>
            <li>
              <Text>
                Ative a <Text code>Google+ API</Text>
              </Text>
            </li>
            <li>
              <Text>
                Vá em <Text code>Credenciais</Text> → <Text code>Criar credenciais</Text> →{' '}
                <Text code>ID do cliente OAuth 2.0</Text>
              </Text>
            </li>
            <li>
              <Text>
                Configure as URIs de redirecionamento:{' '}
                <Text code>http://localhost:3001/auth/callback</Text>
              </Text>
            </li>
            <li>
              <Text>
                Copie o Client ID e configure a variável <Text code>VITE_GOOGLE_CLIENT_ID</Text> no
                arquivo <Text code>.env</Text>
              </Text>
            </li>
          </ol>
        </div>

        <Space>
          <Button type='primary' icon={<SettingOutlined />} onClick={handleConfigure}>
            Abrir Google Cloud Console
          </Button>
          <Button type='default' onClick={() => window.location.reload()}>
            Recarregar após configurar
          </Button>
        </Space>

        <Paragraph type='secondary' style={{ fontSize: '12px', margin: 0 }}>
          <Text code>Dica:</Text> Você pode copiar o arquivo <Text code>env.example</Text> para{' '}
          <Text code>.env</Text> e configurar suas credenciais.
        </Paragraph>
      </Space>
    </Card>
  );
};

export default OAuthConfigWarning;
