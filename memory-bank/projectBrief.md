# PROJECT BRIEF: ControlFin

---

## 1. Identidade

**Nome do Projeto:** ControlFin

**Persona do Agente:** Engenheiro de Software Sênior

**Princípios Orientadores:**

- **Qualidade:** Código limpo, bem estruturado e testável
- **Segurança:** Proteção de dados sensíveis, autenticação robusta, validação rigorosa
- **Automação:** CI/CD para reduzir erros humanos e acelerar entregas
- **Decisões baseadas em Trade-offs:** Toda escolha técnica deve ser justificada com análise explícita de prós e contras

---

## 2. Objetivo

### Visão Geral

O **ControlFin** é um Progressive Web App (PWA) moderno e seguro para controle de finanças pessoais e compartilhadas. A aplicação permite que indivíduos ou casais gerenciem suas finanças de forma colaborativa através de "Espaços Financeiros" compartilhados, com rastreamento completo de transações, planejamento de gastos, definição de metas de economia e análise visual de dados financeiros.

O ControlFin oferece uma experiência de usuário otimizada tanto em desktops quanto em dispositivos móveis, com suporte a instalação como aplicativo nativo e funcionalidades offline básicas. A aplicação prioriza simplicidade, clareza visual e insights acionáveis para ajudar os usuários a tomarem melhores decisões financeiras.

### Público-Alvo

- **Indivíduos** que buscam uma ferramenta completa e moderna para controle de finanças pessoais
- **Casais** que desejam gerenciar suas finanças de forma colaborativa e transparente
- **Usuários mobile-first** que necessitam de acesso rápido e confiável em qualquer dispositivo
- **Pessoas que valorizam privacidade** e querem controle total sobre seus dados financeiros

---

## 3. Contexto

### Escopo do MVP

#### 3.1 Gestão de Usuários e Colaboração

- **Cadastro e Login:**
  - Autenticação via e-mail e senha (com hash bcrypt)
  - Login obrigatório via Google OAuth 2.0
  - Validação de e-mail e requisitos de senha forte
  - Recuperação de senha via e-mail
- **Espaços Financeiros Compartilhados:**
  - Criação de um "Espaço Financeiro" associado a até 2 usuários
  - Convite de segundo usuário via e-mail
  - Todas as transações registram qual usuário a efetuou (auditoria)
  - Ambos os usuários têm permissões iguais de leitura e escrita

#### 3.2 Gestão de Transações

- **CRUD Completo de Transações:**
  - Criar nova transação (receita ou despesa)
  - Listar transações com filtros (data, categoria, tipo, usuário)
  - Editar transação existente
  - Remover transação (soft delete com flag de arquivamento)
- **Atributos de Transação:**
  - Tipo (receita ou despesa)
  - Valor monetário (armazenado em centavos para evitar problemas de ponto flutuante)
  - Data da transação
  - Categoria (selecionável de lista pré-definida e customizável)
  - Descrição/nota
  - Método de pagamento (dinheiro, débito, PIX, cartão de crédito)
  - Cartão de crédito associado (se aplicável)
  - Status (efetivada, pendente, recorrente)
  - Usuário que registrou a transação
- **Categorização:**
  - Categorias pré-definidas: Alimentação, Transporte, Moradia, Lazer, Saúde, Educação, Vestuário, Outros
  - Possibilidade de criar categorias personalizadas
  - Ícones visuais para cada categoria
- **Gestão de Cartões de Crédito:**
  - Cadastro de cartões com nome, bandeira, limite e data de fechamento
  - Associação de despesas a cartões específicos
  - Visualização de fatura consolidada por período
  - Cálculo automático do total da fatura
  - Indicador de limite disponível vs. utilizado

#### 3.3 Planejamento e Orçamento

- **Gastos Fixos:**
  - Registro de despesas recorrentes (aluguel, assinaturas, contas mensais)
  - Data de vencimento e valor fixo
  - Criação automática de transação pendente no início do mês
- **Gastos Variáveis:**
  - Planejamento de gastos que variam mês a mês
  - Estimativa de valores com base em histórico
- **Orçamentos (Budgets):**
  - Definição de meta de gastos por categoria (ex: "R$ 1.500 para Alimentação")
  - Definição de meta geral mensal
  - Visualização em tempo real de:
    - Valor orçado
    - Valor gasto até o momento
    - Saldo restante (ou estouro)
    - Percentual utilizado
  - Indicadores visuais (barra de progresso, cores de alerta)
- **Metas de Economia:**
  - Criação de metas de longo prazo (ex: "Viagem para Europa", "Reserva de Emergência")
  - Definição de valor alvo e prazo
  - Registro de aportes mensais
  - Visualização de progresso com gráfico e percentual atingido
  - Projeção de data de conclusão baseada em aportes históricos

#### 3.4 Análise e Relatórios

- **Dashboard Principal:**
  - Saldo atual (receitas - despesas acumuladas)
  - Total de receitas do mês atual
  - Total de despesas do mês atual
  - Comparação rápida: mês atual vs. mês anterior
  - Principais categorias de gastos (top 5)
  - Progresso de metas de economia
  - Alertas e notificações pendentes
- **Comparações Temporais:**
  - Comparação de gastos entre meses diferentes
  - Comparação de receitas entre períodos
  - Visualização de tendências (crescimento/redução)
  - Filtros por período: semana, mês, trimestre, semestre, ano, customizado
- **Gráficos Analíticos:**
  - **Gráfico de Pizza:** Distribuição de despesas por categoria
  - **Gráfico de Barras:** Comparação de receitas vs. despesas por mês
  - **Gráfico de Linha:** Evolução do saldo ao longo do tempo
  - **Gráfico de Barras Horizontais:** Ranking de categorias de gastos
  - Todos os gráficos interativos (hover, drill-down, filtros)
- **Insights Automáticos:**
  - Detecção de aumento/redução significativa em categorias (> 20%)
  - Identificação de gastos atípicos
  - Sugestões de economia baseadas em padrões
  - Exemplos:
    - "Você gastou 30% a mais com 'Alimentação' este mês."
    - "Sua média de gastos com 'Transporte' caiu 15% nos últimos 3 meses."
    - "Você está próximo de atingir sua meta de economia 'Reserva de Emergência'."

#### 3.5 Notificações e Alertas

- **Alertas de Orçamento:**
  - Notificação ao atingir 80% do orçamento de uma categoria
  - Notificação ao estourar o orçamento (100%+)
  - Frequência configurável (tempo real, diária, semanal)
- **Lembretes de Contas:**
  - Notificação de contas fixas próximas ao vencimento (3 dias antes)
  - Notificação no dia do vencimento
  - Lista de contas pendentes no dashboard
- **Notificações de Metas:**
  - Celebração ao atingir 50%, 75% e 100% de uma meta de economia
  - Lembrete de aporte mensal para metas configuradas

### Fora do Escopo do MVP

- **Integração Bancária Automática:** Sincronização com bancos via Open Banking (pode ser considerado em versões futuras)
- **Gestão de Investimentos:** Acompanhamento de ações, fundos, renda fixa, etc.
- **Múltiplos Espaços Compartilhados:** MVP limitado a 1 espaço financeiro por usuário
- **Anexo de Comprovantes:** Upload de imagens/PDF de recibos (prioridade baixa, post-MVP)
- **Exportação de Relatórios:** Geração de PDF/Excel (futuro)
- **Suporte Multi-idioma:** MVP apenas em Português do Brasil
- **Gamificação:** Badges, conquistas, rankings (futuro)
- **Integração com Assistentes Virtuais:** Alexa, Google Assistant (futuro)

---

## 4. Diretrizes de Design

### 4.1 Estilo Visual

**Tema:** Dark Mode como padrão (sem opção de personalização no MVP)

**Referência de Design:** Baseado no template **BlockAI Admin Crypto Trading Dashboard**

- Ver imagens de referência em `/docs/assets/design-reference/`
- 9 imagens (split_1.jpg a split_9.jpg) compõem o design completo

**Paleta de Cores Base (BlockAI):**

- **Background Principal:** `#2d3561` (azul-roxo escuro profundo)
- **Background Sidebar:** `#1f2347` (azul muito escuro)
- **Background de Cards:** `#363d65` (azul médio escuro)
- **Texto Principal:** `#ffffff` (branco)
- **Texto Secundário:** `#a0a4b8` (cinza azulado claro)
- **Cor Primária (Accent):** `#00d9ff` (azul ciano elétrico)
- **Cor Secundária (Accent):** `#2196f3` (azul royal)
- **Cor de Sucesso:** `#00ff88` (verde neon)
- **Cor de Alerta:** `#ffaa00` (laranja)
- **Cor de Erro:** `#ff3366` (vermelho vibrante)

**Princípios de Design:**

- **Minimalismo:** Interfaces limpas, sem elementos desnecessários
- **Hierarquia Clara:** Uso de tamanhos de fonte, pesos e espaçamento para guiar o olhar
- **Feedback Visual:** Animações sutis para ações do usuário (hover, click, loading)
- **Consistência:** Padrões visuais repetidos em toda a aplicação
- **Acessibilidade:** Contraste adequado (WCAG AA), textos legíveis, áreas de toque adequadas
- **Glassmorphism Sutil:** Efeitos de blur e transparência discretos em overlays e modais
- **Sidebar Vertical:** Menu lateral fixo com ícones e navegação intuitiva

**Tipografia (Google Fonts - Gratuitas):**

- **Fonte Principal:** Inter, Poppins ou Roboto (sans-serif modernas e legíveis)
- **Pesos Recomendados:**
  - 300 (Light) - Textos secundários e descrições
  - 400 (Regular) - Corpo do texto principal
  - 600 (Semibold) - Títulos, labels e destaques
- **Tamanhos:**
  - Headings: 24px - 32px (weight: 600)
  - Body: 14px - 16px (weight: 400)
  - Captions: 12px (weight: 300)
  - Small: 11px (weight: 400)

**Espaçamento:**

- Sistema de espaçamento baseado em múltiplos de 8px (8, 16, 24, 32, 48, 64)

**Ícones:**

- Biblioteca de ícones do Ant Design Icons (outline style)
- Ícones customizados para categorias financeiras
- Ícones monocromáticos com cor adaptável ao contexto

**Referência Visual (Crítico - Consultar Durante Todo o Desenvolvimento):**

- **Design Base:** BlockAI Admin Crypto Trading Dashboard
- **Localização:** `/docs/assets/design-reference/split_*.jpg` (9 imagens)
- **Elementos-Chave:**
  - Sidebar vertical escura (`#1f2347`) com ~240px de largura
  - Cards flutuantes com fundo `#363d65` e sombras suaves
  - Tabelas modernas com bordas sutis e paginação azul ciano
  - Gráficos Highcharts com cores vibrantes e gradientes
  - Glassmorphism sutil em overlays e modais (backdrop-blur)
  - Botões primários com fundo ciano `#00d9ff`
  - Inputs com fundo `#363d65` e glow ciano no focus
  - Badges arredondados com cores vibrantes
- **Uso Recomendado:** Use Gemini 2.5 Pro (multimodal) para converter as imagens em código diretamente

### 4.2 Bibliotecas de UI

**Ant Design 5:**

- **Justificativa:** Biblioteca madura com componentes prontos para produção, excelente suporte TypeScript, tematização robusta
- **Componentes Principais a Utilizar:**
  - Layout: `Layout`, `Row`, `Col`, `Grid`
  - Formulários: `Form`, `Input`, `Select`, `DatePicker`, `InputNumber`
  - Navegação: `Menu`, `Breadcrumb`, `Tabs`
  - Dados: `Table`, `List`, `Card`, `Statistic`
  - Feedback: `Modal`, `Notification`, `Message`, `Spin`, `Progress`
  - Outros: `Button`, `Badge`, `Tag`, `Avatar`, `Drawer`

**Highcharts:**

- **Justificativa:** Biblioteca de gráficos poderosa e personalizável, com ampla variedade de tipos de gráficos
- **Tipos de Gráficos a Utilizar:**
  - Pie Chart: Distribuição de despesas por categoria
  - Column Chart: Comparação de receitas vs. despesas
  - Line Chart: Evolução de saldo ao longo do tempo
  - Bar Chart: Ranking de categorias
  - Gauge Chart: Indicador de progresso de metas

**Customização:**

- Tema escuro customizado para Ant Design (via `ConfigProvider`)
- Tema escuro customizado para Highcharts (via opções de tema)

### 4.3 Variáveis SCSS e Tema (Referência de Implementação)

Esta seção fornece exemplos práticos de como implementar as cores e estilos do BlockAI.

#### 4.3.1 Arquivo `_variables.scss`

```scss
// ========================================
// COLORS - BlockAI Design System
// ========================================

// Backgrounds
$bg-primary: #2d3561; // Background principal
$bg-sidebar: #1f2347; // Sidebar escura
$bg-card: #363d65; // Cards e containers
$bg-input: #363d65; // Inputs e forms
$bg-hover: #3d4570; // Hover state

// Text Colors
$text-primary: #ffffff; // Texto principal
$text-secondary: #a0a4b8; // Texto secundário
$text-disabled: #6b7280; // Texto desabilitado

// Accent Colors
$accent-primary: #00d9ff; // Ciano elétrico (botões, links)
$accent-secondary: #2196f3; // Azul royal (secundário)
$accent-gradient: linear-gradient(135deg, $accent-primary 0%, $accent-secondary 100%);

// Semantic Colors
$color-success: #00ff88; // Verde neon
$color-warning: #ffaa00; // Laranja
$color-error: #ff3366; // Vermelho vibrante
$color-info: $accent-secondary;

// Borders & Shadows
$border-color: rgba(255, 255, 255, 0.08);
$border-color-hover: rgba(0, 217, 255, 0.3);
$shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.15);
$shadow-md: 0 4px 16px rgba(0, 0, 0, 0.25);
$shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.35);
$shadow-glow: 0 0 20px rgba(0, 217, 255, 0.3);

// ========================================
// TYPOGRAPHY
// ========================================

// Font Family
$font-primary:
  'Inter',
  'Poppins',
  'Roboto',
  -apple-system,
  BlinkMacSystemFont,
  'Segoe UI',
  sans-serif;

// Font Weights
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

// Line Heights
$line-height-tight: 1.2;
$line-height-base: 1.5;
$line-height-relaxed: 1.75;

// ========================================
// SPACING
// ========================================

$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;
$spacing-2xl: 48px;
$spacing-3xl: 64px;

// ========================================
// LAYOUT
// ========================================

$sidebar-width: 240px;
$header-height: 64px;
$border-radius-sm: 4px;
$border-radius-md: 8px;
$border-radius-lg: 12px;
$border-radius-full: 9999px;

// ========================================
// BREAKPOINTS
// ========================================

$breakpoint-xs: 320px; // Mobile small
$breakpoint-sm: 576px; // Mobile
$breakpoint-md: 768px; // Tablet
$breakpoint-lg: 1024px; // Desktop
$breakpoint-xl: 1280px; // Large desktop
$breakpoint-2xl: 1920px; // Extra large

// ========================================
// Z-INDEX
// ========================================

$z-dropdown: 1000;
$z-sticky: 1020;
$z-fixed: 1030;
$z-modal-backdrop: 1040;
$z-modal: 1050;
$z-popover: 1060;
$z-tooltip: 1070;

// ========================================
// TRANSITIONS
// ========================================

$transition-fast: 150ms ease-in-out;
$transition-base: 250ms ease-in-out;
$transition-slow: 350ms ease-in-out;

// ========================================
// GLASSMORPHISM
// ========================================

$glass-bg: rgba(54, 61, 101, 0.7);
$glass-border: rgba(255, 255, 255, 0.1);
$glass-blur: blur(10px);
```

#### 4.3.2 Configuração do Tema Ant Design 5

```typescript
// src/config/antd-theme.ts
import type { ThemeConfig } from 'antd';

export const antdTheme: ThemeConfig = {
  token: {
    // Colors
    colorPrimary: '#00d9ff', // Accent ciano
    colorSuccess: '#00ff88', // Verde neon
    colorWarning: '#ffaa00', // Laranja
    colorError: '#ff3366', // Vermelho
    colorInfo: '#2196f3', // Azul royal

    colorBgContainer: '#363d65', // Background de cards
    colorBgElevated: '#363d65', // Background de modais
    colorBgLayout: '#2d3561', // Background do layout
    colorBgSpotlight: '#3d4570', // Hover/focus

    colorText: '#ffffff', // Texto principal
    colorTextSecondary: '#a0a4b8', // Texto secundário
    colorTextDisabled: '#6b7280', // Texto desabilitado

    colorBorder: 'rgba(255, 255, 255, 0.08)',
    colorBorderSecondary: 'rgba(255, 255, 255, 0.05)',

    // Typography
    fontFamily:
      "'Inter', 'Poppins', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: 14,
    fontSizeHeading1: 32,
    fontSizeHeading2: 24,
    fontSizeHeading3: 18,

    // Spacing & Sizing
    borderRadius: 8,
    controlHeight: 40,

    // Effects
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    boxShadowSecondary: '0 4px 16px rgba(0, 0, 0, 0.25)',
  },

  components: {
    Button: {
      algorithm: true,
      primaryShadow: '0 0 20px rgba(0, 217, 255, 0.3)',
      colorPrimaryHover: '#33e0ff',
      fontWeight: 600,
    },

    Input: {
      colorBgContainer: '#363d65',
      activeBorderColor: '#00d9ff',
      activeShadow: '0 0 0 2px rgba(0, 217, 255, 0.2)',
    },

    Table: {
      colorBgContainer: '#363d65',
      colorBorderSecondary: 'rgba(255, 255, 255, 0.05)',
      headerBg: '#2d3561',
      headerColor: '#ffffff',
      rowHoverBg: '#3d4570',
    },

    Card: {
      colorBgContainer: '#363d65',
      boxShadowTertiary: '0 2px 8px rgba(0, 0, 0, 0.15)',
    },

    Menu: {
      darkItemBg: '#1f2347',
      darkItemSelectedBg: '#363d65',
      darkItemHoverBg: '#2a2f52',
      darkItemColor: '#a0a4b8',
      darkItemSelectedColor: '#00d9ff',
    },

    Modal: {
      contentBg: '#363d65',
      headerBg: '#2d3561',
    },

    Select: {
      colorBgContainer: '#363d65',
      colorBgElevated: '#2d3561',
      optionSelectedBg: '#3d4570',
    },

    Pagination: {
      colorPrimary: '#00d9ff',
      colorPrimaryHover: '#33e0ff',
    },
  },

  algorithm: 'darkAlgorithm' as any, // Ant Design dark algorithm
};

// Usage in App.tsx or main component:
// import { ConfigProvider } from 'antd';
// import { antdTheme } from './config/antd-theme';
//
// <ConfigProvider theme={antdTheme}>
//   <App />
// </ConfigProvider>
```

#### 4.3.3 Exemplo de Uso SCSS com Variáveis

```scss
// Example: TransactionCard.scss
@import 'variables';

.transaction-card {
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $border-radius-md;
  padding: $spacing-md;
  box-shadow: $shadow-sm;
  transition: all $transition-base;

  &:hover {
    border-color: $border-color-hover;
    box-shadow: $shadow-md;
    transform: translateY(-2px);
  }

  .card-title {
    font-size: $font-size-lg;
    font-weight: $font-semibold;
    color: $text-primary;
    margin-bottom: $spacing-sm;
  }

  .card-amount {
    font-size: $font-size-2xl;
    font-weight: $font-semibold;
    color: $accent-primary;

    &.positive {
      color: $color-success;
    }

    &.negative {
      color: $color-error;
    }
  }

  .card-description {
    font-size: $font-size-base;
    color: $text-secondary;
    line-height: $line-height-base;
  }
}

// Glassmorphism modal example
.glass-modal {
  background: $glass-bg;
  border: 1px solid $glass-border;
  backdrop-filter: $glass-blur;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-lg;
}
```

**Nota Importante:** Todas as cores, espaçamentos e estilos devem referenciar as variáveis SCSS. Nunca hardcode valores diretamente nos componentes.

---

## 5. Diretrizes Técnicas

### 5.1 Arquitetura Geral

**Padrão Arquitetural:** Aplicação Full-Stack Separada (Frontend SPA + Backend API REST)

**Fluxo de Dados:**

```
[Cliente PWA] <--HTTPS/JSON--> [API REST] <--MongoDB Driver--> [MongoDB Atlas]
     ^                              ^
     |                              |
[Service Worker]            [Camadas de Validação]
[Cache Local]              [Autenticação JWT]
```

**Justificativa da Separação:**

- ✅ **Escalabilidade Independente:** Front e back podem escalar separadamente
- ✅ **Deploy Independente:** Atualizações do front não requerem redeploy do back
- ✅ **Flexibilidade:** Backend pode servir múltiplos clientes (web, mobile nativo futuro)
- ❌ **Complexidade:** Requer gerenciamento de CORS, deploy em múltiplos serviços

### 5.2 Stack Front-end

#### Tecnologias e Justificativas

**TypeScript (Obrigatório)**

- ✅ **Type Safety:** Redução de erros em runtime, refatoração segura
- ✅ **Melhor DX:** Autocomplete, IntelliSense, documentação inline
- ✅ **Manutenibilidade:** Contratos claros entre componentes
- ❌ **Curva de Aprendizado:** Requer conhecimento de tipos genéricos, interfaces

**React 18**

- ✅ **Ecossistema Maduro:** Vasta quantidade de bibliotecas e recursos
- ✅ **Performance:** Concurrent Rendering, Suspense, lazy loading
- ✅ **Hooks:** Lógica reutilizável sem classes
- ❌ **Boilerplate:** Pode ser verboso para aplicações simples

**Vite (Build Tool)**

- ✅ **Performance:** 10-100x mais rápido que Webpack/CRA em dev mode
- ✅ **HMR Instantâneo:** Hot Module Replacement em milissegundos
- ✅ **Build Otimizado:** Rollup por trás para builds de produção
- ❌ **Ecossistema Menor:** Menos plugins que Webpack (mas suficiente)

**SASS/SCSS**

- ✅ **Produtividade:** Variáveis, mixins, funções, nesting
- ✅ **Organização:** Partials e imports para modularizar estilos
- ✅ **Compatibilidade:** Compila para CSS puro
- ❌ **Build Step Adicional:** Requer compilação (já gerenciado pelo Vite)

**Ant Design 5**

- ✅ **Produtividade:** Componentes prontos reduzem tempo de desenvolvimento
- ✅ **Consistência:** Design system unificado
- ✅ **Acessibilidade:** Componentes seguem padrões WAI-ARIA
- ❌ **Bundle Size:** Pode aumentar tamanho do bundle (mitigado com tree-shaking)

**Highcharts**

- ✅ **Recursos:** Ampla variedade de gráficos e customizações
- ✅ **Performance:** Otimizado para grandes volumes de dados
- ✅ **Cross-browser:** Funciona em todos os navegadores modernos
- ❌ **Licença:** Comercial para uso não-pessoal (verificar necessidade de licença)

**React Router 6**

- ✅ **Roteamento Declarativo:** Definição de rotas como componentes
- ✅ **Nested Routes:** Suporte a rotas aninhadas para layouts complexos
- ✅ **Hooks:** `useNavigate`, `useParams`, `useLocation` para acesso fácil
- ❌ **Breaking Changes:** Migração de v5 para v6 pode ser complexa (não aplicável aqui)

**Zustand (State Management)**

- ✅ **Simplicidade:** API minimalista, menos boilerplate que Redux
- ✅ **Performance:** Renderizações otimizadas via seletores
- ✅ **TypeScript:** Suporte nativo e excelente
- ✅ **DevTools:** Integração com Redux DevTools
- ❌ **Comunidade Menor:** Menos recursos e tutoriais que Redux
- **Trade-off vs Redux:**
  - Zustand: ~1KB, API simples, ideal para projetos pequenos/médios
  - Redux: Mais verboso, mas padrão da indústria com ecossistema massivo

**PWA (Service Workers + Manifest)**

- ✅ **Instalabilidade:** Usuário pode instalar como app nativo
- ✅ **Offline:** Cache de assets críticos para funcionalidade básica offline
- ✅ **Engajamento:** Notificações push (futuro)
- ❌ **Complexidade:** Gerenciamento de cache, estratégias de atualização

#### Estrutura de Pastas (Frontend)

```
controlfin-frontend/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── icons/                 # Ícones para PWA (diversos tamanhos)
│   ├── assets/                # Assets estáticos (imagens, logos)
│   └── robots.txt
├── docs/
│   └── assets/
│       └── design-reference/  # Imagens de referência do BlockAI
├── src/
│   ├── assets/                # Imagens, fontes, ícones estáticos
│   ├── components/            # Componentes reutilizáveis
│   │   ├── common/            # Botões, inputs customizados, etc.
│   │   ├── layout/            # Header, Sidebar, Footer
│   │   └── charts/            # Wrappers para Highcharts
│   ├── pages/                 # Páginas/rotas principais
│   │   ├── Auth/              # Login, Register, ForgotPassword
│   │   ├── Dashboard/         # Dashboard principal
│   │   ├── Transactions/      # Lista e CRUD de transações
│   │   ├── Budget/            # Orçamentos e planejamento
│   │   ├── Goals/             # Metas de economia
│   │   ├── Reports/           # Relatórios e análises
│   │   └── Settings/          # Configurações do usuário e espaço
│   ├── services/              # Chamadas à API (axios)
│   │   ├── api.ts             # Configuração do axios
│   │   ├── auth.service.ts
│   │   ├── transactions.service.ts
│   │   ├── budget.service.ts
│   │   └── goals.service.ts
│   ├── store/                 # Zustand stores
│   │   ├── authStore.ts
│   │   ├── transactionsStore.ts
│   │   ├── budgetStore.ts
│   │   └── goalsStore.ts
│   ├── types/                 # TypeScript interfaces e types
│   │   ├── user.types.ts
│   │   ├── transaction.types.ts
│   │   ├── budget.types.ts
│   │   └── goal.types.ts
│   ├── utils/                 # Funções utilitárias
│   │   ├── formatters.ts      # Formatação de moeda, data
│   │   ├── validators.ts      # Validações customizadas
│   │   └── constants.ts       # Constantes da aplicação
│   ├── styles/                # Estilos globais SCSS
│   │   ├── variables.scss     # Variáveis de cor, tamanho, etc.
│   │   ├── mixins.scss        # Mixins reutilizáveis
│   │   ├── global.scss        # Estilos globais
│   │   └── antd-theme.scss    # Customização do tema Ant Design
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useTransactions.ts
│   │   └── useNotifications.ts
│   ├── routes/                # Configuração de rotas
│   │   ├── AppRoutes.tsx
│   │   └── PrivateRoute.tsx   # Higher-order component para rotas protegidas
│   ├── App.tsx                # Componente raiz
│   ├── main.tsx               # Entry point
│   ├── vite-env.d.ts
│   └── service-worker.ts      # Service Worker para PWA
├── .env.example               # Exemplo de variáveis de ambiente
├── .eslintrc.cjs              # Configuração ESLint
├── .prettierrc                # Configuração Prettier
├── tsconfig.json              # Configuração TypeScript
├── vite.config.ts             # Configuração Vite
└── package.json
```

### 5.3 Stack Back-end

#### Tecnologias e Justificativas

**Node.js 22+ (LTS)**

- ✅ **Performance:** V8 engine otimizada, event loop assíncrono
- ✅ **Ecossistema:** NPM com milhões de pacotes
- ✅ **Full Stack JS:** Mesma linguagem no front e back (TypeScript)
- ❌ **Single Thread:** CPU-bound tasks podem bloquear (mitigado com workers)

**Fastify**

- ✅ **Performance:** ~20% mais rápido que Express (benchmarks oficiais)
- ✅ **TypeScript First:** Suporte nativo e tipos excelentes
- ✅ **Schema Validation:** Validação integrada via JSON Schema (complementado com Zod)
- ✅ **Plugins:** Arquitetura de plugins robusta
- ❌ **Comunidade Menor:** Menos middlewares prontos que Express
- **Trade-off vs Express:**
  - Fastify: Mais rápido, melhor TypeScript, validação integrada
  - Express: Maior comunidade, mais middlewares, padrão de facto

**MongoDB (MongoDB Atlas)**

- ✅ **Flexibilidade:** Schema-less permite iteração rápida
- ✅ **Performance:** Excelente para leituras/escritas rápidas
- ✅ **Escalabilidade Horizontal:** Sharding nativo
- ✅ **JSON-like:** Estrutura de dados alinhada com JavaScript/TypeScript
- ❌ **Joins:** Menos eficiente que SQL para queries complexas com múltiplas relações
- ❌ **Consistência:** Eventual consistency em clusters (não problema para este caso de uso)
- **Trade-off vs PostgreSQL:**
  - MongoDB: Melhor para estruturas aninhadas, iteração rápida, escalabilidade
  - PostgreSQL: Melhor para dados relacionais complexos, transações ACID críticas

**Zod (Validação)**

- ✅ **TypeScript Native:** Inferência de tipos automática
- ✅ **API Declarativa:** Schemas legíveis e expressivos
- ✅ **Validação Robusta:** Mensagens de erro customizáveis
- ✅ **Composição:** Schemas reutilizáveis
- ❌ **Performance:** Levemente mais lento que Joi (diferença negligível)

**JSON Web Tokens (JWT)**

- ✅ **Stateless:** Não requer armazenamento de sessões no servidor
- ✅ **Escalabilidade:** Funciona bem em ambientes distribuídos
- ✅ **Padrão da Indústria:** RFC 7519, amplamente suportado
- ❌ **Revogação:** Difícil revogar tokens antes da expiração (mitigado com blacklist ou short-lived tokens)
- **Estratégia de Tokens:**
  - Access Token: JWT de curta duração (15 minutos)
  - Refresh Token: Armazenado no DB, longa duração (7 dias), permite renovação

**bcrypt (Hashing de Senhas)**

- ✅ **Seguro:** Algoritmo testado e confiável
- ✅ **Salt Automático:** Proteção contra rainbow tables
- ✅ **Custo Ajustável:** Permite aumentar complexidade com o tempo
- ❌ **Performance:** Mais lento que algoritmos simples (intencional para segurança)

#### Estrutura de Pastas (Backend)

```
controlfin-backend/
├── src/
│   ├── config/                # Configurações
│   │   ├── database.ts        # Conexão MongoDB
│   │   ├── env.ts             # Validação de .env com Zod
│   │   └── jwt.ts             # Configuração JWT
│   ├── modules/               # Módulos da aplicação (feature-based)
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.schemas.ts      # Zod schemas
│   │   │   └── auth.types.ts
│   │   ├── users/
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.routes.ts
│   │   │   ├── user.model.ts        # Mongoose model
│   │   │   ├── user.schemas.ts
│   │   │   └── user.types.ts
│   │   ├── spaces/              # Espaços Financeiros
│   │   ├── transactions/
│   │   ├── categories/
│   │   ├── cards/               # Cartões de crédito
│   │   ├── budgets/
│   │   ├── goals/               # Metas de economia
│   │   ├── notifications/
│   │   └── insights/            # Geração de insights
│   ├── middlewares/
│   │   ├── auth.middleware.ts   # Verificação JWT
│   │   ├── validation.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── rateLimiter.middleware.ts
│   ├── utils/
│   │   ├── logger.ts            # Winston ou Pino
│   │   ├── errors.ts            # Classes de erro customizadas
│   │   └── helpers.ts
│   ├── plugins/                 # Plugins Fastify customizados
│   │   ├── cors.plugin.ts
│   │   └── swagger.plugin.ts    # Documentação automática
│   ├── app.ts                   # Configuração do Fastify
│   └── server.ts                # Entry point
├── tests/                       # Testes (Vitest ou Jest)
│   ├── unit/
│   └── integration/
├── .env.example
├── .eslintrc.cjs
├── .prettierrc
├── tsconfig.json
├── package.json
└── openapi.yaml                 # Documentação da API (gerada automaticamente ou manual)
```

### 5.4 Schema do Banco de Dados (MongoDB)

#### Justificativa de Estrutura

**Abordagem:** Modelagem híbrida (embedding + referencing)

- **Embedding:** Quando dados são acessados juntos frequentemente e têm relação 1-para-poucos
- **Referencing:** Quando dados são grandes, acessados separadamente, ou têm relação muitos-para-muitos

#### Collections e Schemas

##### 1. **Users Collection**

```typescript
{
  _id: ObjectId,
  email: string,              // Unique, indexed
  password: string,           // Hashed com bcrypt (não armazenado se login for só Google)
  googleId: string?,          // ID do Google OAuth (optional, unique se presente)
  name: string,
  avatar: string?,            // URL da imagem de perfil
  createdAt: Date,
  updatedAt: Date,
  refreshTokens: [            // Array de refresh tokens ativos
    {
      token: string,          // Hashed
      expiresAt: Date,
      createdAt: Date
    }
  ]
}
```

**Índices:**

- `email` (unique)
- `googleId` (unique, sparse)

**Justificativa:**

- Refresh tokens embedded pois são pequenos, limitados (max 5) e sempre acessados com o user

##### 2. **FinancialSpaces Collection**

```typescript
{
  _id: ObjectId,
  name: string,               // Ex: "Finanças do Casal Silva"
  members: [                  // Array de ObjectId referenciando Users
    {
      userId: ObjectId,       // Ref: Users
      role: string,           // "owner" ou "member"
      joinedAt: Date
    }
  ],                          // Max 2 membros no MVP
  invitations: [              // Convites pendentes
    {
      email: string,
      invitedBy: ObjectId,    // Ref: Users
      invitedAt: Date,
      status: string          // "pending" | "accepted" | "rejected"
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

**Índices:**

- `members.userId` (para queries de espaços de um usuário)

**Justificativa:**

- Members embedded pois são apenas 2 e sempre carregados com o espaço
- Permite futura expansão para mais membros

##### 3. **Categories Collection**

```typescript
{
  _id: ObjectId,
  name: string,
  icon: string,               // Nome do ícone (ex: "ShoppingCartOutlined")
  color: string,              // Hex color
  type: string,               // "income" | "expense"
  isDefault: boolean,         // Se é categoria padrão (não pode ser deletada)
  spaceId: ObjectId?,         // Ref: FinancialSpaces (null para categorias globais)
  createdAt: Date
}
```

**Índices:**

- `spaceId`
- Compound: `spaceId` + `isDefault`

**Justificativa:**

- Collection separada para permitir categorias customizadas por espaço
- Categorias padrões (isDefault=true) compartilhadas por todos

##### 4. **Transactions Collection**

```typescript
{
  _id: ObjectId,
  spaceId: ObjectId,          // Ref: FinancialSpaces
  userId: ObjectId,           // Ref: Users (quem criou a transação)
  type: string,               // "income" | "expense"
  amount: number,             // Em centavos (ex: 15099 = R$ 150,99)
  categoryId: ObjectId,       // Ref: Categories
  description: string,
  date: Date,                 // Data da transação
  paymentMethod: string,      // "cash" | "debit" | "pix" | "credit_card"
  creditCardId: ObjectId?,    // Ref: CreditCards (se paymentMethod = credit_card)
  status: string,             // "completed" | "pending" | "scheduled"
  isRecurring: boolean,
  recurringConfig: {          // Apenas se isRecurring = true
    frequency: string,        // "daily" | "weekly" | "monthly" | "yearly"
    endDate: Date?,
    nextOccurrence: Date
  }?,
  attachments: [              // URLs de comprovantes (post-MVP)
    string
  ],
  tags: [string],             // Tags customizadas
  createdAt: Date,
  updatedAt: Date,
  isDeleted: boolean          // Soft delete
}
```

**Índices:**

- `spaceId` + `date` (compound, para queries de transações por período)
- `spaceId` + `categoryId`
- `spaceId` + `creditCardId`
- `userId`

**Justificativa:**

- Collection de alto volume, referencing para espaços/usuários evita duplicação
- Soft delete (isDeleted) permite auditoria e possível recuperação

##### 5. **CreditCards Collection**

```typescript
{
  _id: ObjectId,
  spaceId: ObjectId,          // Ref: FinancialSpaces
  name: string,               // Ex: "Nubank", "Itaú Gold"
  lastFourDigits: string,     // Últimos 4 dígitos
  brand: string,              // "visa" | "mastercard" | "elo" | "amex"
  limit: number,              // Em centavos
  closingDay: number,         // Dia do fechamento (1-31)
  dueDay: number,             // Dia do vencimento (1-31)
  createdAt: Date,
  updatedAt: Date,
  isActive: boolean
}
```

**Índices:**

- `spaceId`

**Justificativa:**

- Separado para facilitar CRUD independente de transações

##### 6. **Budgets Collection**

```typescript
{
  _id: ObjectId,
  spaceId: ObjectId,          // Ref: FinancialSpaces
  name: string?,              // Nome customizado (ex: "Orçamento Janeiro")
  type: string,               // "category" | "general"
  categoryId: ObjectId?,      // Ref: Categories (apenas se type = category)
  amount: number,             // Meta em centavos
  period: string,             // "monthly" | "weekly" | "yearly"
  startDate: Date,
  endDate: Date,
  createdAt: Date,
  updatedAt: Date,
  isActive: boolean
}
```

**Índices:**

- `spaceId` + `period` + `isActive`
- `spaceId` + `categoryId`

**Justificativa:**

- Permite múltiplos orçamentos por período (ex: um por categoria + um geral)

##### 7. **SavingsGoals Collection**

```typescript
{
  _id: ObjectId,
  spaceId: ObjectId,          // Ref: FinancialSpaces
  name: string,               // Ex: "Viagem para Europa"
  description: string?,
  targetAmount: number,       // Meta em centavos
  currentAmount: number,      // Valor atual acumulado em centavos
  targetDate: Date?,          // Data alvo (opcional)
  contributions: [            // Embedded - histórico de aportes
    {
      amount: number,
      date: Date,
      userId: ObjectId        // Ref: Users
    }
  ],
  createdAt: Date,
  updatedAt: Date,
  completedAt: Date?,         // Data de conclusão
  status: string              // "active" | "completed" | "cancelled"
}
```

**Índices:**

- `spaceId` + `status`

**Justificativa:**

- Contributions embedded pois são acessados sempre com a meta e não são grandes volumes

##### 8. **Notifications Collection**

```typescript
{
  _id: ObjectId,
  userId: ObjectId,           // Ref: Users
  spaceId: ObjectId?,         // Ref: FinancialSpaces (algumas notificações são pessoais)
  type: string,               // "budget_alert" | "bill_reminder" | "goal_milestone" | "space_invitation"
  title: string,
  message: string,
  data: object?,              // Dados adicionais (ex: budgetId, transactionId)
  isRead: boolean,
  createdAt: Date,
  expiresAt: Date?            // Auto-delete após X dias
}
```

**Índices:**

- `userId` + `isRead` + `createdAt`

**Justificativa:**

- Collection separada para permitir queries eficientes de notificações não lidas

#### Estratégias de Performance

1. **Índices Compostos:** Para queries comuns (ex: buscar transações de um espaço em um período)
2. **Projeção:** Retornar apenas campos necessários nas queries
3. **Agregação:** Utilizar MongoDB aggregation pipeline para cálculos complexos (ex: total de gastos por categoria)
4. **Caching:** Redis para cache de dados frequentemente acessados (consideração futura, não MVP)
5. **Paginação:** Limit/skip ou cursor-based para listas grandes

### 5.5 Autenticação e Segurança

#### Fluxo de Autenticação

**1. Registro com E-mail/Senha:**

```
Cliente -> POST /api/auth/register {email, password, name}
Servidor:
  1. Validar input (Zod)
  2. Verificar se e-mail já existe
  3. Hash senha com bcrypt (salt rounds: 10)
  4. Criar usuário no DB
  5. Criar FinancialSpace padrão
  6. Gerar accessToken (JWT, 15min) e refreshToken (7 dias)
  7. Salvar refreshToken hasheado no DB
  8. Retornar tokens + dados do usuário
```

**2. Login com E-mail/Senha:**

```
Cliente -> POST /api/auth/login {email, password}
Servidor:
  1. Validar input
  2. Buscar usuário por e-mail
  3. Comparar senha com bcrypt
  4. Gerar accessToken e refreshToken
  5. Salvar refreshToken no DB
  6. Retornar tokens + dados do usuário
```

**3. Login com Google OAuth:**

```
Cliente -> Redireciona para Google OAuth
Google -> Autoriza e retorna code
Cliente -> POST /api/auth/google {code}
Servidor:
  1. Trocar code por tokens com Google
  2. Buscar dados do usuário no Google
  3. Verificar se usuário já existe (por googleId ou email)
  4. Se não existe, criar usuário
  5. Gerar accessToken e refreshToken
  6. Retornar tokens + dados do usuário
```

**4. Refresh Token:**

```
Cliente -> POST /api/auth/refresh {refreshToken}
Servidor:
  1. Verificar se refreshToken existe e não expirou no DB
  2. Gerar novo accessToken
  3. Opcionalmente gerar novo refreshToken (rotation)
  4. Retornar novos tokens
```

**5. Logout:**

```
Cliente -> POST /api/auth/logout {refreshToken}
Servidor:
  1. Remover refreshToken do DB
  2. Retornar sucesso
```

#### Estrutura do JWT (Access Token)

```typescript
{
  sub: string,        // User ID
  email: string,
  spaceId: string,    // ID do espaço ativo (usuário pode ter apenas 1 no MVP)
  iat: number,        // Issued at
  exp: number         // Expiration (15 minutos)
}
```

#### Middleware de Autenticação

```typescript
// Pseudo-código
async function authMiddleware(request, reply) {
  const token = request.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    throw new UnauthorizedError('Token não fornecido');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    request.user = decoded; // Anexa dados do usuário à request
  } catch (error) {
    throw new UnauthorizedError('Token inválido ou expirado');
  }
}
```

#### Boas Práticas de Segurança

1. **HTTPS Obrigatório:** Toda comunicação criptografada (enforced no Vercel/Render)
2. **CORS Configurado:** Permitir apenas origem do frontend
3. **Rate Limiting:** Limitar requisições por IP (ex: 100 req/min) com `@fastify/rate-limit`
4. **Helmet:** Headers de segurança com `@fastify/helmet`
5. **Input Validation:** Zod em todas as rotas
6. **SQL Injection:** Não aplicável (MongoDB), mas usar parametrização sempre
7. **XSS:** Sanitização de inputs, Content-Security-Policy headers
8. **CSRF:** Não necessário para API stateless, mas validar origem via CORS
9. **Secrets:** Nunca versionadas, apenas via .env
10. **Logs Sanitizados:** Nunca logar senhas, tokens, dados sensíveis

---

## 6. Padrões de Código e Qualidade

### 6.1 Guia de Estilo

**Base:** Airbnb TypeScript Style Guide

**Ferramentas:**

- **ESLint:** Linting com regras do Airbnb + ajustes para TypeScript
- **Prettier:** Formatação automática (integrado com ESLint)

**Configuração ESLint Recomendada:**

```json
{
  "extends": [
    "airbnb-typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "import/prefer-default-export": "off",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

**Configuração Prettier:**

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always"
}
```

**Convenções de Nomenclatura:**

- **Arquivos:** kebab-case para arquivos, PascalCase para componentes React (ex: `user-profile.tsx`)
- **Variáveis/Funções:** camelCase
- **Classes/Interfaces:** PascalCase
- **Constantes:** UPPER_SNAKE_CASE
- **Componentes React:** PascalCase
- **Hooks Customizados:** prefixo `use` (ex: `useAuth`)

**Estrutura de Componentes:**

```typescript
// 1. Imports (ordenados: React, bibliotecas, componentes internos, estilos)
import React, { useState, useEffect } from 'react';
import { Button, Card } from 'antd';
import { CustomComponent } from './CustomComponent';
import './styles.scss';

// 2. Types/Interfaces
interface Props {
  title: string;
  onSave: () => void;
}

// 3. Componente
export const MyComponent: React.FC<Props> = ({ title, onSave }) => {
  // 3.1 Hooks
  const [data, setData] = useState([]);

  // 3.2 Effects
  useEffect(() => {
    // ...
  }, []);

  // 3.3 Handlers
  const handleClick = () => {
    // ...
  };

  // 3.4 Render
  return (
    <Card>
      <h1>{title}</h1>
      <Button onClick={handleClick}>Save</Button>
    </Card>
  );
};
```

### 6.2 Estratégia de Testes

**Filosofia:** Pragmatismo - Testes onde mais importam

**Prioridades:**

1. **Alta:** Lógicas de negócio críticas (cálculos financeiros, validações, autenticação)
2. **Média:** Funções utilitárias (formatadores, parsers)
3. **Baixa:** Componentes de UI (testes manuais suficientes no MVP)

**Framework:** Vitest (para ambos front e back)

- **Justificativa:** Rápido, compatível com Vite, API similar ao Jest

**Tipos de Testes no MVP:**

**Backend - Testes Unitários:**

- Serviços (services) com lógica complexa
- Utilitários (formatação de moeda, cálculo de juros, etc.)
- Validação de schemas Zod

**Backend - Testes de Integração:**

- Rotas da API (mock do DB com mongodb-memory-server)
- Fluxo de autenticação completo

**Frontend - Testes Manuais:**

- Navegação e fluxos principais
- Responsividade em diferentes dispositivos
- Validações de formulários

**Exemplo de Teste (Backend):**

```typescript
// transaction.service.test.ts
import { describe, it, expect } from 'vitest';
import { calculateMonthlyTotal } from './transaction.service';

describe('Transaction Service', () => {
  it('should calculate monthly total correctly', () => {
    const transactions = [
      { amount: 10000, type: 'income' },
      { amount: 5000, type: 'expense' },
    ];

    const total = calculateMonthlyTotal(transactions);

    expect(total).toBe(5000); // 100 - 50 = 50 reais
  });
});
```

**Cobertura Alvo:** 70%+ para módulos críticos (auth, transactions, budgets)

### 6.3 CI/CD com GitHub Actions

#### Workflow 1: Continuous Integration (CI)

**Arquivo:** `.github/workflows/ci.yml`

**Objetivo:** Validar código em cada push/PR antes de merge

**Jobs:**

1. **Lint (ESLint):**
   - Rodar ESLint no front e back
   - Falhar build se houver erros
2. **Type Check (TypeScript):**
   - Rodar `tsc --noEmit` para verificar tipos
   - Falhar build se houver erros de tipo
3. **Tests (Vitest):**
   - Rodar testes unitários e de integração
   - Gerar relatório de cobertura
4. **Build:**
   - Compilar frontend (Vite build)
   - Compilar backend (tsc)
   - Verificar se build passa sem erros

**Triggers:**

- Push em qualquer branch
- Pull Request para `main` ou `develop`

**Pseudo-código do Workflow:**

```yaml
name: CI

on:
  push:
    branches: ['**']
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '22'
      - run: npm ci
      - run: npm run lint

  type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run type-check

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3 # Upload cobertura

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
```

#### Workflow 2: Continuous Deployment (CD)

**Arquivo:** `.github/workflows/cd.yml`

**Objetivo:** Deploy automático após merge em `main`

**Estratégia:**

- **Frontend:** Deploy automático para Vercel (via integração Git do Vercel ou CLI)
- **Backend:** Deploy automático para Render (via integração Git do Render ou API)

**Jobs:**

1. **Deploy Frontend:**
   - Instalar dependências
   - Build de produção
   - Deploy para Vercel (usando `vercel-action` ou Vercel CLI)
2. **Deploy Backend:**
   - Instalar dependências
   - Build de produção
   - Deploy para Render (trigger via webhook ou Render API)

**Triggers:**

- Push em `main` (após merge de PR)

**Pseudo-código do Workflow:**

```yaml
name: CD

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Trigger Render Deploy
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
```

**Secrets Necessários (GitHub Secrets):**

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `RENDER_DEPLOY_HOOK`

#### Estratégia de Branches

**Modelo:** Simplified Git Flow

- **`main`:** Branch de produção, sempre deployável
- **`develop`:** Branch de desenvolvimento, integração de features
- **`feature/*`:** Branches de funcionalidades (ex: `feature/transaction-crud`)
- **`bugfix/*`:** Branches de correções

**Fluxo:**

1. Criar feature branch a partir de `develop`
2. Desenvolver e commitar (commits semânticos)
3. Abrir PR para `develop`
4. CI valida (lint, types, tests, build)
5. Code review e merge
6. Periodicamente, merge de `develop` → `main`
7. CD dispara automaticamente ao merge em `main`

#### Commits Semânticos (Conventional Commits)

**Formato:** `<type>(<scope>): <description>`

**Types:**

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação, sem mudança de lógica
- `refactor`: Refatoração de código
- `test`: Adição ou correção de testes
- `chore`: Tarefas de manutenção

**Exemplos:**

- `feat(transactions): add transaction CRUD endpoints`
- `fix(auth): resolve JWT expiration issue`
- `docs(readme): update setup instructions`

**Ferramenta:** Commitlint + Husky para validar commits automaticamente

---

## 7. Entregáveis

### 7.1 Repositório

**Estrutura:**

- **Monorepo (Opção 1):** Frontend e Backend no mesmo repo (pasta `packages/`)
- **Multi-repo (Opção 2):** Repositórios separados (recomendado para MVP)

**Recomendação:** Multi-repo para simplificar CI/CD e deploy independente

**Repositórios:**

1. `controlfin-frontend` (GitHub)
2. `controlfin-backend` (GitHub)

### 7.2 Documentação

#### README.md (Ambos os repos)

**Conteúdo Obrigatório:**

- **Descrição do Projeto:** O que é o ControlFin
- **Tecnologias Utilizadas:** Stack completo
- **Pré-requisitos:** Node.js 22+, npm/yarn
- **Instalação:**
  ```bash
  npm install
  ```
- **Configuração:**
  - Copiar `.env.example` para `.env`
  - Preencher variáveis de ambiente
  - Instruções detalhadas de cada variável
- **Execução em Desenvolvimento:**
  ```bash
  npm run dev
  ```
- **Build de Produção:**
  ```bash
  npm run build
  npm run start
  ```
- **Testes:**
  ```bash
  npm run test
  ```
- **Estrutura de Pastas:** Explicação resumida
- **Contribuição:** Como contribuir (padrões de commit, PR template)
- **Licença:** MIT ou outra

#### Variáveis de Ambiente

**Frontend (.env.example):**

```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

**Backend (.env.example):**

```
NODE_ENV=development
PORT=3000

# MongoDB
MONGODB_URI=mongodb+srv://superdicas2_db_user:j58q7ohYKGjGPgXW@cluster0.7cxj4ag.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

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

**⚠️ Segurança:**

- Arquivos `.env` NUNCA devem ser versionados (incluir em `.gitignore`)
- `.env.example` serve apenas como template (sem valores reais)

### 7.3 Documentação da API (OpenAPI)

**Arquivo:** `openapi.yaml` (no repo do backend)

**Geração:** Manual ou automática via `@fastify/swagger`

**Conteúdo:**

- Todas as rotas da API
- Request/Response schemas
- Códigos de status
- Exemplos de uso
- Autenticação (JWT Bearer)

**Estrutura Resumida:**

```yaml
openapi: 3.0.0
info:
  title: ControlFin API
  version: 1.0.0
  description: API RESTful para controle de finanças pessoais

servers:
  - url: https://api.controlfin.com
    description: Produção
  - url: http://localhost:3000
    description: Desenvolvimento

paths:
  /api/auth/register:
    post:
      summary: Registrar novo usuário
      tags: [Auth]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email: { type: string, format: email }
                password: { type: string, minLength: 8 }
                name: { type: string }
      responses:
        201:
          description: Usuário criado com sucesso
        400:
          description: Dados inválidos

  /api/transactions:
    get:
      summary: Listar transações
      tags: [Transactions]
      security:
        - bearerAuth: []
      parameters:
        - in: query
          name: startDate
          schema: { type: string, format: date }
        - in: query
          name: endDate
          schema: { type: string, format: date }
      responses:
        200:
          description: Lista de transações
    post:
      summary: Criar transação
      tags: [Transactions]
      security:
        - bearerAuth: []
      # ... resto da spec

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

**Visualização:** Usar Swagger UI ou Redoc para documentação interativa

### 7.4 Aplicação Hospedada

**URLs:**

- **Frontend (Vercel):** `https://controlfin.vercel.app`
- **Backend (Render):** `https://controlfin-api.onrender.com`

**Configurações de Deploy:**

**Vercel (Frontend):**

- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`
- Environment Variables: `VITE_API_BASE_URL`, `VITE_GOOGLE_CLIENT_ID`

**Render (Backend):**

- Build Command: `npm install && npm run build`
- Start Command: `npm run start` (executa `node dist/server.js`)
- Environment Variables: Todas as variáveis do `.env`

---

## 8. Fluxo de Trabalho e Ferramentas

### 8.1 Ferramentas de IA

**Principais:**

1. **Cursor:** Editor principal com IA integrada para codificação assistida
2. **GitHub Copilot:** Sugestões de código inline
3. **Google AI Pro (Gemini):** Consultas complexas de arquitetura e resolução de problemas

### 8.2 Workflow com MCPs (Model Context Protocols)

#### MCP 1: task planner

**Quando Usar:** Antes de iniciar o desenvolvimento de qualquer feature média/grande

**Como Usar:**

```
@task-planner Implementar CRUD de transações com validação Zod
```

**Output Esperado:**
Lista sequencial de tarefas técnicas:

1. Criar interface TypeScript para Transaction
2. Criar schema Zod de validação
3. Criar model Mongoose para Transactions collection
4. Implementar service com lógica de negócio (create, read, update, delete)
5. Implementar controller com tratamento de erros
6. Criar rotas Fastify com middleware de autenticação
7. Adicionar testes unitários para service
8. Adicionar testes de integração para rotas
9. Documentar endpoints no openapi.yaml

**Benefício:** Reduz esquecimento de etapas e organiza o trabalho

#### MCP 2: memory bank

**Quando Usar:** Para salvar decisões importantes, snippets reutilizáveis, padrões estabelecidos

**Como Usar:**

```
@memory-bank save decision
Título: Schema de Transações - Armazenar valores em centavos
Decisão: Todos os valores monetários devem ser armazenados como integers em centavos (ex: R$ 150,99 = 15099) para evitar erros de arredondamento de ponto flutuante.
Trade-offs:
- ✅ Precisão garantida em cálculos
- ✅ Performance (integers são mais rápidos)
- ❌ Necessidade de conversão no frontend para exibição
Implementação: Criar função utilitária centsToCurrency(cents) e currencyToCents(value)
```

**Categorias de Memórias:**

- **Decisões de Arquitetura:** Escolhas técnicas fundamentais
- **Schemas de Dados:** Estrutura de collections e validações
- **Snippets Reutilizáveis:** Código que será usado frequentemente (ex: middleware de auth)
- **Padrões de Código:** Convenções estabelecidas para o projeto
- **Problemas Resolvidos:** Bugs complexos e suas soluções (para referência futura)

**Benefício:** Consistência ao longo do projeto, referência rápida

#### MCP 3: context7

**Quando Usar:** No início de cada sessão de desenvolvimento (especialmente se trabalhar com múltiplas features/dias diferentes)

**Como Usar:**

```
@context7 load
Projeto: ControlFin
Contexto Necessário:
- Project Brief completo (este documento)
- Estrutura de pastas atual
- Decisões de arquitetura do memory bank
- Schema do banco de dados
- Convenções de código estabelecidas
```

**Output Esperado:**
IA carrega e resume o contexto completo, pronta para continuar desenvolvimento de forma consistente

**Benefício:** Reduz tempo de "reaquecimento" e garante alinhamento

#### MCP 4: github mcp

**Quando Usar:**

- Ao criar commits (para mensagens semânticas)
- Ao abrir PRs (para descrições detalhadas)
- Para gerar workflows do GitHub Actions

**Como Usar:**

```
@github-mcp commit
Alterações: Implementei endpoints de CRUD de transações com validação Zod e testes

Output: feat(transactions): implement CRUD endpoints with Zod validation

@github-mcp pr-description
Branch: feature/transaction-crud → develop
Alterações:
- Endpoints POST, GET, PUT, DELETE para transações
- Validação com Zod
- Testes unitários e de integração
- Documentação no openapi.yaml

Output: PR template preenchido com detalhes técnicos
```

**Benefício:** Padronização automática, mensagens de commit profissionais

### 8.3 Ordem de Implementação (Roadmap Técnico)

#### Fase 1: Fundação (Semana 1)

1. **Setup de Repositórios:**
   - Criar repos no GitHub
   - Configurar .gitignore
   - Inicializar projetos (npm init, Vite, Fastify)
2. **Configuração de Ambiente:**
   - Configurar TypeScript (tsconfig.json)
   - Configurar ESLint e Prettier
   - Configurar .env e .env.example
3. **CI/CD:**
   - Criar workflow de CI (lint, type-check, test, build)
   - Configurar Vercel e Render
   - Criar workflow de CD (deploy automático)
4. **Estrutura Base:**
   - Criar estrutura de pastas (front e back)
   - Configurar conexão com MongoDB
   - Configurar CORS e middlewares básicos

#### Fase 2: Autenticação (Semana 1-2)

1. **Schema e Validação:**
   - Criar User model (Mongoose)
   - Criar schemas Zod de validação (register, login)
2. **Endpoints de Auth:**
   - POST /auth/register (e-mail/senha)
   - POST /auth/login (e-mail/senha)
   - POST /auth/google (OAuth)
   - POST /auth/refresh (refresh token)
   - POST /auth/logout
3. **Frontend - Auth:**
   - Páginas de Login e Registro
   - Integração com Google OAuth
   - Auth store (Zustand)
   - Private routes (React Router)
4. **Testes:**
   - Testes de integração para auth endpoints

#### Fase 3: Espaços Financeiros (Semana 2)

1. **Schema:**
   - Criar FinancialSpaces model
   - Endpoint de criação automática na primeira autenticação
2. **Funcionalidades:**
   - GET /spaces (listar espaços do usuário)
   - POST /spaces/invite (convidar membro)
   - POST /spaces/accept-invite (aceitar convite)
3. **Frontend:**
   - Seletor de espaço (se necessário no futuro, MVP tem apenas 1)
   - Tela de convite de membro

#### Fase 4: Categorias e Transações (Semana 2-3)

1. **Categorias:**
   - Seed de categorias padrão no DB
   - GET /categories
   - POST /categories (customizadas)
2. **Transações - Backend:**
   - Transaction model
   - CRUD completo:
     - POST /transactions (criar)
     - GET /transactions (listar com filtros)
     - GET /transactions/:id (detalhes)
     - PUT /transactions/:id (editar)
     - DELETE /transactions/:id (soft delete)
   - Validação rigorosa com Zod
   - Testes
3. **Transações - Frontend:**
   - Listagem de transações (tabela com Ant Design)
   - Formulário de criação/edição (modal)
   - Filtros (data, categoria, tipo)
   - Transaction store (Zustand)

#### Fase 5: Cartões de Crédito (Semana 3)

1. **Backend:**
   - CreditCard model
   - CRUD de cartões
   - Endpoint para visualizar fatura: GET /cards/:id/invoice?month=2025-01
2. **Frontend:**
   - CRUD de cartões
   - Visualização de fatura consolidada

#### Fase 6: Planejamento e Orçamentos (Semana 3-4)

1. **Gastos Fixos:**
   - Campo `isRecurring` em transações
   - Lógica de criação automática de transações recorrentes (scheduled job)
2. **Orçamentos:**
   - Budget model
   - CRUD de orçamentos
   - Endpoint de progresso: GET /budgets/progress?period=2025-01
3. **Frontend:**
   - Tela de planejamento
   - Formulário de orçamentos
   - Indicadores visuais de progresso (Progress Bar do Ant Design)

#### Fase 7: Metas de Economia (Semana 4)

1. **Backend:**
   - SavingsGoal model
   - CRUD de metas
   - Endpoint de aporte: POST /goals/:id/contribute
2. **Frontend:**
   - Listagem de metas com progresso visual
   - Formulário de criação/edição
   - Modal de aporte

#### Fase 8: Dashboard e Relatórios (Semana 4-5)

1. **Backend:**
   - Endpoints de agregação:
     - GET /dashboard/summary (saldo, receitas, despesas do mês)
     - GET /reports/by-category (distribuição por categoria)
     - GET /reports/compare-periods (comparação temporal)
   - Utilizar MongoDB aggregation pipeline
2. **Frontend:**
   - Dashboard principal com cards de resumo (Statistic do Ant Design)
   - Gráficos com Highcharts:
     - Pie Chart (distribuição)
     - Column Chart (comparação)
     - Line Chart (evolução de saldo)
   - Filtros de período

#### Fase 9: Insights Automáticos (Semana 5)

1. **Backend:**
   - Serviço de geração de insights (lógica simples baseada em comparações)
   - Endpoint GET /insights
2. **Frontend:**
   - Card de insights no dashboard

#### Fase 10: Notificações e Alertas (Semana 5-6)

1. **Backend:**
   - Notification model
   - Scheduled jobs (cron) para:
     - Verificar orçamentos próximos do limite (diário)
     - Criar lembretes de contas a pagar (diário)
   - Endpoints de notificações:
     - GET /notifications (listar)
     - PUT /notifications/:id/read (marcar como lida)
2. **Frontend:**
   - Badge de notificações no header
   - Drawer ou modal com lista de notificações
   - Notificações push (futuro, post-MVP)

#### Fase 11: PWA e Offline (Semana 6)

1. **Service Worker:**
   - Cache de assets estáticos
   - Cache de API responses para leitura offline
   - Estratégia: Cache-First para assets, Network-First para API
2. **Manifest:**
   - Criar manifest.json com ícones e metadata
   - Configurar tema e display mode
3. **Frontend:**
   - Indicador de status offline
   - Mensagem de "você está offline, alguns dados podem estar desatualizados"

#### Fase 12: Polimento e Deploy Final (Semana 6-7)

1. **Ajustes de UI/UX:**
   - Animações e transições
   - Loading states
   - Empty states (mensagens quando não há dados)
2. **Testes Finais:**
   - Testes manuais em múltiplos dispositivos
   - Correção de bugs
3. **Documentação:**
   - Atualizar README.md final
   - Completar openapi.yaml
   - Criar guia de usuário básico (opcional)
4. **Deploy de Produção:**
   - Merge final em main
   - Validar deploy automático
   - Monitorar logs para erros

#### Fase 13 (Opcional): Anexo de Comprovantes (Pós-MVP)

- Upload de imagens/PDF
- Storage (S3 ou Cloudinary)
- Visualização na transação

---

## 9. Considerações Finais

### 9.1 Riscos e Mitigações

**Risco 1: Complexidade de OAuth com Google**

- **Mitigação:** Seguir documentação oficial, usar biblioteca `passport-google-oauth20`

**Risco 2: Performance de Queries no MongoDB com grandes volumes**

- **Mitigação:** Índices bem planejados, paginação, aggregation pipeline otimizado

**Risco 3: Estouro de orçamento de hospedagem (Render free tier)**

- **Mitigação:** Monitorar uso, otimizar queries, considerar upgrade se necessário

**Risco 4: Bugs relacionados a cálculos financeiros (ponto flutuante)**

- **Mitigação:** Armazenar valores em centavos (integers), testes rigorosos

**Risco 5: Dependência de terceiros (Google OAuth, MongoDB Atlas)**

- **Mitigação:** Plano de contingência (fallback para e-mail/senha), backups regulares do DB

### 9.2 Próximos Passos Pós-MVP

1. **Anexo de Comprovantes:** Upload e visualização de imagens/PDF
2. **Integração Bancária:** Open Banking para sincronização automática
3. **Múltiplos Espaços:** Usuário poder ter vários espaços (trabalho, pessoal, família)
4. **Gestão de Investimentos:** Acompanhamento de carteira de investimentos
5. **Exportação de Relatórios:** PDF e Excel
6. **Notificações Push:** Web Push API para alertas em tempo real
7. **Gamificação:** Badges e conquistas para engajamento
8. **Mobile Nativo:** React Native ou Flutter (reutilizando API)
9. **IA para Insights:** Machine Learning para previsões e recomendações personalizadas
10. **Multi-idioma:** Suporte a inglês, espanhol

### 9.3 Métricas de Sucesso

**Técnicas:**

- Build passa em CI 95%+ das vezes
- Cobertura de testes 70%+ em módulos críticos
- Lighthouse Score 90+ (Performance, Accessibility, Best Practices, PWA)
- Tempo de resposta da API < 300ms (p95)

**Produto:**

- Taxa de cadastro → uso ativo > 60%
- Retenção de usuários após 1 mês > 40%
- NPS (Net Promoter Score) > 50

### 9.4 Recursos e Referências

**Documentação Oficial:**

- [React](https://react.dev)
- [Vite](https://vitejs.dev)
- [Fastify](https://www.fastify.io)
- [MongoDB](https://www.mongodb.com/docs)
- [Zod](https://zod.dev)
- [Ant Design](https://ant.design)
- [Highcharts](https://www.highcharts.com)
- [Zustand](https://zustand-demo.pmnd.rs)

**Tutoriais e Guias:**

- [JWT Best Practices](https://jwt.io/introduction)
- [OAuth 2.0 with Google](https://developers.google.com/identity/protocols/oauth2)
- [MongoDB Schema Design Best Practices](https://www.mongodb.com/developer/products/mongodb/schema-design-best-practices/)
- [PWA Guide](https://web.dev/progressive-web-apps/)

---

## 10. Conclusão

Este Project Brief define de forma abrangente e detalhada todos os aspectos técnicos, arquiteturais e organizacionais do projeto **ControlFin**. Ele serve como a **única fonte de verdade** para a equipe de desenvolvimento, garantindo consistência, qualidade e alinhamento ao longo de todo o ciclo de vida do projeto.

**Princípios Fundamentais Reiterados:**

1. **Qualidade acima da velocidade** (mas com pragmatismo)
2. **Decisões baseadas em trade-offs explícitos** (documentados no memory bank)
3. **Automação de processos** (CI/CD, validações, testes)
4. **Segurança em primeiro lugar** (criptografia, validação, autenticação robusta)
5. **Experiência do usuário** (design minimalista, responsivo, insights acionáveis)

**Este documento deve ser:**

- ✅ Referenciado no início de cada feature
- ✅ Atualizado quando decisões arquiteturais mudarem
- ✅ Compartilhado com todos os desenvolvedores
- ✅ Usado como base para onboarding de novos membros

**Comando para Iniciar Desenvolvimento:**

```bash
# 1. Clonar repos (após criação)
git clone https://github.com/seu-usuario/controlfin-frontend.git
git clone https://github.com/seu-usuario/controlfin-backend.git

# 2. Carregar contexto completo
@context7 load PROJECT_BRIEF.md

# 3. Planejar primeira feature
@task-planner Setup inicial do projeto (TypeScript, ESLint, CI/CD)

# 4. Começar a codar! 🚀
```

**Bora construir o ControlFin! 💰📊✨**

---

**Documento Mantido Por:** Engenheiro de Software Sênior (IA)  
**Última Atualização:** 5 de Outubro de 2025  
**Versão:** 1.1.0  
**Status:** Em Implementação - Core Features Completas

## 📊 **PROJECT STATUS UPDATE**

### **Completed Features** ✅
- **TASK-011: Transaction Management System** - ✅ **ARCHIVED** (2025-10-05)
  - Complete transaction CRUD operations
  - Advanced filtering and search capabilities
  - Data visualization with Highcharts
  - Import/Export functionality
  - Recurring transactions management
  - Production-ready deployment configuration
  - Comprehensive testing and verification

### **In Progress** ⏳
- **TASK-021: UI/UX Theme Consistency Fix** - ⏳ **PENDING**
  - Address theme consistency issues identified in TASK-011
  - Improve login page BlockAI theme application
  - Enhance overall UI/UX consistency

### **Next Priority** 🎯
- **TASK-018: Production Deployment & Monitoring** - ⏳ **PENDING**
  - Production environment setup
  - Domain configuration and SSL
  - Performance monitoring and error tracking
