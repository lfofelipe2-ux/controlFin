# 🔐 Tutorial: Configuração do Google OAuth 2.0

Este tutorial detalha o processo completo de configuração do Google OAuth 2.0 para o ControlFin.

## 📋 Pré-requisitos

- Conta Google (Gmail)
- Projeto no Google Cloud Console
- Acesso de administrador ao projeto

## 🚀 Passo 1: Criar Projeto no Google Cloud Console

### 1.1 Acesse o Console

1. Abra seu navegador e vá para:

   ```
   https://console.cloud.google.com/
   ```

2. Faça login com sua conta Google

3. Se necessário, crie uma organização ou use "No organization"

### 1.2 Criar Novo Projeto

1. No canto superior esquerdo, clique em **"Select a project"**
2. Clique em **"New Project"**
3. Configure:
   - **Project name**: `ControlFin` ou `ControlFin-Dev`
   - **Organization**: (opcional)
   - **Location**: (qualquer região)
4. Clique em **"Create"**

### 1.3 Aguardar Criação

- O projeto será criado em alguns segundos
- Você será redirecionado para a página do projeto

## 🔧 Passo 2: Configurar Google+ API

### 2.1 Ativar API

1. No menu lateral, vá em **"APIs & Services"** → **"Library"**
2. Na barra de pesquisa, digite **"Google People API"**
3. Clique no resultado **"Google People API"**
4. Clique em **"Enable"**

### 2.2 Verificar Ativação

1. Volte para **"APIs & Services"** → **"Library"**
2. Clique em **"Manage"** (canto superior direito)
3. Verifique se **"Google People API"** aparece como "Enabled"

## ⚙️ Passo 3: Criar Credenciais OAuth 2.0

### 3.1 Ir para Credentials

1. Vá em **"APIs & Services"** → **"Credentials"**
2. Clique em **"Create Credentials"** → **"OAuth 2.0 Client ID"**

### 3.2 Configurar Aplicação

1. **Application type**: Selecione **"Web application"**
2. **Name**: Digite `ControlFin Development`
3. **Authorized JavaScript origins**:
   - Adicione: `http://localhost:5173`
4. **Authorized redirect URIs**:
   - Adicione: `http://localhost:5173/auth/callback`

### 3.3 Criar Credenciais

1. Clique em **"Create"**
2. Anote o **Client ID** e **Client Secret**
3. Guarde em local seguro (será usado nas variáveis de ambiente)

## 🌍 Passo 4: Configurar no Projeto

### 4.1 Frontend Configuration

1. **Copiar arquivo de exemplo**:

   ```bash
   cd controlfin-frontend
   cp env.example .env
   ```

2. **Editar `.env`**:
   ```bash
   VITE_GOOGLE_CLIENT_ID=SEU_CLIENT_ID_AQUI
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

### 4.2 Backend Configuration

1. **Copiar arquivo de exemplo**:

   ```bash
   cd controlfin-backend
   cp env.example .env
   ```

2. **Editar `.env`**:
   ```bash
   GOOGLE_CLIENT_ID=SEU_CLIENT_ID_AQUI
   GOOGLE_CLIENT_SECRET=SEU_CLIENT_SECRET_AQUI
   GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback
   ```

## 🧪 Passo 5: Testar Configuração

### 5.1 Iniciar Servidores

```bash
# Terminal 1 - Backend
cd controlfin-backend
npm run dev

# Terminal 2 - Frontend
cd controlfin-frontend
npm run dev
```

### 5.2 Testar OAuth

1. Abra `http://localhost:5173`
2. Clique em **"Sign in with Google"**
3. Verifique se:
   - Redireciona para Google
   - Permite seleção de conta
   - Retorna para `/auth/callback`
   - Exibe mensagem de sucesso
   - Redireciona para dashboard

### 5.3 Verificar Logs

**Backend logs devem mostrar**:

```
✅ Google OAuth callback received
✅ User profile retrieved successfully
✅ JWT token generated
✅ User authenticated
```

**Frontend console deve mostrar**:

```
✅ OAuth callback processed
✅ User data received
✅ Authentication successful
✅ Redirecting to dashboard
```

## 🔧 Passo 6: Configuração de Produção

### 6.1 Adicionar URIs de Produção

1. Volte ao Google Cloud Console
2. Vá em **"APIs & Services"** → **"Credentials"**
3. Clique no seu OAuth Client
4. Adicione **Authorized redirect URIs**:
   - `https://seu-dominio.com/auth/callback`
   - `https://www.seu-dominio.com/auth/callback`

### 6.2 Configurar no Vercel/Render

**Vercel (Frontend)**:

- Vá em `https://vercel.com/dashboard`
- Selecione seu projeto
- Vá em **"Settings"** → **"Environment Variables"**
- Adicione:
  ```
  VITE_API_BASE_URL=https://seu-backend-domain.com/api
  VITE_GOOGLE_CLIENT_ID=SEU_CLIENT_ID_AQUI
  ```

**Render (Backend)**:

- Configure as variáveis de ambiente no painel do Render
- Todas as variáveis do `.env` devem ser configuradas

## 🐛 Solução de Problemas

### Problema 1: "Google Client ID not configured"

**Causa**: `VITE_GOOGLE_CLIENT_ID` não configurado
**Solução**:

1. Verifique se `.env` existe no frontend
2. Confirme se `VITE_GOOGLE_CLIENT_ID` está definido
3. Reinicie o servidor de desenvolvimento

### Problema 2: "redirect_uri_mismatch"

**Causa**: URI de redirecionamento não configurada no Google
**Solução**:

1. Verifique se a URI está em **"Authorized redirect URIs"**
2. Use exatamente: `http://localhost:5173/auth/callback`
3. Aguarde 5-10 minutos para propagação

### Problema 3: "Invalid client"

**Causa**: Client ID incorreto
**Solução**:

1. Verifique se está usando o Client ID correto
2. Não use o Client Secret no frontend
3. Verifique se não há espaços ou caracteres especiais

### Problema 4: "Access blocked"

**Causa**: Google+ API não ativada
**Solução**:

1. Verifique se **"Google People API"** está ativada
2. Vá em **"APIs & Services"** → **"Library"**
3. Procure por **"Google People API"** e ative

## 📊 Verificação Final

### Executar Validação

```bash
# Validar configurações
npm run validate:config

# Gerar JWT secret se necessário
npm run generate:jwt
```

### Checklist de Verificação

- [ ] Projeto criado no Google Cloud Console
- [ ] Google People API ativada
- [ ] OAuth 2.0 Client ID criado
- [ ] Client ID e Client Secret anotados
- [ ] URIs de redirecionamento configuradas
- [ ] Arquivos `.env` criados e configurados
- [ ] Servidores iniciam sem erros
- [ ] OAuth flow funciona corretamente
- [ ] Logs mostram autenticação bem-sucedida

## 🎉 Configuração Completa!

Após seguir todos os passos, o Google OAuth 2.0 estará funcionando corretamente no ControlFin.

**Próximos passos**:

1. Teste o fluxo completo de autenticação
2. Configure MongoDB Atlas (próximo tutorial)
3. Teste a integração frontend-backend

## 📞 Suporte

Para problemas, consulte:

- **Guia Principal**: `docs/CONFIGURATION_GUIDE.md`
- **Validação**: `npm run validate:config`
- **Documentação Google**: https://developers.google.com/identity/protocols/oauth2

---

**Tutorial criado em**: 2025-10-05
**Versão**: 1.0.0
**Status**: ✅ Completo e verificado
