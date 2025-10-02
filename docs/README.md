# ControlFin - Documentação

Documentação completa do projeto ControlFin - Progressive Web App para Gestão Financeira Pessoal e Compartilhada.

---

## 📚 Índice de Documentação

### 🚀 Guias de Início Rápido

- **[README Principal](../README.md)** - Visão geral do projeto
- **[Vibe Coding Guide](guides/VIBE-CODING-GUIDE.md)** - Guia definitivo de desenvolvimento com IA (PT-BR)

### 📋 Documentação Técnica

#### Core

- **[Project Brief](../memory-bank/projectBrief.md)** - Especificação completa do projeto (2085 linhas)
  - Identidade, Objetivos, Escopo
  - Diretrizes de Design (BlockAI)
  - Stack Técnico Completo
  - Schema do Banco de Dados
  - Autenticação e Segurança
  - Padrões de Código
  - CI/CD
  - Roadmap de Implementação

#### Memory Bank

- **[Tasks](../memory-bank/tasks.md)** - Gestão de tarefas e progresso
- **[Active Context](../memory-bank/activeContext.md)** - Contexto atual do desenvolvimento
- **[Progress](../memory-bank/progress.md)** - Progresso de implementação
- **[System Patterns](../memory-bank/systemPatterns.md)** - Padrões arquiteturais
- **[Tech Context](../memory-bank/techContext.md)** - Contexto técnico e decisões
- **[Product Context](../memory-bank/productContext.md)** - Visão de produto e usuário

#### Custom Modes (Memory Bank System)

- **[VAN Mode](../memory-bank/custom_modes/van_instructions.md)** - Inicialização e análise
- **[PLAN Mode](../memory-bank/custom_modes/plan_instructions.md)** - Planejamento de tarefas
- **[CREATIVE Mode](../memory-bank/custom_modes/creative_instructions.md)** - Decisões de design
- **[IMPLEMENT Mode](../memory-bank/custom_modes/implement_instructions.md)** - Implementação de código
- **[REFLECT+ARCHIVE Mode](../memory-bank/custom_modes/reflect_archive_instructions.md)** - Reflexão e documentação
- **[Mode Switching Analysis](../memory-bank/custom_modes/mode_switching_analysis.md)** - Análise de efetividade

### 🏗️ Documentação de Subprojetos

#### Frontend

- **[Frontend README](../controlfin-frontend/README.md)** - Setup e documentação do React app
- **[Frontend .cursorrules](../.cursor/frontend.cursorrules)** - Regras de IA para frontend

#### Backend

- **[Backend README](../controlfin-backend/README.md)** - Setup e documentação da API
- **[Backend .cursorrules](../.cursor/backend.cursorrules)** - Regras de IA para backend

### 🔧 CI/CD e DevOps

- **[CI/CD README](../.github/README.md)** - Documentação completa do pipeline (127 linhas)
- **[Workflows](../.github/workflows/)** - 14 GitHub Actions workflows:
  - CI/CD Pipeline
  - Security Scanning (CodeQL)
  - Automated Testing
  - Deployment Automation
  - Code Quality (Super Linter)
  - Dependency Management (Dependabot)

### 🎨 Design e Assets

- **[Design Reference](assets/design-reference/)** - Imagens de referência do BlockAI
  - `split_1.jpg` a `split_9.jpg` - 9 imagens do design completo
  - Color system, layout, componentes

### 📖 Templates e Padrões

#### GitHub Templates

- **[Pull Request Template](../.github/pull_request_template.md)** - Template padrão de PRs
- **[Bug Report](../.github/ISSUE_TEMPLATE/bug_report.md)** - Template de bug report
- **[Feature Request](../.github/ISSUE_TEMPLATE/feature_request.md)** - Template de feature request

#### Code Templates

Ver **[Vibe Coding Guide](guides/VIBE-CODING-GUIDE.md)** seção 10 para:

- Templates React Component
- Templates Backend Endpoint
- Templates Zustand Store
- Templates SCSS Variables

---

## 🎯 Quick Links por Persona

### Para Desenvolvedores Novos no Projeto

1. Leia: [README Principal](../README.md)
2. Configure: [Vibe Coding Guide - Seção Setup](guides/VIBE-CODING-GUIDE.md#19-conclusão-e-próximos-passos)
3. Estude: [Project Brief](../memory-bank/projectBrief.md)
4. Clone: Frontend e Backend repos
5. Comece: [Tasks](../memory-bank/tasks.md) - próxima tarefa disponível

### Para Arquitetos/Tech Leads

1. [Project Brief](../memory-bank/projectBrief.md) - Visão completa
2. [System Patterns](../memory-bank/systemPatterns.md) - Padrões arquiteturais
3. [Tech Context](../memory-bank/techContext.md) - Decisões técnicas
4. [Progress](../memory-bank/progress.md) - Status do projeto

### Para Designers/UI Developers

1. [Vibe Coding Guide - Design to Code](guides/VIBE-CODING-GUIDE.md#18-design-assets-e-recursos-visuais)
2. [Design Reference](assets/design-reference/) - Imagens BlockAI
3. [Project Brief - Design Guidelines](../memory-bank/projectBrief.md#4-diretrizes-de-design)

### Para DevOps/CI-CD

1. [CI/CD README](../.github/README.md)
2. [Workflows](../.github/workflows/)
3. [Codecov Config](../codecov.yml)
4. [Renovate Config](../renovate.json)

---

## 🛠️ Estrutura do Projeto

```
controlFin/
├── controlfin-frontend/     # React PWA
├── controlfin-backend/      # Fastify API
├── memory-bank/             # Memory Bank System
│   ├── projectBrief.md      # Especificação completa
│   ├── tasks.md             # Gestão de tarefas
│   ├── progress.md          # Progresso
│   └── custom_modes/        # Modos personalizados
├── docs/                    # Documentação
│   ├── guides/              # Guias de desenvolvimento
│   └── assets/              # Design references
├── .github/                 # CI/CD e templates
│   ├── workflows/           # GitHub Actions
│   └── ISSUE_TEMPLATE/      # Templates de issues
├── .cursor/                 # Configurações Cursor
│   ├── rules/               # Isolation rules
│   └── *.cursorrules        # Regras de IA por contexto
└── [arquivos de config]     # ESLint, Prettier, etc.
```

---

## 📝 Convenções de Documentação

### Nomes de Arquivos

- **README.md**: Visão geral e setup rápido
- **GUIDE.md**: Guias detalhados e tutoriais
- **BRIEF.md**: Especificações e requirements
- **CONTEXT.md**: Contexto e decisões (Memory Bank)

### Localização

- **Raiz**: README principal + arquivos de config
- **docs/**: Documentação geral
- **docs/guides/**: Guias de desenvolvimento
- **docs/assets/**: Imagens e assets
- **memory-bank/**: Sistema Memory Bank
- **.github/**: CI/CD e templates GitHub
- **Subprojetos**: READMEs específicos em cada pasta

---

## 🔄 Manutenção

### Responsabilidades

- **Project Brief**: Atualizar quando decisões arquiteturais mudarem
- **Tasks & Progress**: Atualizar diariamente durante desenvolvimento
- **READMEs**: Atualizar quando comandos ou setup mudarem
- **Vibe Coding Guide**: Atualizar quando descobrir novos padrões úteis

### Versionamento

- Documentação core (Project Brief): Versionada no git
- Memory Bank: Atualizada continuamente
- Guias: Versionamento semântico (indicar versão no rodapé)

---

**Última Atualização:** 2025-10-02  
**Mantido por:** ControlFin Development Team
