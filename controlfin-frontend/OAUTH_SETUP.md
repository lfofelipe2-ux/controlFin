# Configuração do Google OAuth - ControlFin

Este guia explica como configurar o Google OAuth para o ControlFin.

## 🚀 Configuração Rápida

### 1. Criar Projeto no Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a **Google+ API** (ou **Google Identity API**)

### 2. Configurar OAuth 2.0

1. Vá em **APIs & Services** → **Credentials**
2. Clique em **Create Credentials** → **OAuth 2.0 Client ID**
3. Configure:
   - **Application type**: Web application
   - **Name**: ControlFin Development
   - **Authorized redirect URIs**:
     - `http://localhost:3001/auth/callback` (desenvolvimento)
     - `https://yourdomain.com/auth/callback` (produção)

### 3. Configurar Variáveis de Ambiente

1. Copie o arquivo de exemplo:

   ```bash
   cp env.example .env
   ```

2. Edite o arquivo `.env` e configure:
   ```env
   VITE_GOOGLE_CLIENT_ID=seu_client_id_aqui
   ```

### 4. Reiniciar o Servidor

```bash
npm run dev
```

## 🔧 Configuração Detalhada

### Variáveis de Ambiente

| Variável                | Descrição                 | Exemplo                                |
| ----------------------- | ------------------------- | -------------------------------------- |
| `VITE_GOOGLE_CLIENT_ID` | Client ID do Google OAuth | `123456789.apps.googleusercontent.com` |
| `VITE_API_BASE_URL`     | URL base da API           | `http://localhost:3000/api`            |

### URIs de Redirecionamento

Para diferentes ambientes, configure as seguintes URIs:

- **Desenvolvimento**: `http://localhost:3001/auth/callback`
- **Staging**: `https://staging.controlfin.com/auth/callback`
- **Produção**: `https://controlfin.com/auth/callback`

## 🐛 Solução de Problemas

### Erro: "Google Client ID not configured"

**Causa**: A variável `VITE_GOOGLE_CLIENT_ID` não está configurada.

**Solução**:

1. Verifique se o arquivo `.env` existe
2. Confirme se a variável está definida corretamente
3. Reinicie o servidor de desenvolvimento

### Erro: "redirect_uri_mismatch"

**Causa**: A URI de redirecionamento não está configurada no Google Cloud Console.

**Solução**:

1. Acesse o Google Cloud Console
2. Vá em **Credentials** → Seu OAuth Client
3. Adicione a URI correta em **Authorized redirect URIs**

### Warning: "antd v5 support React is 16 ~ 18"

**Causa**: Incompatibilidade de versão entre Ant Design e React 19.

**Solução**: Este warning é conhecido e não afeta a funcionalidade. Foi configurado para ser suprimido no `vite.config.ts`.

## 📝 Notas Importantes

- **Nunca commite** o arquivo `.env` com credenciais reais
- Use diferentes Client IDs para desenvolvimento e produção
- Mantenha as credenciais seguras e não as compartilhe
- O Client ID é público e pode ser exposto no frontend

## 🔒 Segurança

- O Client ID é público e seguro para uso no frontend
- O Client Secret deve ser mantido apenas no backend
- Use HTTPS em produção para proteger as credenciais
- Configure CORS adequadamente no Google Cloud Console

## 📚 Recursos Adicionais

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Ant Design React 19 Compatibility](https://ant.design/docs/react/compatibility)
