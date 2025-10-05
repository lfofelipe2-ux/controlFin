# 🗄️ Tutorial: Configuração do MongoDB Atlas

Este tutorial detalha o processo completo de configuração do MongoDB Atlas para o ControlFin.

## 📋 Pré-requisitos

- Conta MongoDB (gratuita disponível)
- Cartão de crédito (não cobrado no tier gratuito)
- Conhecimento básico de banco de dados

## 🚀 Passo 1: Criar Conta no MongoDB Atlas

### 1.1 Acesse MongoDB Atlas

1. Abra seu navegador e vá para:

   ```
   https://www.mongodb.com/atlas
   ```

2. Clique em **"Try Free"** ou **"Get started free"**

3. **Criar conta**:
   - Use e-mail e senha
   - Ou faça login com Google/GitHub

### 1.2 Verificar E-mail

- Verifique seu e-mail para confirmar a conta
- Clique no link de verificação

## 🏗️ Passo 2: Criar Cluster

### 2.1 Escolher Plano

1. Na tela inicial, clique em **"Build a Cluster"**
2. Escolha **"Free"** (M0 Sandbox)
3. Selecione **"AWS"** como provider
4. Escolha a região mais próxima:
   - **Brasil**: `sa-east-1` (São Paulo)
   - **EUA**: `us-east-1` (N. Virginia)

### 2.2 Configurar Cluster

1. **Cluster Name**: `ControlFin-Cluster`
2. **Provider & Region**: AWS / sua região escolhida
3. Clique em **"Create Cluster"**

### 2.3 Aguardar Provisionamento

- O cluster pode levar **5-10 minutos** para ser criado
- Não feche a página durante o processo
- Você receberá um e-mail quando estiver pronto

## 🔒 Passo 3: Configurar Segurança

### 3.1 Criar Usuário de Banco

1. No menu lateral, vá em **"Database Access"**
2. Clique em **"Add New Database User"**
3. Configure:
   - **Authentication Method**: Password
   - **Username**: `controlfin_user`
   - **Password**: Crie uma senha forte (mínimo 8 caracteres)
   - **Database User Privileges**: "Read and write to any database"

4. Clique em **"Add User"**
5. **Guarde as credenciais** em local seguro

### 3.2 Configurar Network Access

1. Vá em **"Network Access"** → **"Add IP Address"**
2. Para desenvolvimento, adicione:
   - **Access List Entry**: `0.0.0.0/0` (Allow Access from Anywhere)
   - **Comment**: "Development access"

3. Para produção, use IP específico ou adicione apenas seu IP

## 🌐 Passo 4: Obter Connection String

### 4.1 Acesse o Cluster

1. Vá em **"Clusters"** no menu lateral
2. Clique em **"Connect"** no seu cluster
3. Clique em **"Connect your application"**

### 4.2 Escolher Driver

1. Selecione **"Driver"** → **"Node.js"**
2. Escolha a versão atual do driver
3. Copie a **connection string**

### 4.3 Formato da String

A connection string será algo como:

```
mongodb+srv://controlfin_user:sua_senha_aqui@controlfin-cluster.mongodb.net/controlfin?retryWrites=true&w=majority
```

## 💻 Passo 5: Configurar no Projeto

### 5.1 Backend Configuration

1. **Copiar arquivo de exemplo**:

   ```bash
   cd controlfin-backend
   cp env.example .env
   ```

2. **Editar `.env`**:

   ```bash
   # Database
   MONGODB_URI=mongodb+srv://controlfin_user:sua_senha_aqui@controlfin-cluster.mongodb.net/controlfin?retryWrites=true&w=majority

   # JWT Configuration
   JWT_SECRET=seu_jwt_secret_muito_seguro_aqui
   JWT_EXPIRES_IN=15m
   REFRESH_TOKEN_EXPIRES_IN=7d
   ```

3. **Substitua os valores**:
   - `controlfin_user` → seu usuário criado
   - `sua_senha_aqui` → sua senha criada
   - `controlfin-cluster.mongodb.net` → seu cluster URL
   - `controlfin` → nome do banco (pode manter)
   - `seu_jwt_secret_muito_seguro_aqui` → gere com `npm run generate:jwt`

### 5.2 Gerar JWT Secret

```bash
# Gerar secret seguro
npm run generate:jwt:single
```

## 🧪 Passo 6: Testar Conexão

### 6.1 Teste Básico

```bash
# Testar conexão
cd controlfin-backend
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB conectado com sucesso!'))
  .catch(err => console.error('❌ Erro de conexão:', err.message));
"
```

### 6.2 Teste com Aplicação

```bash
# Iniciar backend
cd controlfin-backend
npm run dev
```

- Verifique se não há erros de conexão no console
- A aplicação deve iniciar normalmente

### 6.3 Verificar no Atlas

1. Vá em **"Clusters"** no MongoDB Atlas
2. Clique em **"Collections"**
3. Verifique se o banco `controlfin` foi criado

## 🚀 Passo 7: Configuração de Produção

### 7.1 Configurar Network Access para Produção

1. Vá em **"Network Access"** no Atlas
2. Adicione o IP do seu servidor de produção:
   - Para Render: `0.0.0.0/0` (Allow Access from Anywhere)
   - Para IP específico: adicione o IP do servidor

### 7.2 Configurar no Render

1. Configure as variáveis de ambiente no painel do Render:

   ```bash
   MONGODB_URI=sua_connection_string_de_producao
   NODE_ENV=production
   ```

2. **Importante**: Use connection string diferente para produção

## 🐛 Solução de Problemas

### Problema 1: "MongoDB connection failed"

**Causa**: Connection string incorreta ou network access
**Soluções**:

1. Verifique se a connection string está correta
2. Teste no MongoDB Compass
3. Verifique se o IP está permitido no Atlas
4. Verifique se o usuário e senha estão corretos

### Problema 2: "Authentication failed"

**Causa**: Credenciais incorretas
**Soluções**:

1. Verifique username e password
2. Recrie o usuário no Atlas se necessário
3. Verifique se não há caracteres especiais na senha

### Problema 3: "Connection timeout"

**Causa**: Network access não configurado
**Soluções**:

1. Adicione `0.0.0.0/0` no Network Access
2. Aguarde 5-10 minutos para propagação
3. Verifique se o cluster está ativo

### Problema 4: "MongooseServerSelectionError"

**Causa**: Cluster não encontrado ou não provisionado
**Soluções**:

1. Verifique se o cluster está "Running"
2. Verifique o nome do cluster na connection string
3. Aguarde o provisionamento completo

## 📊 Verificação Final

### Executar Validação

```bash
# Validar configurações
npm run validate:config
```

### Checklist de Verificação

- [ ] Conta MongoDB Atlas criada
- [ ] Cluster provisionado e rodando
- [ ] Usuário de banco criado
- [ ] Network access configurado
- [ ] Connection string obtida
- [ ] Arquivo `.env` configurado
- [ ] Conexão testada com sucesso
- [ ] Backend inicia sem erros de conexão

## 🎉 Configuração Completa!

Após seguir todos os passos, o MongoDB Atlas estará funcionando corretamente no ControlFin.

**Próximos passos**:

1. Teste o fluxo completo de autenticação
2. Configure produção (Vercel + Render)
3. Teste a integração frontend-backend

## 📞 Suporte

Para problemas, consulte:

- **Guia Principal**: `docs/CONFIGURATION_GUIDE.md`
- **Validação**: `npm run validate:config`
- **Documentação MongoDB**: https://docs.mongodb.com/

### Problemas Comuns

- **Conexão falha**: Verifique connection string e network access
- **Timeout**: Aguarde provisionamento do cluster
- **Autenticação**: Verifique usuário e senha

---

**Tutorial criado em**: 2025-10-05
**Versão**: 1.0.0
**Status**: ✅ Completo e verificado
