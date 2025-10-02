# GitHub Actions & CI/CD

Este diretório contém as configurações de CI/CD e automação do projeto ControlFin.

## 📁 Estrutura

```
.github/
├── workflows/
│   ├── ci.yml              # Continuous Integration
│   ├── cd.yml              # Continuous Deployment
│   ├── release.yml         # Versionamento automático
│   └── codeql.yml          # Análise de segurança
├── pull_request_template.md # Template de PR
└── dependabot.yml          # Atualizações de dependências
```

## 🔄 Workflows

### CI (Continuous Integration)

- **Arquivo**: `ci.yml`
- **Trigger**: Push em qualquer branch, PR para main/develop
- **Jobs**:
  - Frontend CI (lint, type-check, test, build)
  - Backend CI (lint, type-check, test, build)
  - Security audit
  - Build matrix (testa múltiplas versões do Node.js)

### CD (Continuous Deployment)

- **Arquivo**: `cd.yml`
- **Trigger**: Push na branch main
- **Jobs**:
  - Deploy Frontend para Vercel
  - Deploy Backend para Render
  - Health check pós-deploy

### Release

- **Arquivo**: `release.yml`
- **Trigger**: Push na branch main
- **Funcionalidade**: Versionamento automático baseado em conventional commits

### CodeQL

- **Arquivo**: `codeql.yml`
- **Trigger**: Push/PR para main/develop, agendado semanalmente
- **Funcionalidade**: Análise de segurança e qualidade do código

## 🔧 Configurações

### Dependabot

- Atualizações semanais de dependências
- Segunda-feira às 09:00 (horário de Brasília)
- Máximo 5 PRs abertos por projeto
- Commits com prefixo `chore(frontend)` ou `chore(backend)`

### Codecov

- Cobertura mínima: 70% para projeto, 60% para patch
- Anotações em PRs
- Ignora arquivos de teste e build

### Husky + Lint-staged

- Pre-commit: ESLint + Prettier
- Commit-msg: Validação de mensagens de commit
- Apenas arquivos modificados são processados

### Commitlint

- Validação de mensagens de commit
- Formato: `type(scope): description`
- Tipos permitidos: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert

## 🚀 Secrets Necessários

Configure os seguintes secrets no GitHub:

### Vercel (Frontend)

- `VERCEL_TOKEN`: Token de API do Vercel
- `VERCEL_ORG_ID`: ID da organização no Vercel
- `VERCEL_PROJECT_ID`: ID do projeto no Vercel

### Render (Backend)

- `RENDER_DEPLOY_HOOK`: Webhook de deploy do Render

### Health Check

- `FRONTEND_URL`: URL do frontend em produção
- `BACKEND_URL`: URL do backend em produção

## 📊 Métricas de Qualidade

### Cobertura de Código

- **Target**: 70% para projeto
- **Patch**: 60% para mudanças incrementais
- **Threshold**: 5% de tolerância

### Performance

- Build deve completar em < 10 minutos
- Testes devem passar em < 5 minutos
- Deploy deve completar em < 15 minutos

### Segurança

- Dependências auditadas semanalmente
- CodeQL executa análise de segurança
- Secrets rotacionados regularmente

## 🔍 Troubleshooting

### Build Falhando

1. Verificar logs do GitHub Actions
2. Executar comandos localmente
3. Verificar dependências e versões

### Deploy Falhando

1. Verificar secrets configurados
2. Verificar conectividade com Vercel/Render
3. Verificar logs de deploy

### Testes Falhando

1. Executar `npm test` localmente
2. Verificar cobertura de código
3. Verificar configuração do Vitest

## 📚 Recursos

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel CLI](https://vercel.com/cli)
- [Render Documentation](https://render.com/docs)
- [Codecov Documentation](https://docs.codecov.com/)
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
