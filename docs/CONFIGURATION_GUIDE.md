# 📋 Guia de Configurações - ControlFin

Este guia centraliza todas as configurações necessárias para o projeto ControlFin funcionar corretamente. Siga os passos em ordem para configurar desenvolvimento, produção e integração com serviços externos.

## 🚀 Configurações Pendentes Identificadas

### 🔴 **CRÍTICAS** (Devem ser configuradas primeiro)

1. **Google OAuth 2.0** - Autenticação de usuários
2. **MongoDB Atlas** - Banco de dados principal

### 🟡 **IMPORTANTES** (Configurar após as críticas)

3. **Variáveis de Ambiente** - Frontend e Backend
4. **CI/CD Pipeline** - Secrets e configurações

---

## 1. 🔐 Google OAuth 2.0 Configuration

### 1.1 Criar Projeto no Google Cloud Console

1. **Acesse o Google Cloud Console**:

   ```
   https://console.cloud.google.com/
   ```

2. **Criar Novo Projeto**:
   - Clique em "Select a project" → "New Project"
   - Nome: `ControlFin` ou `ControlFin-Dev`
   - Organização: (opcional)
   - Localização: (qualquer)
   - Clique em "Create"

3. **Ativar APIs**:
   - Vá em "APIs & Services" → "Library"
   - Procure por "Google+ API" ou "Google People API"
   - Clique em "Enable"

### 1.2 Configurar OAuth 2.0 Credentials

1. **Ir para Credentials**:

   ```
   APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID
   ```

2. **Configurar Aplicação**:
   - **Application type**: Web application
   - **Name**: ControlFin Development
   - **Authorized JavaScript origins**:
     - `http://localhost:5173` (desenvolvimento)
   - **Authorized redirect URIs**:
     - `http://localhost:5173/auth/callback` (desenvolvimento)
     - `https://your-domain.com/auth/callback` (produção)

3. **Obter Credenciais**:
   - Anote o **Client ID** e **Client Secret**
   - Guarde em local seguro (serão usados nas variáveis de ambiente)

### 1.3 Configurar no Projeto

#### Frontend (`.env`)

```bash
# controlfin-frontend/.env
VITE_GOOGLE_CLIENT_ID=seu_client_id_aqui
VITE_API_BASE_URL=http://localhost:3000/api
```

#### Backend (`.env`)

```bash
# controlfin-backend/.env
GOOGLE_CLIENT_ID=seu_client_id_aqui
GOOGLE_CLIENT_SECRET=seu_client_secret_aqui
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback
```

---

## 2. 🗄️ MongoDB Atlas Configuration

### 2.1 Criar Conta e Cluster

1. **Acesse MongoDB Atlas**:

   ```
   https://www.mongodb.com/atlas
   ```

2. **Criar Conta Gratuita**:
   - Clique em "Try Free"
   - Registre-se com e-mail ou Google

3. **Criar Cluster**:
   - Escolha "Free" tier (M0 Sandbox)
   - Provider: AWS
   - Region: Escolha a mais próxima (ex: us-east-1)
   - Cluster Name: `ControlFin-Cluster`
   - Clique em "Create Cluster"

4. **Aguardar Provisionamento**:
   - Pode levar 5-10 minutos
   - Não feche a página

### 2.2 Configurar Segurança

1. **Criar Usuário de Banco**:
   - Vá em "Database Access" → "Add New Database User"
   - **Authentication Method**: Password
   - **Username**: `controlfin_user`
   - **Password**: Crie senha forte (guarde em local seguro)
   - **Database User Privileges**: "Read and write to any database"

2. **Configurar Network Access**:
   - Vá em "Network Access" → "Add IP Address"
   - **Access List Entry**: `0.0.0.0/0` (para desenvolvimento)
   - Para produção: use IP específico ou `Allow Access from Anywhere`

3. **Obter Connection String**:
   - Vá em "Clusters" → "Connect" → "Connect your application"
   - Escolha "Driver" → "Node.js" → Versão atual
   - Copie a connection string

### 2.3 Configurar no Projeto

#### Backend (`.env`)

```bash
# controlfin-backend/.env
MONGODB_URI=mongodb+srv://controlfin_user:sua_senha_aqui@controlfin-cluster.mongodb.net/controlfin?retryWrites=true&w=majority
```

**Substitua**:

- `controlfin_user` → seu usuário criado
- `sua_senha_aqui` → sua senha criada
- `controlfin-cluster.mongodb.net` → seu cluster URL
- `controlfin` → nome do banco de dados (pode manter)

---

## 3. 🌍 Variáveis de Ambiente

### 3.1 Frontend Configuration

1. **Copiar arquivo de exemplo**:

   ```bash
   cd controlfin-frontend
   cp env.example .env
   ```

2. **Editar `.env`**:
   ```bash
   # Frontend Environment Variables
   VITE_API_BASE_URL=http://localhost:3000/api
   VITE_GOOGLE_CLIENT_ID=seu_client_id_aqui
   VITE_APP_NAME=ControlFin
   VITE_APP_VERSION=1.0.0
   VITE_NODE_ENV=development
   VITE_DEBUG_OAUTH=true
   VITE_MOCK_OAUTH=false
   ```

### 3.2 Backend Configuration

1. **Copiar arquivo de exemplo**:

   ```bash
   cd controlfin-backend
   cp env.example .env
   ```

2. **Editar `.env`**:

   ```bash
   # Server Configuration
   NODE_ENV=development
   PORT=3000

   # Database
   MONGODB_URI=mongodb+srv://controlfin_user:sua_senha_aqui@controlfin-cluster.mongodb.net/controlfin?retryWrites=true&w=majority

   # JWT Configuration
   JWT_SECRET=seu_jwt_secret_muito_seguro_aqui
   JWT_EXPIRES_IN=15m
   REFRESH_TOKEN_EXPIRES_IN=7d

   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=seu_client_id_aqui
   GOOGLE_CLIENT_SECRET=seu_client_secret_aqui
   GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback

   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:5173

   # Rate Limiting
   RATE_LIMIT_MAX=100
   RATE_LIMIT_WINDOW_MS=60000

   # Security
   BCRYPT_ROUNDS=10
   ```

### 3.3 Gerar JWT Secret Seguro

```bash
# Gere um secret seguro (execute no terminal)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 4. 🔧 Configuração de Desenvolvimento

### 4.1 Instalar Dependências

```bash
# Frontend
cd controlfin-frontend
npm install

# Backend
cd ../controlfin-backend
npm install
```

### 4.2 Executar em Desenvolvimento

```bash
# Terminal 1 - Backend
cd controlfin-backend
npm run dev

# Terminal 2 - Frontend
cd controlfin-frontend
npm run dev
```

### 4.3 Verificar Configurações

```bash
# Verificar se variáveis estão carregadas
cd controlfin-frontend
npm run validate:i18n

cd controlfin-backend
npm run build
```

---

## 5. 🚀 Configuração de Produção

### 5.1 Vercel (Frontend)

1. **Fazer Deploy Inicial**:

   ```bash
   cd controlfin-frontend
   npm install -g vercel
   vercel --prod
   ```

2. **Configurar Environment Variables no Vercel**:
   - Vá em `https://vercel.com/dashboard`
   - Selecione seu projeto
   - Vá em "Settings" → "Environment Variables"
   - Adicione:
     ```
     VITE_API_BASE_URL=https://your-backend-domain.com/api
     VITE_GOOGLE_CLIENT_ID=seu_client_id_aqui
     ```

### 5.2 Render (Backend)

1. **Fazer Deploy Inicial**:

   ```bash
   cd controlfin-backend
   npm install -g render-cli
   # Conecte com sua conta Render
   ```

2. **Configurar Environment Variables no Render**:
   - Todas as variáveis do `.env` devem ser configuradas
   - **IMPORTANTE**: Nunca commite `.env` com valores reais

---

## 6. 🔍 Verificação e Troubleshooting

### 6.1 Testar Google OAuth

1. **Iniciar servidores**:

   ```bash
   # Backend
   cd controlfin-backend && npm run dev

   # Frontend
   cd controlfin-frontend && npm run dev
   ```

2. **Testar fluxo**:
   - Abra `http://localhost:5173`
   - Clique em "Sign in with Google"
   - Verifique se redireciona corretamente
   - Verifique logs do backend para erros

### 6.2 Testar Banco de Dados

```bash
# Testar conexão MongoDB
cd controlfin-backend
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Erro:', err.message));
"
```

### 6.3 Problemas Comuns

#### **Erro: "Google Client ID not configured"**

- ✅ Verifique se `VITE_GOOGLE_CLIENT_ID` está no `.env`
- ✅ Reinicie o servidor de desenvolvimento
- ✅ Verifique se não há espaços ou caracteres especiais

#### **Erro: "MongoDB connection failed"**

- ✅ Verifique se `MONGODB_URI` está correta
- ✅ Teste a connection string no MongoDB Compass
- ✅ Verifique se o IP está permitido no Atlas

#### **Erro: "CORS error"**

- ✅ Verifique se `FRONTEND_URL` no backend está correto
- ✅ Reinicie ambos os servidores

---

## 7. 📜 Scripts de Validação

### 7.1 Verificar Configurações

```bash
# Frontend
cd controlfin-frontend
npm run validate:i18n
npm run validate:hardcoded

# Backend
cd controlfin-backend
npm run build
npm run test
```

### 7.2 Teste de Integração

```bash
# Execute o script de teste manual
cd controlfin-frontend
node scripts/manual-i18n-test.js
```

### 7.3 Verificar OAuth

```bash
# Teste o fluxo OAuth
cd controlfin-frontend
node scripts/test-oauth-flow.js
```

---

## 8. 🔒 Segurança

### 8.1 Boas Práticas

- ✅ **Nunca commite** arquivos `.env` com valores reais
- ✅ **Use HTTPS** em produção
- ✅ **Configure CORS** adequadamente
- ✅ **Use secrets fortes** para JWT
- ✅ **Limite rate limiting** para prevenir abuso

### 8.2 Secrets no GitHub

Para produção, configure no GitHub Secrets:

```bash
# Frontend (Vercel)
VITE_API_BASE_URL=https://your-backend-domain.com/api
VITE_GOOGLE_CLIENT_ID=seu_client_id_aqui

# Backend (Render)
MONGODB_URI=sua_connection_string_aqui
JWT_SECRET=seu_jwt_secret_aqui
GOOGLE_CLIENT_ID=seu_client_id_aqui
GOOGLE_CLIENT_SECRET=seu_client_secret_aqui
```

---

## 9. 📊 Status das Configurações

| Configuração          | Status      | Última Verificação | Notas                              |
| --------------------- | ----------- | ------------------ | ---------------------------------- |
| Google OAuth 2.0      | 🔴 Pendente | -                  | Precisa configuração inicial       |
| MongoDB Atlas         | 🔴 Pendente | -                  | Precisa criação de conta           |
| Variáveis de Ambiente | 🟡 Parcial  | -                  | Arquivos .env precisam ser criados |
| CI/CD Pipeline        | 🟢 OK       | 2025-10-04         | Sistema funcionando                |
| i18n System           | 🟢 OK       | 2025-10-04         | 151 chaves traduzidas              |

---

## 10. 🎯 Próximos Passos

### **Imediatos (Hoje)**

1. [ ] Configurar Google OAuth 2.0 (30-45 min)
2. [ ] Configurar MongoDB Atlas (15-20 min)
3. [ ] Criar arquivos .env (10-15 min)
4. [ ] Testar configurações básicas (15-20 min)

### **Curto Prazo (Esta Semana)**

1. [ ] Configurar produção (Vercel + Render)
2. [ ] Testar integração completa
3. [ ] Documentar configurações específicas

### **Médio Prazo (Este Mês)**

1. [ ] Configurar domínio customizado
2. [ ] Configurar SSL certificates
3. [ ] Otimizar configurações de produção

---

## 📞 Suporte e Ajuda

### Recursos Disponíveis

- **Documentação Técnica**: `memory-bank/techContext.md`
- **OAuth Setup**: `controlfin-frontend/OAUTH_SETUP.md`
- **Validação i18n**: `controlfin-frontend/VALIDATION.md`
- **Scripts de Teste**: `controlfin-frontend/scripts/`

### Problemas Comuns

- **OAuth não funciona**: Verifique Client ID e redirect URIs
- **Banco não conecta**: Verifique connection string e network access
- **Build falha**: Verifique variáveis de ambiente

### Contato

Para dúvidas sobre configurações, consulte a documentação técnica ou abra uma issue no repositório.

---

**Última Atualização**: 2025-10-05
**Versão**: 1.0.0
**Status**: Configurações documentadas e prontas para implementação

**🎯 Este guia serve como fonte única da verdade para todas as configurações do ControlFin.**
