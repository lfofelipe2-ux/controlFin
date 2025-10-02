# ControlFin Backend API

Backend API RESTful para o ControlFin - Sistema de Gestão Financeira Pessoal e Compartilhada.

## 🚀 Tecnologias

- **Node.js** 22+ (LTS)
- **Fastify** 5.6 - Framework web rápido e eficiente
- **TypeScript** 5.9 - Type safety e melhor DX
- **MongoDB** (via Mongoose 8.18) - Banco de dados NoSQL
- **Zod** 4.1 - Validação de schemas
- **JWT** - Autenticação stateless
- **bcryptjs** - Hash de senhas

### Plugins e Middleware

- **@fastify/cors** - CORS configuration
- **@fastify/helmet** - Security headers
- **@fastify/rate-limit** - Rate limiting

## 📋 Pré-requisitos

- Node.js 22+ instalado
- MongoDB Atlas account ou MongoDB local
- npm ou yarn

## ⚙️ Instalação

```bash
# Instalar dependências
npm install

# Copiar arquivo de exemplo de variáveis de ambiente
cp env.example .env

# Editar .env com suas configurações
nano .env
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto backend:

```env
NODE_ENV=development
PORT=3000

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback

# Frontend URL (para CORS)
FRONTEND_URL=http://localhost:5173
```

⚠️ **Importante:** Nunca commite o arquivo `.env` no Git!

## 🏃 Executando o Projeto

### Desenvolvimento

```bash
# Rodar em modo de desenvolvimento com hot reload
npm run dev
```

O servidor iniciará em `http://localhost:3000`

### Produção

```bash
# Build do projeto
npm run build

# Iniciar servidor de produção
npm start
```

## 📁 Estrutura de Pastas

```
src/
├── config/          # Configurações (database, env, jwt)
├── middlewares/     # Middlewares customizados (auth, validation, error handling)
├── modules/         # Módulos da aplicação (feature-based)
│   ├── auth/        # Autenticação e autorização
│   ├── users/       # Gestão de usuários
│   ├── spaces/      # Espaços financeiros compartilhados
│   ├── transactions/# CRUD de transações
│   ├── categories/  # Categorias de transações
│   ├── cards/       # Cartões de crédito
│   ├── budgets/     # Orçamentos e planejamento
│   ├── goals/       # Metas de economia
│   ├── notifications/# Sistema de notificações
│   └── insights/    # Geração de insights financeiros
├── plugins/         # Plugins Fastify customizados
├── utils/           # Funções utilitárias
└── server.ts        # Entry point da aplicação
```

## 📝 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento com hot reload (tsx watch)
npm run build        # Build TypeScript para produção
npm start            # Inicia servidor de produção (node dist/server.js)
npm run lint         # Roda ESLint
npm run lint:fix     # Corrige problemas do ESLint automaticamente
npm run type-check   # Verifica tipos TypeScript sem emitir arquivos
npm run format       # Formata código com Prettier
npm run format:check # Verifica formatação com Prettier
npm run test         # Roda testes com Vitest
npm run test:coverage# Roda testes com relatório de cobertura
npm run db:seed      # Popula banco de dados com dados iniciais
npm run openapi:generate # Gera documentação OpenAPI
```

## 🔐 Autenticação

A API usa **JWT (JSON Web Tokens)** para autenticação:

- **Access Token**: Curta duração (15 minutos)
- **Refresh Token**: Longa duração (7 dias), armazenado no banco

### Fluxo de Autenticação

1. Login via `/api/auth/login` ou `/api/auth/google`
2. Recebe `accessToken` e `refreshToken`
3. Usa `accessToken` no header: `Authorization: Bearer <token>`
4. Quando expirar, use `/api/auth/refresh` com `refreshToken`

## 📡 Endpoints Principais

### Health Check

```
GET /health
```

### Autenticação

```
POST /api/auth/register    # Registro de novo usuário
POST /api/auth/login       # Login com email/senha
POST /api/auth/google      # Login com Google OAuth
POST /api/auth/refresh     # Renovar access token
POST /api/auth/logout      # Logout (invalida refresh token)
```

### Transações

```
GET    /api/transactions      # Listar transações
POST   /api/transactions      # Criar transação
GET    /api/transactions/:id  # Detalhes de transação
PUT    /api/transactions/:id  # Atualizar transação
DELETE /api/transactions/:id  # Remover transação (soft delete)
```

_Documentação completa disponível em `/docs` (Swagger UI)_

## 🧪 Testes

```bash
# Rodar todos os testes
npm test

# Rodar testes com cobertura
npm run test:coverage

# Rodar testes em modo watch
npm test -- --watch
```

## 🔒 Segurança

- ✅ Senhas hasheadas com **bcrypt** (10 salt rounds)
- ✅ Tokens JWT assinados e verificados
- ✅ Rate limiting (100 req/min por IP)
- ✅ Helmet.js para security headers
- ✅ CORS configurado apenas para frontend autorizado
- ✅ Validação rigorosa de inputs com **Zod**
- ✅ MongoDB injection protection (Mongoose)

## 📊 Monitoramento

### Logs

O servidor usa **Pino** (logger integrado do Fastify) para logs estruturados.

### Health Check

```bash
curl http://localhost:3000/health
```

## 🐛 Troubleshooting

### Erro de Conexão com MongoDB

```
Error: connect ECONNREFUSED
```

**Solução:** Verifique se sua string de conexão MongoDB está correta no `.env`

### Erro "Port already in use"

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solução:**

```bash
# Encontrar processo usando a porta
lsof -ti:3000 | xargs kill -9

# Ou mudar a porta no .env
PORT=3001
```

## 📚 Documentação Adicional

- [Documentação do Fastify](https://www.fastify.io/)
- [Mongoose Docs](https://mongoosejs.com/docs/)
- [Zod Documentation](https://zod.dev/)
- [JWT Best Practices](https://jwt.io/introduction)

## 🤝 Contribuindo

1. Siga os padrões de código (ESLint + Prettier)
2. Use commits semânticos (Commitlint)
3. Adicione testes para novas funcionalidades
4. Atualize a documentação

## 📄 Licença

ISC

---

**ControlFin Backend** - Desenvolvido com ❤️ usando Fastify e TypeScript
