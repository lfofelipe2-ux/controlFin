# IA IMPROVEMENTS: Guia Definitivo de Vibe Coding para ControlFin

> **⚡ VIBE CODING EDITION** - Este documento é otimizado para quem RARAMENTE programa manualmente.  
> Você pensa → IA codifica → Você revisa → Deploy.  
> Configurações visuais, atalhos de edição e plugins desnecessários foram **removidos**.

**Filosofia:** Você é o arquiteto, a IA é o desenvolvedor. Este guia foca em **delegar tudo para a IA** e atuar como revisor técnico.

**Seu Workflow:** Conversar com IA (`Cmd+L`), revisar código, dar merge. Simples assim.

---

## 📋 Índice

### 🚀 COMECE AQUI
- [💎 RESUMO EXECUTIVO - Vibe Coding em 5min](#-resumo-executivo-vibe-coding-em-5-minutos)

### 📚 Referência Completa
1. [Configurações Essenciais do Cursor](#1-configurações-essenciais-do-cursor)
2. [Arquivo .cursorrules (Crítico)](#2-arquivo-cursorrules-crítico)
3. [Prompts de Delegação Total](#3-prompts-de-delegação-total)
4. [MCPs para Automação Máxima](#4-mcps-para-automação-máxima)
5. [Estratégia Multi-Modelo](#5-estratégia-multi-modelo)
6. [Automações e Scripts](#6-automações-e-scripts)
7. [Templates Prontos](#7-templates-prontos)
8. [Otimização de Custos](#8-otimização-de-custos)
9. [Code Review por IA](#9-code-review-por-ia)
10. [Design para Código com IA](#10-design-para-código-com-ia)

**💡 Dica:** Se é sua primeira vez, vá direto para o [RESUMO EXECUTIVO](#-resumo-executivo-vibe-coding-em-5-minutos) no final do documento.

---

## 1. Configurações Essenciais do Cursor

**Filosofia:** Configure uma vez, delegue para sempre.

### 1.1 Settings.json Minimalista (Vibe Coding)

**Caminho:** `Settings` → `Open Settings (JSON)`

```json
{
  // ===== CURSOR AI (CRÍTICO) =====
  "cursor.aiPreferences.model": "claude-sonnet-4",
  "cursor.chat.contextLength": "long",
  "cursor.general.enableShadowWorkspace": true,
  "cursor.chat.showSuggestedFiles": true,
  
  // ===== COPILOT (AUTO-COMPLETE) =====
  "github.copilot.enable": {
    "*": true
  },
  
  // ===== AUTO-SAVE & FORMAT (ESSENCIAL) =====
  "files.autoSave": "onFocusChange",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },
  
  // ===== PERFORMANCE =====
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.git": true
  },
  
  // ===== MENOS DISTRAÇÃO =====
  "editor.minimap.enabled": false,
  "workbench.editor.enablePreview": false,
  "workbench.startupEditor": "none"
}
```

**Por que só isso?**
- Você **não vai editar código manualmente**, então cores e ícones são irrelevantes
- IA cuida de TypeScript hints, imports, formatação
- Foco em **delegar e revisar**, não em escrever

### 1.2 Atalhos Críticos (Apenas 3)

**Você só precisa destes:**

| Atalho | Função | Uso |
|--------|--------|-----|
| `Cmd+L` | Abrir Chat IA | 90% do seu tempo |
| `Cmd+Shift+L` | Composer (múltiplos arquivos) | Features completas |
| `Cmd+K` → `Enter` | Aceitar sugestão IA | Aprovar código |

**Ignore o resto.** Vibe coding = conversar com IA, não editar manualmente.

---

## 2. Arquivo .cursorrules (Crítico)

O arquivo `.cursorrules` é a **ferramenta mais poderosa** para controlar o comportamento da IA no Cursor. Ele deve estar na raiz de cada repositório.

### 2.1 .cursorrules para Frontend

**Arquivo:** `controlfin-frontend/.cursorrules`

```markdown
# ControlFin Frontend - Cursor AI Rules

## Project Context
You are working on ControlFin, a Progressive Web App for personal finance management. This is the FRONTEND repository built with React 18, TypeScript, Vite, Ant Design 5, and Zustand.

**Design Reference:** BlockAI Admin Dashboard - See `/docs/assets/design-reference/` for visual reference images.

## Core Principles
1. **TypeScript First**: Always use strict TypeScript. Never use `any` - use `unknown` or proper types.
2. **Functional Components**: Only functional components with hooks (no classes).
3. **Performance**: Memoize expensive computations, lazy load routes, code split intelligently.
4. **Accessibility**: All interactive elements must be keyboard accessible (WCAG AA minimum).
5. **Error Handling**: Every async operation must have error handling with user feedback.
6. **Design Fidelity**: Follow BlockAI design system precisely - colors, spacing, typography.

## Design System (BlockAI)

### Colors (ALWAYS use these exact values)
```scss
// Backgrounds
$bg-primary: #2d3561;      // Background principal
$bg-sidebar: #1f2347;      // Sidebar
$bg-card: #363d65;         // Cards
$bg-hover: #3d4570;        // Hover state

// Text
$text-primary: #ffffff;    // Texto principal
$text-secondary: #a0a4b8;  // Texto secundário

// Accent
$accent-primary: #00d9ff;  // Ciano (botões, links)
$accent-secondary: #2196f3; // Azul royal

// Semantic
$color-success: #00ff88;   // Verde
$color-warning: #ffaa00;   // Laranja  
$color-error: #ff3366;     // Vermelho
```

### Typography
- **Font:** Inter, Poppins ou Roboto (Google Fonts)
- **Weights:** 300 (light), 400 (regular), 600 (semibold)
- **Sizes:** 11px (xs), 12px (sm), 14px (base), 16px (md), 18px (lg), 24px (xl), 32px (2xl)

### Spacing
Use múltiplos de 8px: 4px, 8px, 16px, 24px, 32px, 48px, 64px

### Layout
- Sidebar: 240px width, fixed left, background `#1f2347`
- Border radius: 8px (cards), 4px (inputs)
- Shadows: `0 2px 8px rgba(0,0,0,0.15)` (small), `0 4px 16px rgba(0,0,0,0.25)` (medium)

## Code Style

### File Naming
- Components: PascalCase (e.g., `TransactionList.tsx`)
- Utilities: kebab-case (e.g., `format-currency.ts`)
- Hooks: camelCase with `use` prefix (e.g., `useTransactions.ts`)
- Types: kebab-case (e.g., `transaction.types.ts`)

### Component Structure (MANDATORY ORDER)
```typescript
// 1. External imports (React, libraries)
import React, { useState, useEffect } from 'react';
import { Button, Card } from 'antd';

// 2. Internal imports (components, hooks, utils)
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency } from '@/utils/formatters';

// 3. Type imports
import type { Transaction } from '@/types/transaction.types';

// 4. Styles
import './TransactionCard.scss';

// 5. Types/Interfaces (local to file)
interface Props {
  transaction: Transaction;
  onEdit: (id: string) => void;
}

// 6. Component
export const TransactionCard: React.FC<Props> = ({ transaction, onEdit }) => {
  // 6.1 Hooks (state, context, custom hooks)
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  
  // 6.2 Effects
  useEffect(() => {
    // Effect logic
  }, []);
  
  // 6.3 Handlers (prefix with `handle`)
  const handleEdit = () => {
    onEdit(transaction.id);
  };
  
  // 6.4 Computed values
  const formattedAmount = formatCurrency(transaction.amount);
  
  // 6.5 Early returns (loading, error states)
  if (isLoading) return <Spin />;
  
  // 6.6 Main render
  return (
    <Card>
      <p>{formattedAmount}</p>
      <Button onClick={handleEdit}>Edit</Button>
    </Card>
  );
};
```

### Zustand Store Pattern
```typescript
// Pattern for all stores
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface State {
  // State properties
}

interface Actions {
  // Action methods
}

export const useStoreName = create<State & Actions>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        
        // Actions
      }),
      { name: 'store-name' }
    )
  )
);
```

### API Calls Pattern
```typescript
// Always wrap in try-catch with proper error handling
try {
  setLoading(true);
  const response = await api.get('/endpoint');
  setData(response.data);
  message.success('Success message');
} catch (error) {
  console.error('Context of error:', error);
  message.error(error.response?.data?.message || 'Generic error message');
} finally {
  setLoading(false);
}
```

## Forbidden Patterns
❌ NEVER use `any` type
❌ NEVER use inline styles (always SCSS)
❌ NEVER use `var` (only `const` or `let`)
❌ NEVER use `function` keyword for components (arrow functions only)
❌ NEVER mutate state directly (use setState or Zustand actions)
❌ NEVER use `console.log` in production code (use proper logger or remove)
❌ NEVER hardcode API URLs (use environment variables)
❌ NEVER commit sensitive data (.env files excluded)

## Required Patterns
✅ ALWAYS destructure props
✅ ALWAYS use optional chaining for nested objects (`user?.name`)
✅ ALWAYS validate form inputs with Ant Design Form validation
✅ ALWAYS show loading states for async operations
✅ ALWAYS show error boundaries for components that fetch data
✅ ALWAYS use semantic HTML (`<button>` not `<div onClick>`)
✅ ALWAYS add `alt` text to images
✅ ALWAYS use `key` prop in lists (unique, stable IDs)

## Ant Design Guidelines
- Use `message` for brief notifications
- Use `notification` for detailed feedback
- Use `Modal.confirm` for destructive actions
- Use `Form` component for all forms (never uncontrolled)
- Use `ConfigProvider` for theme customization
- Use responsive props: `xs`, `sm`, `md`, `lg`, `xl`

## Performance Optimization
- Lazy load routes: `const Dashboard = lazy(() => import('./pages/Dashboard'));`
- Memoize expensive calculations: `const total = useMemo(() => calculateTotal(transactions), [transactions]);`
- Memoize callbacks passed to children: `const handleClick = useCallback(() => {...}, [deps]);`
- Use `React.memo` for pure components that re-render often
- Debounce search inputs: Use lodash debounce or custom hook

## Testing Hints
- For new components, suggest where tests would add value (complex logic, critical flows)
- Don't auto-generate tests unless explicitly asked

## When Creating New Files
1. Ask if I want the file in a specific location if path is ambiguous
2. Always include proper TypeScript types
3. Add inline comments for complex logic
4. Follow the structure patterns defined above

## When Modifying Existing Files
1. Preserve existing patterns and style
2. If you notice an anti-pattern, suggest improvements but don't auto-fix unless asked
3. Always run type checking mentally before suggesting changes

## Error Messages
- User-facing: Simple, actionable (e.g., "Could not save transaction. Please try again.")
- Console: Detailed, with context (e.g., "Failed to POST /transactions: 400 Bad Request - Invalid categoryId")

## Accessibility Checklist (for new components)
- [ ] Keyboard navigable (Tab, Enter, Space, Esc)
- [ ] Screen reader friendly (aria-labels where needed)
- [ ] Color contrast ratio ≥ 4.5:1
- [ ] Focus states visible
- [ ] Error messages associated with inputs (aria-describedby)

## Common Gotchas
- Ant Design DatePicker uses Day.js, not native Date (import dayjs)
- Zustand persist middleware can cause hydration issues (use `hasHydrated` check)
- Vite env variables must start with `VITE_` prefix
- Service Worker updates require page refresh (implement update notification)

## When I Ask for "Generate Component X"
Provide:
1. Component file with full implementation
2. Types file if types are complex
3. SCSS file with responsive styles
4. Zustand store if state management needed
5. Brief explanation of key decisions

## Additional Context
- This is an MVP, prioritize speed but not at the cost of type safety or security
- User experience is critical: loading states, error messages, empty states must always be considered
- Dark mode is the only theme (no light mode toggle)
- All monetary values are stored as integers in cents (divide by 100 for display)
```

### 2.2 .cursorrules para Backend

**Arquivo:** `controlfin-backend/.cursorrules`

```markdown
# ControlFin Backend - Cursor AI Rules

## Project Context
You are working on ControlFin, a RESTful API for personal finance management. This is the BACKEND repository built with Node.js 22+, TypeScript, Fastify, MongoDB, and Zod.

## Core Principles
1. **Security First**: Validate all inputs, sanitize outputs, never trust client data.
2. **Type Safety**: Strict TypeScript, Zod schemas for all external data.
3. **Performance**: Optimize queries, use indexes, cache when appropriate.
4. **Error Handling**: Meaningful error messages, proper HTTP status codes.
5. **Auditability**: Log all important operations (who did what when).

## Code Style

### File Naming
- Controllers: `*.controller.ts`
- Services: `*.service.ts`
- Routes: `*.routes.ts`
- Models: `*.model.ts`
- Schemas: `*.schemas.ts` (Zod schemas)
- Types: `*.types.ts`

### Module Structure (Feature-Based)
```
modules/
└── transactions/
    ├── transaction.controller.ts   # HTTP handlers
    ├── transaction.service.ts       # Business logic
    ├── transaction.routes.ts        # Route definitions
    ├── transaction.model.ts         # Mongoose model
    ├── transaction.schemas.ts       # Zod validation schemas
    └── transaction.types.ts         # TypeScript types
```

### Controller Pattern
```typescript
import type { FastifyRequest, FastifyReply } from 'fastify';
import { transactionService } from './transaction.service';
import { createTransactionSchema } from './transaction.schemas';

export const createTransaction = async (
  request: FastifyRequest<{ Body: unknown }>,
  reply: FastifyReply
) => {
  try {
    // 1. Validate input with Zod
    const data = createTransactionSchema.parse(request.body);
    
    // 2. Extract user from JWT (set by auth middleware)
    const userId = request.user.sub;
    const spaceId = request.user.spaceId;
    
    // 3. Call service
    const transaction = await transactionService.create({
      ...data,
      userId,
      spaceId,
    });
    
    // 4. Return response
    return reply.status(201).send({
      success: true,
      data: transaction,
    });
  } catch (error) {
    // 5. Handle errors
    if (error instanceof ZodError) {
      return reply.status(400).send({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
    }
    
    request.log.error({ error }, 'Failed to create transaction');
    return reply.status(500).send({
      success: false,
      error: 'Internal server error',
    });
  }
};
```

### Service Pattern
```typescript
// Services contain ALL business logic (no logic in controllers)
export const transactionService = {
  async create(data: CreateTransactionDTO) {
    // 1. Additional validations
    await this.validateCategory(data.categoryId);
    
    // 2. Transform data if needed
    const amountInCents = Math.round(data.amount * 100);
    
    // 3. Database operation
    const transaction = await TransactionModel.create({
      ...data,
      amount: amountInCents,
    });
    
    // 4. Side effects (notifications, analytics, etc.)
    await notificationService.checkBudgetAlert(data.spaceId);
    
    // 5. Return
    return transaction;
  },
  
  async validateCategory(categoryId: string) {
    const exists = await CategoryModel.exists({ _id: categoryId });
    if (!exists) {
      throw new NotFoundError('Category not found');
    }
  },
};
```

### Zod Schema Pattern
```typescript
import { z } from 'zod';

// Base schema
export const transactionBaseSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().positive(),
  categoryId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId'),
  description: z.string().min(1).max(500),
  date: z.string().datetime(),
  paymentMethod: z.enum(['cash', 'debit', 'pix', 'credit_card']),
  creditCardId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
});

// Create schema (might have required fields)
export const createTransactionSchema = transactionBaseSchema;

// Update schema (all fields optional)
export const updateTransactionSchema = transactionBaseSchema.partial();

// Query schema (for GET requests)
export const queryTransactionsSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  categoryId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  type: z.enum(['income', 'expense']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// Type inference
export type CreateTransactionDTO = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionDTO = z.infer<typeof updateTransactionSchema>;
export type QueryTransactionsDTO = z.infer<typeof queryTransactionsSchema>;
```

### Mongoose Model Pattern
```typescript
import mongoose from 'mongoose';
import type { Transaction } from './transaction.types';

const transactionSchema = new mongoose.Schema<Transaction>(
  {
    spaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'FinancialSpace', required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    amount: { type: Number, required: true }, // In cents
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    description: { type: String, required: true },
    date: { type: Date, required: true, index: true },
    paymentMethod: { type: String, enum: ['cash', 'debit', 'pix', 'credit_card'], required: true },
    creditCardId: { type: mongoose.Schema.Types.ObjectId, ref: 'CreditCard' },
    status: { type: String, enum: ['completed', 'pending', 'scheduled'], default: 'completed' },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: 'transactions',
  }
);

// Compound indexes
transactionSchema.index({ spaceId: 1, date: -1 });

// Virtual for amount in currency format
transactionSchema.virtual('amountInCurrency').get(function() {
  return this.amount / 100;
});

export const TransactionModel = mongoose.model<Transaction>('Transaction', transactionSchema);
```

## Route Definition Pattern
```typescript
import type { FastifyInstance } from 'fastify';
import { createTransaction, listTransactions } from './transaction.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

export const transactionRoutes = async (fastify: FastifyInstance) => {
  // Apply auth middleware to all routes in this module
  fastify.addHook('onRequest', authMiddleware);
  
  fastify.post('/transactions', {
    schema: {
      description: 'Create a new transaction',
      tags: ['transactions'],
      body: {
        type: 'object',
        // JSON Schema for OpenAPI (can be auto-generated from Zod)
      },
      response: {
        201: {
          description: 'Transaction created successfully',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' },
          },
        },
      },
    },
    handler: createTransaction,
  });
  
  fastify.get('/transactions', {
    schema: {
      description: 'List transactions with filters',
      tags: ['transactions'],
      querystring: {
        // Query parameters schema
      },
    },
    handler: listTransactions,
  });
};
```

## Forbidden Patterns
❌ NEVER store passwords in plain text (bcrypt always)
❌ NEVER expose sensitive data in responses (filter out password, refreshTokens)
❌ NEVER trust request.body without validation (Zod schemas mandatory)
❌ NEVER use string concatenation for queries (use Mongoose methods)
❌ NEVER log sensitive data (passwords, tokens, credit card numbers)
❌ NEVER use `any` type
❌ NEVER return stack traces to client (only in development)
❌ NEVER use `==` (always `===`)

## Required Patterns
✅ ALWAYS validate inputs with Zod
✅ ALWAYS use async/await (no raw promises)
✅ ALWAYS use proper HTTP status codes (201 for created, 204 for no content, etc.)
✅ ALWAYS add `index: true` to frequently queried fields in Mongoose
✅ ALWAYS use transactions for multi-document operations (MongoDB transactions)
✅ ALWAYS hash sensitive data (passwords with bcrypt, refresh tokens)
✅ ALWAYS use environment variables for configuration
✅ ALWAYS sanitize user inputs to prevent injection
✅ ALWAYS rate limit public endpoints (use @fastify/rate-limit)
✅ ALWAYS add request IDs for tracing (use @fastify/request-id)

## Error Handling
```typescript
// Custom error classes
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', public details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

// Global error handler
fastify.setErrorHandler((error, request, reply) => {
  request.log.error({ error, requestId: request.id }, 'Request error');
  
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      success: false,
      error: error.message,
      code: error.code,
      details: error instanceof ValidationError ? error.details : undefined,
    });
  }
  
  // Unknown error
  return reply.status(500).send({
    success: false,
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
  });
});
```

## MongoDB Query Optimization
```typescript
// BAD: Multiple queries
const transactions = await TransactionModel.find({ spaceId });
for (const transaction of transactions) {
  transaction.category = await CategoryModel.findById(transaction.categoryId);
}

// GOOD: Single query with population
const transactions = await TransactionModel
  .find({ spaceId })
  .populate('categoryId', 'name icon color')
  .lean(); // Use .lean() when you don't need Mongoose document methods

// GOOD: Aggregation for complex queries
const summary = await TransactionModel.aggregate([
  { $match: { spaceId: new mongoose.Types.ObjectId(spaceId), date: { $gte: startDate } } },
  { $group: { _id: '$categoryId', total: { $sum: '$amount' } } },
  { $sort: { total: -1 } },
  { $limit: 10 },
]);
```

## Security Checklist
- [ ] All routes except /auth/* require authentication
- [ ] JWT tokens expire in 15 minutes (access) and 7 days (refresh)
- [ ] Passwords hashed with bcrypt (salt rounds: 10)
- [ ] Refresh tokens hashed before storing in DB
- [ ] Rate limiting on auth endpoints (5 attempts per minute)
- [ ] CORS configured to allow only frontend origin
- [ ] Helmet enabled for security headers
- [ ] Input validation with Zod on all routes
- [ ] MongoDB injection prevented (use Mongoose, never string concatenation)
- [ ] Sensitive data never logged (passwords, tokens)

## Logging Strategy
```typescript
// Use Fastify's built-in logger (Pino)
request.log.info({ userId, action: 'create_transaction' }, 'Transaction created');
request.log.error({ error, userId }, 'Failed to create transaction');
request.log.warn({ spaceId, budgetUsage: 0.95 }, 'Budget near limit');

// NEVER log:
// - Passwords
// - JWT tokens
// - Credit card numbers (even last 4 digits, store separately)
// - Personal identifiable information in production
```

## Testing Strategy
- Unit tests for services (business logic)
- Integration tests for routes (with in-memory MongoDB)
- Test critical flows: auth, transaction creation, budget calculations
- Use `vitest` for speed

## When Creating New Endpoints
1. Create Zod schemas first (input validation)
2. Define types from schemas (z.infer)
3. Implement service logic (business rules)
4. Create controller (HTTP handling)
5. Add route definition with OpenAPI schema
6. Add tests for happy path and error cases
7. Update openapi.yaml if not auto-generated

## Common Pitfalls
- Forgetting to add indexes (check slow queries with MongoDB profiler)
- Not using `.lean()` when populating (causes memory issues)
- Exposing too much data in responses (use projection or DTO pattern)
- Not handling MongoDB connection errors (retry logic needed)
- Forgetting to validate ObjectId format (use Zod regex)

## Performance Tips
- Use `.select()` to limit returned fields: `.find().select('name amount date')`
- Use `.limit()` and `.skip()` for pagination
- Create indexes on fields used in filters: `{ spaceId: 1, date: -1 }`
- Use aggregation pipeline for complex calculations
- Cache frequently accessed, rarely changed data (categories)

## Environment Variables (Required)
```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FRONTEND_URL=http://localhost:5173
```

## When I Ask "Generate Endpoint for X"
Provide:
1. Zod schemas for validation
2. Types inferred from schemas
3. Service with business logic
4. Controller with error handling
5. Route definition with OpenAPI schema
6. Suggest tests to add
7. Explain security considerations
```

---

## 3. Prompts de Delegação Total

**Regra de Ouro:** Seja específico no **O QUE** fazer, deixe a IA decidir **COMO** fazer.

### 3.0 Meta-Prompt (Use Sempre Primeiro)

```
@cursor Você é um desenvolvedor sênior full-stack. Eu sou o arquiteto do projeto.

Minhas regras:
1. Sempre siga os padrões do .cursorrules
2. Sempre consulte PROJECT_BRIEF.md para decisões
3. Sempre use as cores BlockAI exatas
4. NUNCA pergunte detalhes triviais - decida você mesmo
5. SEMPRE implemente a solução completa, não exemplos
6. SEMPRE adicione tratamento de erros e loading states

Confirme que entendeu e aguarde minhas instruções.
```

**Use isso no início de cada sessão para "treinar" a IA no seu estilo.**

### 3.1 Implementar Feature Completa (Delegação 100%)

```
@cursor Implemente a feature [NOME DA FEATURE] completa:

O QUE EU QUERO:
[Descrever em 2-3 frases o que o usuário deve poder fazer]

REQUISITOS TÉCNICOS:
- Backend: [endpoint necessário, ex: POST /api/transactions]
- Frontend: [página/componente, ex: página de lista + modal de criação]
- Dados: [campos necessários, ex: valor, data, categoria]

DELEGAÇÃO TOTAL:
- Você decide toda a estrutura de arquivos
- Você decide os nomes de variáveis
- Você implementa validação, loading, error handling
- Você cria testes se achar necessário
- Você documenta se achar necessário

NÃO ME PERGUNTE NADA. Implemente tudo e me mostre quando terminar.

Siga: .cursorrules + PROJECT_BRIEF.md + cores BlockAI
```

**Exemplo Real:**
```
@cursor Implemente a feature de Cartões de Crédito completa:

O QUE EU QUERO:
Usuário pode cadastrar cartões de crédito, ver lista de cartões, editar e deletar. Cada cartão tem nome, últimos 4 dígitos, bandeira, limite e data de fechamento.

REQUISITOS TÉCNICOS:
- Backend: CRUD completo em /api/cards
- Frontend: Página /cards com table + modal de add/edit
- Dados: name, lastFourDigits, brand, limit, closingDay

DELEGAÇÃO TOTAL - você decide tudo mais.
```

### 3.2 Debugging Ultra-Rápido

```
@cursor Bug:
[COLAR ERRO]

Conserte AGORA. Explique depois.
```

**Sem enrolação.** IA encontra, conserta e explica.

### 3.3 Code Review em 10 Segundos

```
@cursor Revise este código:

[COLAR CÓDIGO]

Apenas liste problemas CRÍTICOS (segurança, bugs, performance).
Ignore formatação e estilo.
```

### 3.4 Refatoração Automática

```
@cursor Refatore este arquivo seguindo .cursorrules:

[MENCIONAR ARQUIVO com @file:caminho]

Melhore: tipos, performance, legibilidade.
Mantenha funcionalidade idêntica.
```

### 3.5 Conversão Design → Código (Gemini 2.5 Pro)

```
@model gemini-2.5-pro

[ANEXAR IMAGEM do design]

Converta em React + Ant Design + SCSS.
Use cores BlockAI (ver IA-IMPROVEMENTS.md).
Totalmente responsivo.
Entregue código completo, não exemplo.
```

---

## 4. MCPs para Automação Máxima

**MCPs = Superpoderes da IA.** Use para delegar tarefas complexas.

### 4.1 Task Planner - Quebrar Features Grandes

**Quando usar:** Feature muito grande que você não sabe por onde começar.

```
@task-planner Implemente sistema de metas de economia:

Usuário pode:
- Criar meta (nome, valor alvo, prazo)
- Fazer aportes mensais
- Ver progresso com gráfico
- Ver projeção de conclusão

Backend: MongoDB + Fastify
Frontend: React + Ant Design

Quebre em tasks de máximo 2h cada.
```

**IA gera lista sequencial**. Você só executa uma por vez.

### 4.2 GitHub MCP - Commits e PRs Automáticos

```
@github-mcp 
Analisemudanças e gere commit message (Conventional Commits).
```

```
@github-mcp
Crie descrição de PR completa para minhas mudanças.
Inclua: título, descrição, checklist.
```

### 4.3 Context7 - Docs de Bibliotecas

```
@context7 /ant-design/ant-design
Pergunta: [SUA DÚVIDA SOBRE ANT DESIGN]
```

```
@context7 /fastify/fastify
Pergunta: [SUA DÚVIDA SOBRE FASTIFY]
```

**Use quando:** Não lembra API de uma lib. IA carrega docs atualizadas.

### 4.4 Memory Bank - Salvar Decisões

```
@memory-bank save decision

Título: [NOME DA DECISÃO]
Decisão: [O QUE DECIDIMOS]
Motivo: [POR QUÊ]
Data: [HOJE]
```

**Use quando:** Tomar decisão arquitetural importante. IA lembra depois.

---

## 5. Estratégia Multi-Modelo

Com Cursor PRO + Google AI Pro, você tem acesso a múltiplos modelos. Use cada um para o que faz de melhor.

### 5.1 Matriz de Decisão: Qual Modelo Usar?

| Tarefa | Modelo Recomendado | Justificativa |
|--------|-------------------|---------------|
| **Arquitetura e Design** | Claude Sonnet 4 | Raciocínio profundo, trade-offs balanceados |
| **Código Complexo (Backend)** | Claude Sonnet 4 | Melhor para lógica complexa e segurança |
| **Código de UI (Frontend)** | Gemini 2.0 Flash | Rápido, bom com CSS/HTML, visão de layout |
| **Debugging** | Claude Sonnet 4 | Análise profunda de erros |
| **Refactoring** | Claude Sonnet 4 | Compreende contexto e padrões |
| **Testes** | Gemini 2.0 Flash | Rápido para gerar casos de teste |
| **Documentação** | Gemini 2.0 Flash | Rápido e bom com markdown |
| **SQL/MongoDB Queries** | Claude Sonnet 4 | Melhor com lógica de queries |
| **CSS/SCSS** | Gemini 2.0 Flash | Excelente com estilos |
| **Revisão de Código** | Claude Sonnet 4 | Análise crítica e detalhada |
| **Protótipos Rápidos** | Gemini 2.0 Flash | Velocidade |
| **Análise de Performance** | Claude Sonnet 4 | Raciocínio sobre otimizações |
| **Conversão de Design** | Gemini 2.5 Pro | Multimodal, entende imagens |
| **Brainstorming** | Gemini 2.5 Pro | Criativo, múltiplas perspectivas |

### 5.2 Como Trocar de Modelo no Cursor

**Via UI:**
- Ctrl+L (Cmd+L no Mac) para abrir o chat
- No canto superior direito, clique no dropdown do modelo
- Selecione: Claude Sonnet 4, Gemini 2.0 Flash, Gemini 2.5 Pro, etc.

**Via Comando:**
```
@model claude-sonnet-4 [SUA PERGUNTA]
```

### 5.3 Workflow Multi-Modelo Recomendado

**Fase de Planejamento:**
1. Claude Sonnet 4: "Arquitete a solução para [FEATURE]"
2. Gemini 2.5 Pro: "Dê feedback e alternativas para este design"
3. Claude Sonnet 4: "Decisão final com trade-offs"

**Fase de Implementação:**
1. Claude Sonnet 4: Implementar backend (lógica complexa)
2. Gemini 2.0 Flash: Implementar UI (componentes visuais)
3. Claude Sonnet 4: Integração e testes críticos

**Fase de Otimização:**
1. Gemini 2.0 Flash: Otimizar CSS (reduzir bundle)
2. Claude Sonnet 4: Otimizar queries e algoritmos
3. Gemini 2.0 Flash: Gerar documentação

### 5.4 Uso de Jules (Agente Autônomo)

O Google AI Pro inclui **Jules**, um agente de codificação autônomo.

**Quando Usar Jules:**
- Implementação de features inteiras (ele trabalha de forma independente)
- Refatorações grandes (múltiplos arquivos)
- Migrações de código (ex: atualizar versão de biblioteca)
- Correção de múltiplos bugs similares

**Como Usar:**
```
@jules Implemente o CRUD completo de transações (backend + frontend) seguindo o PROJECT_BRIEF.md e .cursorrules.

Contexto:
- Ver exemplos em /modules/auth para padrões
- Usar TransactionModel já definido em transaction.model.ts
- Frontend deve usar Ant Design Table e Modal

Trabalhe autonomamente e me avise quando concluir.
```

**Importante:** Sempre revise o código gerado por Jules antes de commitar.

---

## 6. Automações e Scripts

**Instale uma vez, esqueça para sempre.**

### 6.1 Scripts NPM Essenciais

**Frontend:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .ts,.tsx --max-warnings 0",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.{ts,tsx,scss,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,scss,md}\"",
    "test": "vitest",
    "test:coverage": "vitest run --coverage",
    "analyze": "vite-bundle-visualizer",
    "clean": "rm -rf dist node_modules",
    "prepare": "husky install"
  }
}
```

**Backend:**
```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "lint": "eslint . --ext .ts --max-warnings 0",
    "lint:fix": "eslint . --ext .ts --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.{ts,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,md}\"",
    "test": "vitest",
    "test:coverage": "vitest run --coverage",
    "db:seed": "tsx scripts/seed.ts",
    "openapi:generate": "tsx scripts/generate-openapi.ts",
    "prepare": "husky install"
  }
}
```

### 6.2 Husky + Lint-Staged (Git Hooks)

Automatize qualidade de código antes de cada commit.

**Instalar:**
```bash
npm install -D husky lint-staged
npx husky install
npm pkg set scripts.prepare="husky install"
npx husky add .husky/pre-commit "npx lint-staged"
```

**Configurar `lint-staged` em `package.json`:**
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{scss,md,json}": [
      "prettier --write"
    ]
  }
}
```

**O que isso faz:**
- Antes de cada commit, roda ESLint e Prettier automaticamente
- Fixa problemas simples
- Bloqueia commit se houver erros críticos

### 8.3 Commitlint (Commits Semânticos)

Force commits no formato Conventional Commits.

**Instalar:**
```bash
npm install -D @commitlint/cli @commitlint/config-conventional
npx husky add .husky/commit-msg "npx --no -- commitlint --edit \$1"
```

**Configurar `.commitlintrc.json`:**
```json
{
  "extends": ["@commitlint/config-conventional"],
  "rules": {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "docs", "style", "refactor", "test", "chore", "perf", "ci", "build"]
    ],
    "subject-case": [2, "never", ["upper-case"]]
  }
}
```

### 8.4 Script de Seed do Banco de Dados

**Arquivo:** `controlfin-backend/scripts/seed.ts`

```typescript
import mongoose from 'mongoose';
import { CategoryModel } from '../src/modules/categories/category.model';
import { config } from '../src/config/env';

const defaultCategories = [
  { name: 'Alimentação', icon: 'ShoppingOutlined', color: '#FF6B6B', type: 'expense', isDefault: true },
  { name: 'Transporte', icon: 'CarOutlined', color: '#4ECDC4', type: 'expense', isDefault: true },
  { name: 'Moradia', icon: 'HomeOutlined', color: '#45B7D1', type: 'expense', isDefault: true },
  { name: 'Lazer', icon: 'SmileOutlined', color: '#FFA07A', type: 'expense', isDefault: true },
  { name: 'Saúde', icon: 'HeartOutlined', color: '#98D8C8', type: 'expense', isDefault: true },
  { name: 'Salário', icon: 'DollarOutlined', color: '#00D9FF', type: 'income', isDefault: true },
  { name: 'Freelance', icon: 'LaptopOutlined', color: '#A8E6CF', type: 'income', isDefault: true },
];

async function seed() {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Clear existing default categories
    await CategoryModel.deleteMany({ isDefault: true });
    console.log('🗑️  Cleared existing default categories');
    
    // Insert default categories
    await CategoryModel.insertMany(defaultCategories);
    console.log('✅ Seeded default categories');
    
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
```

**Executar:**
```bash
npm run db:seed
```

### 8.5 Script de Geração de OpenAPI

**Arquivo:** `controlfin-backend/scripts/generate-openapi.ts`

```typescript
import fs from 'fs';
import { app } from '../src/app';

async function generateOpenAPI() {
  await app.ready();
  
  const swagger = app.swagger();
  const yaml = JSON.stringify(swagger, null, 2); // Ou use biblioteca yaml
  
  fs.writeFileSync('./openapi.json', yaml);
  console.log('✅ OpenAPI spec generated at ./openapi.json');
  
  await app.close();
}

generateOpenAPI();
```

**Executar:**
```bash
npm run openapi:generate
```

---

## 9. Guardrails e Prevenção de Bugs

### 9.1 Checklist Pré-Commit (Mental)

Antes de commitar, pergunte ao Cursor:

```
@cursor Revise minhas mudanças pendentes para:

1. Type safety (sem `any`, tipos corretos)
2. Security issues (validação, sanitização, auth)
3. Performance problems (queries ineficientes, re-renders desnecessários)
4. Accessibility (keyboard, screen readers)
5. Error handling (try-catch, fallbacks)
6. .cursorrules compliance

Destaque qualquer problema encontrado.
```

### 9.2 Validação Automática de PR

Crie um script que valida PRs antes de merge.

**Arquivo:** `.github/workflows/pr-validation.yml`

```yaml
name: PR Validation

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '22'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run linter
        run: npm run lint
        
      - name: Type check
        run: npm run type-check
        
      - name: Run tests
        run: npm run test:coverage
        
      - name: Check bundle size
        uses: andresz1/size-limit-action@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          
      - name: Security audit
        run: npm audit --audit-level=high
        
      - name: Check for console.logs (production)
        run: |
          if grep -r "console.log" src/; then
            echo "❌ Found console.log in src/"
            exit 1
          fi
```

### 9.3 Guard Clauses Automáticas

Peça ao Cursor para adicionar guard clauses:

```
@cursor Adicione guard clauses e validações defensivas neste código:

[COLAR CÓDIGO]

Considere:
- Null/undefined checks
- Array vazio checks
- Tipo de dado incorreto
- Edge cases
```

### 9.4 Testes de Regressão Automáticos

Configure testes que rodam em cada mudança:

```typescript
// tests/regression/critical-flows.test.ts
describe('Critical Flows - Regression Tests', () => {
  it('User can register, login, and create a transaction', async () => {
    // End-to-end test do fluxo mais crítico
  });
  
  it('Budget alerts trigger at 80% usage', async () => {
    // Test de lógica de negócio crítica
  });
  
  it('JWT tokens expire and refresh correctly', async () => {
    // Test de segurança crítica
  });
});
```

---

## 10. Templates de Código

### 10.1 Template de Variáveis SCSS (BlockAI)

**Arquivo:** `src/styles/variables.scss`

```scss
// ========================================
// COLORS - BlockAI Design System
// ========================================

// Backgrounds
$bg-primary: #2d3561;
$bg-sidebar: #1f2347;
$bg-card: #363d65;
$bg-input: #363d65;
$bg-hover: #3d4570;

// Text Colors
$text-primary: #ffffff;
$text-secondary: #a0a4b8;
$text-disabled: #6b7280;

// Accent Colors
$accent-primary: #00d9ff;
$accent-secondary: #2196f3;
$accent-gradient: linear-gradient(135deg, $accent-primary 0%, $accent-secondary 100%);

// Semantic Colors
$color-success: #00ff88;
$color-warning: #ffaa00;
$color-error: #ff3366;
$color-info: $accent-secondary;

// Borders & Shadows
$border-color: rgba(255, 255, 255, 0.08);
$border-color-hover: rgba(0, 217, 255, 0.3);
$shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.15);
$shadow-md: 0 4px 16px rgba(0, 0, 0, 0.25);
$shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.35);
$shadow-glow: 0 0 20px rgba(0, 217, 255, 0.3);

// Typography
$font-primary: 'Inter', 'Poppins', 'Roboto', -apple-system, sans-serif;
$font-light: 300;
$font-regular: 400;
$font-semibold: 600;

// Font Sizes
$font-size-xs: 11px;
$font-size-sm: 12px;
$font-size-base: 14px;
$font-size-md: 16px;
$font-size-lg: 18px;
$font-size-xl: 24px;
$font-size-2xl: 32px;

// Spacing
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;
$spacing-2xl: 48px;
$spacing-3xl: 64px;

// Layout
$sidebar-width: 240px;
$header-height: 64px;
$border-radius-sm: 4px;
$border-radius-md: 8px;
$border-radius-lg: 12px;

// Transitions
$transition-fast: 150ms ease-in-out;
$transition-base: 250ms ease-in-out;
$transition-slow: 350ms ease-in-out;
```

### 10.2 Template de Tema Ant Design 5 (BlockAI)

**Arquivo:** `src/config/antd-theme.ts`

```typescript
import type { ThemeConfig } from 'antd';

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: '#00d9ff',
    colorSuccess: '#00ff88',
    colorWarning: '#ffaa00',
    colorError: '#ff3366',
    colorInfo: '#2196f3',
    
    colorBgContainer: '#363d65',
    colorBgElevated: '#363d65',
    colorBgLayout: '#2d3561',
    colorBgSpotlight: '#3d4570',
    
    colorText: '#ffffff',
    colorTextSecondary: '#a0a4b8',
    colorTextDisabled: '#6b7280',
    
    colorBorder: 'rgba(255, 255, 255, 0.08)',
    colorBorderSecondary: 'rgba(255, 255, 255, 0.05)',
    
    fontFamily: "'Inter', 'Poppins', 'Roboto', sans-serif",
    fontSize: 14,
    fontSizeHeading1: 32,
    fontSizeHeading2: 24,
    
    borderRadius: 8,
    controlHeight: 40,
    
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  },
  
  components: {
    Button: {
      primaryShadow: '0 0 20px rgba(0, 217, 255, 0.3)',
      fontWeight: 600,
    },
    Input: {
      colorBgContainer: '#363d65',
      activeBorderColor: '#00d9ff',
    },
    Table: {
      colorBgContainer: '#363d65',
      headerBg: '#2d3561',
      rowHoverBg: '#3d4570',
    },
    Card: {
      colorBgContainer: '#363d65',
    },
    Menu: {
      darkItemBg: '#1f2347',
      darkItemSelectedBg: '#363d65',
      darkItemSelectedColor: '#00d9ff',
    },
  },
};
```

### 10.3 Template de Componente React

Salve em `.cursor/templates/react-component.tsx`:

```typescript
import React, { useState, useEffect } from 'react';
import { Button, Card, Spin, message } from 'antd';
import type { ComponentNameProps } from './ComponentName.types';
import './ComponentName.scss';

/**
 * ComponentName - [BREVE DESCRIÇÃO]
 * 
 * @example
 * <ComponentName prop1="value" onAction={handleAction} />
 */
export const ComponentName: React.FC<ComponentNameProps> = ({
  prop1,
  onAction,
}) => {
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, []);
  
  // Handlers
  const handleClick = async () => {
    try {
      setIsLoading(true);
      // Logic
      message.success('Success');
    } catch (error) {
      console.error('Error in ComponentName:', error);
      message.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Render helpers
  const renderContent = () => {
    if (!data) return <p>No data</p>;
    return <div>{/* Content */}</div>;
  };
  
  // Early returns
  if (isLoading) return <Spin />;
  
  // Main render
  return (
    <Card className="component-name">
      {renderContent()}
      <Button onClick={handleClick}>Action</Button>
    </Card>
  );
};
```

**Usar com Cursor:**
```
@cursor Crie um componente usando o template em .cursor/templates/react-component.tsx

Nome: TransactionCard
Props: transaction (Transaction), onEdit (function)
Descrição: Card que mostra detalhes de uma transação
```

### 10.2 Template de Endpoint Backend

```typescript
// Template: Backend Endpoint
import type { FastifyRequest, FastifyReply } from 'fastify';
import { endpointService } from './endpoint.service';
import { endpointSchema } from './endpoint.schemas';
import { NotFoundError, ValidationError } from '@/utils/errors';

/**
 * [METHOD] /api/[route]
 * [DESCRIÇÃO]
 * 
 * @auth Required
 * @rateLimit 100/min
 */
export const endpointHandler = async (
  request: FastifyRequest<{ Body: unknown; Params: unknown; Querystring: unknown }>,
  reply: FastifyReply
) => {
  try {
    // 1. Validate input
    const data = endpointSchema.parse(request.body);
    
    // 2. Extract user context
    const userId = request.user.sub;
    const spaceId = request.user.spaceId;
    
    // 3. Call service
    const result = await endpointService.method({
      ...data,
      userId,
      spaceId,
    });
    
    // 4. Return response
    return reply.status(200).send({
      success: true,
      data: result,
    });
  } catch (error) {
    // Handle specific errors
    if (error instanceof ZodError) {
      return reply.status(400).send({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
    }
    
    if (error instanceof NotFoundError) {
      return reply.status(404).send({
        success: false,
        error: error.message,
      });
    }
    
    // Unknown error
    request.log.error({ error, userId }, 'Endpoint error');
    return reply.status(500).send({
      success: false,
      error: 'Internal server error',
    });
  }
};
```

---

## 11. Workflow Diário Otimizado

### 11.1 Rotina Matinal (Início do Dia)

**1. Carregar Contexto (5 min)**
```
@context7 load PROJECT_BRIEF.md

Resuma o estado atual do projeto e próximas tarefas prioritárias.
```

**2. Revisar TODOs**
- Abra a extensão "Todo Tree"
- Filtre por `TODO:` e `FIXME:`
- Priorize com a IA:
```
@cursor Analise os TODOs no código e priorize por criticidade e impacto.
```

**3. Planejar Dia**
```
@task-planner Hoje vou trabalhar em [FEATURE/BUG].

Quebre em tasks menores (máximo 2h cada) e priorize.
```

### 11.2 Durante o Desenvolvimento

**1. Pair Programming com IA**
- Use Cmd+L (Cursor Chat) constantemente
- Pergunte antes de escrever código complexo:
```
@cursor Como devo estruturar esta lógica de [X]?
Considere performance, segurança e manutenibilidade.
```

**2. Commits Frequentes**
- Commite a cada task completada (pequenos commits)
- Use Husky para validação automática
- Mensagens semânticas (Commitlint force)

**3. Code Review Contínuo**
- A cada hora, peça review:
```
@cursor Revise o que implementei na última hora. Destaque problemas.
```

### 11.3 Fim do Dia

**1. Save Memory**
```
@memory-bank save session

Data: [HOJE]
Trabalho Realizado: [RESUMIR]
Decisões Importantes: [LISTAR]
Próximos Passos: [LISTAR]
Bloqueios: [SE HOUVER]
```

**2. Push e PR**
- Push da branch
- Abrir PR (se feature completa)
- Usar GitHub MCP para descrição:
```
@github-mcp Gere descrição de PR completa para minhas mudanças.
```

**3. Cleanup**
- Remover console.logs
- Remover arquivos temporários
- Rodar `npm run format`

---

## 12. Otimização de Custos

Com Cursor PRO, você tem uso ilimitado de modelos fast (Gemini Flash) mas uso limitado de modelos premium (Claude Sonnet 4). Otimize:

### 12.1 Estratégia de Uso

**Use Gemini 2.0 Flash (Ilimitado) para:**
- Geração de componentes simples
- Estilização CSS/SCSS
- Documentação
- Testes básicos
- Refatorações simples

**Use Claude Sonnet 4 (Limitado) para:**
- Arquitetura e design decisions
- Código complexo (backend, algoritmos)
- Debugging difícil
- Code review crítico
- Segurança

### 12.2 Reduzir Tokens Enviados

**1. Seja Específico**
❌ Ruim: "Crie um sistema de transações"
✅ Bom: "Crie o controller de transações (create, list) seguindo o padrão em auth.controller.ts"

**2. Use Referências**
```
@cursor Implemente [X] seguindo o padrão de [arquivo existente].
```
Cursor carrega apenas o arquivo referenciado, não todo o projeto.

**3. Limpe Histórico de Chat**
- Chat longo = mais tokens
- A cada nova feature, inicie novo chat (Cmd+K Cmd+C)

**4. Use Composer para Múltiplos Arquivos**
- Composer do Cursor otimiza context para editar múltiplos arquivos
- Cmd+Shift+L para abrir

### 12.3 Cache de Contexto

O Cursor cacheia contexto. Para melhorar:

**1. Mantenha arquivos .cursorrules atualizados**
- Cursor carrega .cursorrules automaticamente (não conta para tokens)

**2. Use @-mentions**
```
@file:auth.controller.ts @file:auth.service.ts

Crie transaction.controller.ts e transaction.service.ts seguindo o mesmo padrão.
```

Cursor carrega apenas arquivos mencionados.

---

## 13. Debugging Assistido por IA

### 13.1 Técnica: Explique Antes de Debugar

Quando encontrar um bug:

```
@cursor Explique o que este código deveria fazer vs. o que está fazendo:

Esperado: [COMPORTAMENTO ESPERADO]
Atual: [COMPORTAMENTO ATUAL]
Erro (se houver): [MENSAGEM DE ERRO]

Código:
[COLAR CÓDIGO]

Diagnostique o problema e sugira fix.
```

### 13.2 Console Ninja para Debugging Inline

A extensão Console Ninja mostra resultados de console.log diretamente no editor.

**Uso:**
```typescript
const total = transactions.reduce((sum, t) => sum + t.amount, 0);
console.log({ total }); // Console Ninja mostra o valor inline
```

### 13.3 Breakpoints com Cursor

Use `debugger;` statements e Cursor pode ajudar:

```
@cursor Estou debugando com breakpoint na linha 45. 

Contexto:
- transaction.amount é 15099
- Esperava 150.99
- Função deve dividir por 100

O que está errado?
```

---

## 14. Code Review Automatizado

### 14.1 Prompt de Review Completo

Antes de abrir PR:

```
@cursor Faça code review completo das minhas mudanças seguindo este checklist:

**Type Safety:**
- [ ] Sem uso de `any`
- [ ] Tipos estão corretos e específicos
- [ ] Interfaces bem definidas

**Security:**
- [ ] Inputs validados
- [ ] Autenticação/autorização presente
- [ ] Dados sensíveis não expostos
- [ ] Queries protegidas contra injection

**Performance:**
- [ ] Queries otimizadas (indexes usados)
- [ ] Re-renders evitados (React.memo, useMemo)
- [ ] Bundle size não aumentou muito
- [ ] Lazy loading onde apropriado

**Error Handling:**
- [ ] Try-catch em operações async
- [ ] Mensagens de erro user-friendly
- [ ] Logs adequados para debugging

**Accessibility:**
- [ ] Keyboard navigation funciona
- [ ] Contraste adequado
- [ ] ARIA labels onde necessário

**Testing:**
- [ ] Lógica crítica tem testes
- [ ] Edge cases considerados

**Documentation:**
- [ ] Código auto-explicativo ou comentado
- [ ] README atualizado se necessário
- [ ] OpenAPI atualizado (se backend)

**Standards:**
- [ ] Segue .cursorrules
- [ ] ESLint passa
- [ ] Prettier formatado
- [ ] Commits semânticos

Liste problemas encontrados por prioridade (Critical/High/Medium/Low).
```

### 14.2 Review Automatizado em PR (GitHub Action)

```yaml
name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  ai-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: AI Code Review
        uses: platisd/ai-code-review-action@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          openai_api_key: ${{ secrets.OPENAI_API_KEY }}
```

---

## 15. Recursos Premium Avançados

### 15.1 Gemini 2.5 Pro com Visão (Multimodal)

Use para converter designs em código.

**Workflow:**
1. Tire screenshot do design
2. No Cursor Chat, anexe a imagem (clique no 📎)
3. Prompt:
```
@model gemini-2.5-pro

Converta este design em código React + SCSS.

Requisitos:
- Pixel-perfect
- Responsivo (mobile, tablet, desktop)
- Ant Design components
- Dark theme (#0a0a0a background)
- Smooth animations

Forneça:
1. Componente React (.tsx)
2. Estilos SCSS
3. Responsive breakpoints
```

### 15.2 Jules para Implementações Autônomas

**Exemplo de Task para Jules:**
```
@jules Implemente a feature de Cartões de Crédito end-to-end:

BACKEND:
- Model: CreditCard (ver schema no PROJECT_BRIEF.md)
- Routes: CRUD completo + GET /cards/:id/invoice
- Validação com Zod
- Service para calcular fatura

FRONTEND:
- Página /cards
- CRUD UI (table + modal)
- Visualização de fatura (tabela de transações)
- Store Zustand para state

Siga .cursorrules e padrões existentes.
Trabalhe autonomamente e notifique quando concluir.
```

### 15.3 Claude Sonnet 4 para Refatorações Complexas

```
@model claude-sonnet-4

Refatore o módulo de transações para melhorar:

1. Separar lógica de cálculo em service separado
2. Adicionar cache Redis para queries frequentes
3. Otimizar queries MongoDB (usar aggregation)
4. Adicionar testes unitários

Mantenha compatibilidade com API existente (sem breaking changes).

Forneça:
- Código refatorado
- Migration guide
- Performance benchmarks estimados
```

### 15.4 Cursor Agent (Beta)

Se você tiver acesso ao Cursor Agent:

```
@agent Deploy nova versão para produção:

1. Rode testes completos
2. Se passar, crie build de produção
3. Commit e push
4. Crie tag de versão (semver)
5. Dispare deploy via GitHub Actions
6. Monitore logs por 5 minutos
7. Se erro, rollback automaticamente

Notifique status em cada etapa.
```

---

## 16. Checklists Rápidos

### 16.1 Antes de Commitar

```
[ ] npm run lint (passa)
[ ] npm run type-check (passa)
[ ] npm run test (passa)
[ ] Sem console.logs esquecidos
[ ] Sem TODOs críticos pendentes
[ ] Commit message semântico
```

### 16.2 Antes de Abrir PR

```
[ ] Code review com IA feito
[ ] Branch atualizada com develop
[ ] Todos os commits squashed (se apropriado)
[ ] PR description completa (usar GitHub MCP)
[ ] Screenshots/GIFs (se UI)
[ ] Breaking changes documentadas
[ ] Testes manuais feitos
```

### 16.3 Antes de Deploy

```
[ ] CI passou (lint, types, tests)
[ ] Code review aprovado
[ ] QA manual feito
[ ] .env de produção configurado
[ ] Backups do DB (se migration)
[ ] Rollback plan definido
[ ] Monitoramento pronto
```

---

## 17. Links Úteis e Recursos

### 17.1 Documentação Oficial

- **Cursor:** https://docs.cursor.com
- **React 18:** https://react.dev
- **Fastify:** https://www.fastify.io/docs/latest/
- **Zod:** https://zod.dev
- **Ant Design 5:** https://ant.design/docs/react/introduce
- **Zustand:** https://docs.pmnd.rs/zustand/
- **MongoDB:** https://www.mongodb.com/docs/manual/

### 17.2 Comunidades

- **Cursor Discord:** https://discord.gg/cursor
- **Stack Overflow:** Tag [cursor-ide]
- **Reddit:** r/cursor

### 17.3 Newsletters e Blogs

- **Cursor Changelog:** https://changelog.cursor.com
- **AI Coding Weekly:** Newsletter sobre IA para devs

---

## 18. Design Assets e Recursos Visuais

### 18.1 Localização dos Assets

**Imagens de Referência do BlockAI:**
- **Caminho:** `/docs/assets/design-reference/`
- **Arquivos:** `split_1.jpg` até `split_9.jpg`
- **Descrição Completa:** Ver `README.md` na pasta

**O que cada imagem contém:**
1. **split_1.jpg** - Landing page, logo, stack tecnológica, paleta de cores
2. **split_2.jpg** - Color system detalhado, Google Fonts, features
3. **split_3.jpg** - Recursos adicionais, documentação
4. **split_4.jpg** - AI Search Engine (Página #1) - sidebar, tabelas, paginação
5. **split_5.jpg** - Watchlist (Página #2) - tabs, filtros, dados financeiros
6. **split_6.jpg** - Token Explorer (Página #3) - cards com gráficos, tabelas
7. **split_7.jpg** - Token Explorer (continuação) - mais dados tabulares
8. **split_8.jpg** - Additional Information (Página #4) - redes sociais, formulário
9. **split_9.jpg** - Settings (Página #5) - configurações de perfil e notificações

### 18.2 Uso com Gemini 2.5 Pro (Conversão de Design para Código)

O Gemini 2.5 Pro tem capacidade **multimodal** - pode ver e entender imagens.

**Workflow Recomendado:**

#### Passo 1: Preparar Contexto
```
@context7 load PROJECT_BRIEF.md

Carregue o contexto do ControlFin para entender o projeto.
```

#### Passo 2: Anexar Imagem e Solicitar Conversão
```
@model gemini-2.5-pro

[Anexar imagem: split_4.jpg ou outra]

Converta este design em código React + TypeScript + Ant Design 5 + SCSS.

Contexto:
- Projeto: ControlFin (ver PROJECT_BRIEF.md)
- Stack: React 18, TypeScript, Ant Design 5, SCSS
- Cores: Use variáveis SCSS do BlockAI (ver IA-IMPROVEMENTS.md seção 10.1)

Requisitos:
1. Componentes Ant Design 5 (Table, Card, Button, etc.)
2. Cores exatas do BlockAI ($bg-primary, $accent-primary, etc.)
3. Tipografia: Inter/Poppins (Google Fonts)
4. Totalmente responsivo (breakpoints: 768px, 1024px, 1920px)
5. Hover states e transições suaves
6. Accessibility (WCAG AA)

Forneça:
- Componente React (.tsx)
- Estilos SCSS (.scss) usando variáveis
- Props TypeScript bem definidas
- Exemplo de uso
```

#### Passo 3: Refinar o Resultado
Se necessário, peça ajustes:
```
@model gemini-2.5-pro

O código está bom, mas:
1. Ajuste o espaçamento para usar variáveis $spacing-*
2. Adicione skeleton loading enquanto carrega dados
3. Adicione empty state quando não há dados
```

### 18.3 Extração de Cores com IA

Se precisar de cores exatas de uma parte específica:

```
@model gemini-2.5-pro

[Anexar imagem]

Extraia a paleta de cores exata desta imagem.
Para cada cor, forneça:
- Código HEX
- Nome descritivo
- Onde é usada (background, texto, accent, etc.)

Formato: lista markdown com códigos HEX.
```

### 18.4 Criação de Variantes

Para criar variações de componentes:

```
@model gemini-2.5-pro

[Anexar split_4.jpg]

Este é o design de uma tabela. Crie 3 variações:

1. **Compact Mode**: Reduzir padding, tamanho de fonte menor
2. **Expanded Mode**: Adicionar mais colunas, ações inline
3. **Card Mode**: Mostrar mesmos dados em cards (para mobile)

Todas devem usar as mesmas cores BlockAI e Ant Design.
```

### 18.5 Checklist de Fidelidade Visual

Antes de considerar um componente "completo", verifique:

```
@cursor Compare meu componente com a imagem de referência [anexar imagem].

Verifique fidelidade visual:
- [ ] Cores correspondem exatamente
- [ ] Espaçamentos corretos (múltiplos de 8px)
- [ ] Tipografia (fonte, peso, tamanho)
- [ ] Border radius correto
- [ ] Sombras aplicadas
- [ ] Hover states implementados
- [ ] Ícones corretos (Ant Design Icons)
- [ ] Responsivo em todos breakpoints

Liste discrepâncias encontradas com sugestões de correção.
```

### 18.6 Biblioteca de Componentes Visual

Crie uma "galeria" de componentes conforme implementa:

```typescript
// src/pages/StyleGuide.tsx
// Página interna para visualizar todos os componentes

import { TransactionCard } from '@/components/transactions/TransactionCard';
import { BudgetProgress } from '@/components/budget/BudgetProgress';
// ... outros componentes

export const StyleGuide = () => {
  return (
    <div style={{ padding: '24px' }}>
      <h1>ControlFin - Style Guide</h1>
      
      <section>
        <h2>Colors</h2>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ width: 100, height: 100, background: '#2d3561' }}>Primary</div>
          <div style={{ width: 100, height: 100, background: '#00d9ff' }}>Accent</div>
          {/* ... outras cores */}
        </div>
      </section>
      
      <section>
        <h2>Components</h2>
        <TransactionCard transaction={mockTransaction} />
        <BudgetProgress current={750} total={1000} category="Alimentação" />
        {/* ... outros componentes */}
      </section>
    </div>
  );
};
```

Acesse via `/style-guide` para comparar visualmente com as imagens do BlockAI.

### 18.7 Dicas Avançadas

**1. Split de Tela para Comparação:**
- Abra a imagem de referência em uma janela
- Abra o navegador com seu app em outra
- Compare lado a lado pixel por pixel

**2. Overlay de Imagem (DevTools):**
```javascript
// Console do navegador
// Cole a imagem de referência como overlay transparente
const img = document.createElement('img');
img.src = '/docs/assets/design-reference/split_4.jpg';
img.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;opacity:0.5;pointer-events:none;z-index:99999';
document.body.appendChild(img);
```

**3. Color Picker do Navegador:**
- Use extensão "ColorZilla" ou similar
- Clique nas imagens de referência para extrair cores exatas
- Verifique se suas variáveis SCSS correspondem

**4. Screenshot Comparison:**
```
@cursor Compare este screenshot do meu componente com a imagem de referência.

[Anexar screenshot do seu app]
[Anexar imagem de referência]

Liste diferenças visuais e sugira correções.
```

---

## 19. Conclusão e Próximos Passos

### 19.1 Setup Inicial (Faça AGORA)

1. **Configurar Cursor:**
   - [ ] Aplicar settings.json
   - [ ] Configurar keyboard shortcuts
   - [ ] Instalar extensões essenciais

2. **Criar .cursorrules:**
   - [ ] Frontend: copiar template
   - [ ] Backend: copiar template

3. **Configurar Git Hooks:**
   - [ ] Instalar Husky
   - [ ] Configurar lint-staged
   - [ ] Configurar Commitlint

4. **Configurar MCPs:**
   - [ ] Testar GitHub MCP
   - [ ] Testar Context7
   - [ ] Testar Memory Bank

5. **Primeira Sessão:**
   - [ ] Carregar PROJECT_BRIEF com @context7
   - [ ] Salvar decisões de arquitetura no Memory Bank
   - [ ] Criar primeiro componente com template

### 19.2 Métricas de Sucesso

Meça o impacto dessas otimizações:

**Velocidade:**
- Tempo médio para implementar feature (baseline vs. com IA)
- Bugs encontrados em code review (menos = melhor)

**Qualidade:**
- Cobertura de testes (target: 70%+)
- Issues encontrados em produção (menos = melhor)
- Lighthouse score (target: 90+)

**Custo:**
- Tokens usados por semana (otimizar com Gemini Flash)
- Tempo de CI/CD (otimizar workflows)

### 19.3 Melhoria Contínua

**Semanalmente:**
- Revisar Memory Bank e adicionar novos aprendizados
- Atualizar .cursorrules com novos padrões
- Otimizar prompts que não funcionaram bem

**Mensalmente:**
- Avaliar quais modelos funcionam melhor para quais tasks
- Ajustar estratégia multi-modelo
- Adicionar novos templates de código

---

## 🎯 Ação Imediata

**Primeira coisa a fazer AGORA:**

```bash
# 1. Criar .cursorrules
cd controlfin-frontend
curl -o .cursorrules [URL deste documento]

cd ../controlfin-backend
curl -o .cursorrules [URL deste documento]

# 2. Aplicar settings.json no Cursor
# Copiar seção 1.1 deste documento

# 3. Instalar Husky
npm install -D husky lint-staged @commitlint/cli @commitlint/config-conventional
npx husky install

# 4. Primeira interação com IA otimizada
cursor .
# No Chat (Cmd+L):
@context7 load PROJECT_BRIEF.md

Resuma o projeto e me guie pelos próximos passos.
```

---

---

## 💎 RESUMO EXECUTIVO: Vibe Coding em 5 Minutos

**Você raramente vai programar. A IA programa. Você arquiteta e revisa.**

### Setup Inicial (Faça 1x)

```bash
# 1. Aplicar settings minimalista (seção 1.1)
# 2. Criar .cursorrules (seção 2)
# 3. Instalar Husky (seção 6.2)
npm install -D husky lint-staged @commitlint/cli @commitlint/config-conventional
npx husky install
```

### Seu Workflow Diário

**1. Abrir Cursor (Cmd+L)**
```
@cursor Você é desenvolvedor sênior full-stack. Eu sou arquiteto.

Regras:
1. Sempre siga .cursorrules e PROJECT_BRIEF.md
2. Use cores BlockAI exatas
3. NUNCA pergunte detalhes triviais
4. SEMPRE implemente solução completa
5. SEMPRE adicione error handling e loading

Confirme.
```

**2. Delegar Feature Completa**
```
@cursor Implemente [FEATURE] completa:

O QUE: [2-3 frases do que usuário faz]

TECH:
- Backend: [endpoints]
- Frontend: [páginas/componentes]
- Dados: [campos]

DELEGAÇÃO TOTAL - você decide tudo. NÃO ME PERGUNTE NADA.
```

**3. Revisar (10 segundos)**
```
@cursor Revise código.
Apenas problemas CRÍTICOS (segurança, bugs, performance).
```

**4. Commit Automático**
```
@github-mcp Gere commit message.
```

### Modelos para Usar

| Task | Modelo | Motivo |
|------|--------|--------|
| Feature Backend | Claude Sonnet 4 | Segurança + lógica |
| Feature Frontend | Gemini 2.0 Flash | Rápido + ilimitado |
| Design → Código | Gemini 2.5 Pro | Multimodal |
| Debug | Claude Sonnet 4 | Análise profunda |

### Atalhos que Importam

- `Cmd+L`: Chat IA (90% do tempo)
- `Cmd+Shift+L`: Composer (features grandes)
- `Cmd+K Enter`: Aceitar código

### Design → Código em 30s

```
@model gemini-2.5-pro
[ANEXAR split_X.jpg]

Converta em React + Ant Design + SCSS.
Cores BlockAI. Responsivo. Código completo.
```

### Debugging em 10s

```
@cursor Bug: [COLAR ERRO]
Conserte AGORA. Explique depois.
```

### Otimização de Custos

- **Gemini Flash (ilimitado)**: UI, CSS, testes, docs
- **Claude Sonnet 4 (limitado)**: Backend, segurança, debug complexo
- **Gemini 2.5 Pro**: Design para código

### MCPs Úteis

```
@task-planner [Feature grande] → quebra em tasks pequenas
@github-mcp → commits e PRs automáticos
@context7 /ant-design/ant-design → docs de libs
@memory-bank save decision → salvar decisões
```

### Quando Algo Der Errado

1. Cole erro completo no chat
2. Adicione contexto (o que tentava fazer)
3. IA diagnostica e conserta
4. Você apenas aprova

### Checklist Pré-Deploy

```
[ ] CI passou (lint, types, tests) - automático via Husky
[ ] Code review IA feito
[ ] Design matches BlockAI colors
[ ] Responsivo testado (mobile, desktop)
```

---

**Documento mantido por:** Engenheiro de Software Sênior (IA)  
**Versão:** 2.0.0 - Vibe Coding Edition  
**Última Atualização:** 30 de Setembro de 2025  
**Compatível com:** Cursor PRO, Google AI Pro, GitHub Student Pack

🎯 **Vibe Coding = Você pensa, IA codifica. Simples assim!**
