# 🚀 Tutorial: Configuração de Produção - ControlFin

Este tutorial detalha o processo completo de configuração de produção para o ControlFin, incluindo deploy no Vercel (Frontend) e Render (Backend).

## 📋 Pré-requisitos

- ✅ Google OAuth 2.0 configurado
- ✅ MongoDB Atlas configurado
- ✅ Arquivos `.env` criados e configurados
- ✅ Contas no Vercel e Render

## 🌍 Passo 1: Configuração do Vercel (Frontend)

### 1.1 Criar Conta no Vercel

1. Acesse `https://vercel.com`
2. Clique em **"Sign Up"**
3. Use sua conta GitHub ou e-mail

### 1.2 Conectar Repositório

1. Clique em **"Import Project"**
2. Conecte com seu GitHub
3. Selecione o repositório `controlfin-frontend`

### 1.3 Configurar Deploy

1. **Build Settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

2. **Environment Variables**:
   - Adicione as variáveis do `.env`:
     ```
     VITE_API_BASE_URL=https://seu-backend-domain.com/api
     VITE_GOOGLE_CLIENT_ID=seu_client_id_aqui
     ```

### 1.4 Deploy Inicial

1. Clique em **"Deploy"**
2. Aguarde o primeiro deploy (2-3 minutos)
3. Anote a URL do deploy (ex: `https://seu-projeto.vercel.app`)

## 🖥️ Passo 2: Configuração do Render (Backend)

### 2.1 Criar Conta no Render

1. Acesse `https://render.com`
2. Clique em **"Sign Up"**
3. Use sua conta GitHub ou e-mail

### 2.2 Criar Web Service

1. Clique em **"New"** → **"Web Service"**
2. Conecte com seu GitHub
3. Selecione o repositório `controlfin-backend`

### 2.3 Configurar Serviço

1. **Service Settings**:
   - Name: `controlfin-backend`
   - Runtime: `Node.js`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`

2. **Environment Variables**:
   - Adicione TODAS as variáveis do `.env`:
     ```bash
     NODE_ENV=production
     PORT=3000
     MONGODB_URI=sua_connection_string_aqui
     JWT_SECRET=seu_jwt_secret_aqui
     GOOGLE_CLIENT_ID=seu_client_id_aqui
     GOOGLE_CLIENT_SECRET=seu_client_secret_aqui
     FRONTEND_URL=https://seu-frontend-domain.vercel.app
     ```

### 2.4 Deploy Inicial

1. Clique em **"Create Web Service"**
2. Aguarde o deploy (5-10 minutos)
3. Anote a URL do serviço (ex: `https://seu-backend.onrender.com`)

## 🔧 Passo 3: Configurar Domínio Customizado

### 3.1 Comprar Domínio

1. **Recomendação**: Namecheap, GoDaddy, ou Registro.br
2. **Domínio sugerido**: `controlfin.app` ou `myfinances.app`
3. **Custo**: ~R$ 50-100/ano

### 3.2 Configurar no Vercel

1. Vá em **"Settings"** → **"Domains"**
2. Adicione seu domínio customizado
3. Configure os registros DNS conforme instruções do Vercel

### 3.3 Configurar no Render

1. Vá em **"Settings"** → **"Custom Domains"**
2. Adicione seu domínio customizado
3. Configure os registros DNS conforme instruções do Render

## 🔒 Passo 4: Configurar SSL e Segurança

### 4.1 SSL Certificates

1. **Vercel**: SSL automático incluído
2. **Render**: SSL automático incluído
3. **Domínio Customizado**: Certificados SSL automáticos

### 4.2 Security Headers

1. **Backend Security**:
   - CORS configurado para domínios permitidos
   - Rate limiting ativo
   - Helmet middleware configurado

2. **Frontend Security**:
   - Content Security Policy
   - HTTPS enforcement
   - Secure headers

## 🌐 Passo 5: Configurar Google OAuth para Produção

### 5.1 Adicionar URIs de Produção

1. Volte ao Google Cloud Console
2. Vá em **"APIs & Services"** → **"Credentials"**
3. Clique no seu OAuth Client
4. Adicione **Authorized redirect URIs**:
   - `https://seu-dominio.com/auth/callback`
   - `https://www.seu-dominio.com/auth/callback`

### 5.2 Atualizar Environment Variables

**Vercel (Frontend)**:

```bash
VITE_API_BASE_URL=https://seu-backend-domain.com/api
VITE_GOOGLE_CLIENT_ID=seu_client_id_aqui
```

**Render (Backend)**:

```bash
GOOGLE_REDIRECT_URI=https://seu-frontend-domain.com/auth/callback
FRONTEND_URL=https://seu-frontend-domain.com
```

## 🧪 Passo 6: Testar Configuração de Produção

### 6.1 Teste Básico

1. Abra sua URL de produção
2. Verifique se a aplicação carrega
3. Teste o fluxo de autenticação
4. Verifique se não há erros no console

### 6.2 Teste Google OAuth

1. Clique em **"Sign in with Google"**
2. Verifique se redireciona para Google
3. Complete o fluxo de autenticação
4. Verifique se volta para a aplicação

### 6.3 Teste Backend API

```bash
# Teste a API de produção
curl https://seu-backend-domain.com/api/health
```

## 📊 Passo 7: Configurar Monitoramento

### 7.1 Vercel Analytics

1. No painel do Vercel, vá em **"Analytics"**
2. Configure tracking de performance
3. Monitore erros e performance

### 7.2 Render Monitoring

1. No painel do Render, vá em **"Logs"**
2. Configure alertas para erros
3. Monitore métricas de performance

### 7.3 MongoDB Atlas Monitoring

1. No painel do Atlas, configure **"Alerts"**
2. Configure alertas para:
   - CPU usage > 80%
   - Memory usage > 80%
   - Connection count > 100

## 🚀 Passo 8: Configurar CI/CD para Produção

### 8.1 Deploy Automático

1. **Vercel**: Deploy automático em push para main
2. **Render**: Deploy automático em push para main
3. **GitHub Actions**: CI/CD pipeline configurado

### 8.2 Environment Variables no GitHub

Configure no GitHub Secrets para produção:

```bash
# Frontend (Vercel)
VITE_API_BASE_URL=https://seu-backend-domain.com/api
VITE_GOOGLE_CLIENT_ID=seu_client_id_aqui

# Backend (Render)
MONGODB_URI=sua_connection_string_producao
JWT_SECRET=seu_jwt_secret_producao
GOOGLE_CLIENT_ID=seu_client_id_aqui
GOOGLE_CLIENT_SECRET=seu_client_secret_aqui
```

## 🐛 Solução de Problemas

### Problema 1: Deploy Falha

**Causa**: Variáveis de ambiente não configuradas
**Solução**:

1. Verifique se todas as variáveis estão no painel do Vercel/Render
2. Reinicie o deploy manualmente
3. Verifique logs para erros específicos

### Problema 2: OAuth não Funciona

**Causa**: URIs de produção não configuradas no Google
**Solução**:

1. Adicione as URIs de produção no Google Cloud Console
2. Aguarde 5-10 minutos para propagação
3. Teste novamente

### Problema 3: CORS Error

**Causa**: FRONTEND_URL incorreta no backend
**Solução**:

1. Verifique se FRONTEND_URL está correta no Render
2. Reinicie o serviço do backend
3. Teste novamente

### Problema 4: MongoDB Connection Failed

**Causa**: Network access não configurado para produção
**Solução**:

1. No MongoDB Atlas, adicione o IP do Render
2. Ou configure `0.0.0.0/0` para Allow Anywhere
3. Reinicie o serviço do backend

## 📊 Verificação Final

### Executar Testes de Produção

```bash
# Teste configurações
npm run validate:config

# Teste MongoDB
npm run test:mongodb

# Teste deploy
# Verifique se a aplicação está rodando na URL de produção
```

### Checklist de Verificação

- [ ] Vercel deploy funcionando
- [ ] Render deploy funcionando
- [ ] Domínio customizado configurado (opcional)
- [ ] SSL certificates ativos
- [ ] Google OAuth funcionando em produção
- [ ] MongoDB Atlas conectado
- [ ] Monitoramento configurado
- [ ] CI/CD pipeline funcionando

## 🎉 Configuração Completa!

Após seguir todos os passos, o ControlFin estará rodando em produção com:

- ✅ Frontend no Vercel
- ✅ Backend no Render
- ✅ Banco de dados no MongoDB Atlas
- ✅ Autenticação com Google OAuth
- ✅ SSL e segurança configurados
- ✅ Monitoramento ativo

## 📞 Suporte

Para problemas em produção:

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Render Dashboard**: https://dashboard.render.com
- **MongoDB Atlas**: https://cloud.mongodb.com
- **Google Cloud Console**: https://console.cloud.google.com

### Logs Importantes

- **Frontend**: Vercel Function Logs
- **Backend**: Render Service Logs
- **Database**: MongoDB Atlas Logs
- **OAuth**: Google Cloud Console Logs

---

**Tutorial criado em**: 2025-10-05
**Versão**: 1.0.0
**Status**: ✅ Completo e verificado
