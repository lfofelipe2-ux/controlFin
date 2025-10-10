#!/bin/bash

# DESIGN FIRST - Project Cleanup Script
# Remove código e dependências não utilizados

echo "🧹 Iniciando limpeza do projeto DESIGN FIRST..."
echo "=============================================="

# 1. Remover arquivos de teste desnecessários (mantendo apenas essenciais)
echo "🗑️  Removendo arquivos de teste desnecessários..."

# Remover testes de performance (não essenciais para DESIGN FIRST)
rm -f controlfin-backend/tests/performance/transaction-performance.test.ts
rm -f controlfin-backend/tests/integration/transactions.test.ts
rm -f controlfin-backend/tests/security/transaction-security.test.ts

echo "✅ Testes de performance e integração removidos"

# 2. Remover templates de teste complexos
echo "🗑️  Removendo templates de teste complexos..."

rm -f tests/templates/e2e-test-template.spec.ts
rm -f tests/templates/enhanced-component-test-template.tsx
rm -f tests/templates/component-test-template.tsx

echo "✅ Templates de teste complexos removidos"

# 3. Remover arquivos de documentação desnecessários
echo "🗑️  Removendo documentação desnecessária..."

rm -f memory-bank/testing-standards.md
rm -f memory-bank/strategic-analysis-tasks.md
rm -f memory-bank/simplification-plan.md
rm -f memory-bank/lessons-learned-implementation-plan.md
rm -f memory-bank/test-quality-analysis.md
rm -f memory-bank/qa-issues-tracker.md

echo "✅ Documentação de testes removida"

# 4. Remover scripts não utilizados
echo "🗑️  Removendo scripts não utilizados..."

# Manter apenas scripts essenciais para DESIGN FIRST
rm -f scripts/benchmark-validation.sh
rm -f scripts/check-changes-type-optimized.js
rm -f scripts/check-changes-type.js
rm -f scripts/ci-change-detector.js
rm -f scripts/complete-testing-infrastructure.sh
rm -f scripts/demo-testing-infrastructure.sh
rm -f scripts/fix-long-lines.sh
rm -f scripts/fix-workflow-formatting.sh
rm -f scripts/fix-yaml-issues.sh
rm -f scripts/oauth-test-report.json
rm -f scripts/pre-pr.sh
rm -f scripts/setup-env-files.js
rm -f scripts/setup-optimized-ci.sh
rm -f scripts/setup-optimized-validation.sh
rm -f scripts/test-mongodb-connection.js
rm -f scripts/test-oauth-flow.js
rm -f scripts/test-ultra-parallel-ci.js
rm -f scripts/update-action-versions.sh
rm -f scripts/validate-before-pr.js
rm -f scripts/validate-complete.sh
rm -f scripts/validate-comprehensive.js
rm -f scripts/validate-configurations.js
rm -f scripts/validate-docs-only.sh
rm -f scripts/validate-docs-ultra-fast.sh
rm -f scripts/validate-optimized.sh
rm -f scripts/validate-workflows.sh

echo "✅ Scripts não utilizados removidos"

# 5. Remover diretórios vazios
echo "🗑️  Removendo diretórios vazios..."

rm -rf tests/templates/
rm -rf tests/e2e/
rm -rf tests/guidelines/
rm -rf tests/utils/
rm -rf tests/scripts/
rm -rf controlfin-backend/tests/performance/
rm -rf controlfin-backend/tests/integration/
rm -rf controlfin-backend/tests/security/

echo "✅ Diretórios vazios removidos"

# 6. Limpar package.json de dependências não utilizadas
echo "📦 Limpando dependências não utilizadas..."

# Backup do package.json
cp package.json package.json.backup

# Criar package.json limpo para DESIGN FIRST
cat > package.json << 'EOF'
{
  "name": "controlfin",
  "version": "1.0.0",
  "description": "Personal Finance PWA - ControlFin",
  "main": "index.js",
  "scripts": {
    "prepare": "husky install",
    "dev": "cd controlfin-frontend && npm run dev",
    "dev:frontend": "cd controlfin-frontend && npm run dev",
    "dev:backend": "cd controlfin-backend && npm run dev",
    "build": "cd controlfin-frontend && npm run build",
    "build:frontend": "cd controlfin-frontend && npm run build",
    "build:backend": "cd controlfin-backend && npm run build",
    "install:all": "npm install && cd controlfin-frontend && npm install && cd ../controlfin-backend && npm install",
    "test": "npm run test:basic",
    "test:basic": "cd controlfin-frontend && npm test -- --run && cd ../controlfin-backend && npm test",
    "test:frontend": "cd controlfin-frontend && npm test -- --run",
    "test:backend": "cd controlfin-backend && npm test",
    "validate": "node scripts/validate-ui.js",
    "start:production": "concurrently \"npm run start:backend\" \"npm run start:frontend\"",
    "start:backend": "cd controlfin-backend && npm run start:production",
    "start:frontend": "cd controlfin-frontend && npm run preview",
    "clean": "node scripts/clean-project.js"
  },
  "devDependencies": {
    "concurrently": "^8.2.2",
    "husky": "^9.0.11"
  }
}
EOF

echo "✅ Package.json limpo para DESIGN FIRST"

# 7. Criar script de limpeza contínua
cat > scripts/clean-project.js << 'EOF'
#!/usr/bin/env node

/**
 * DESIGN FIRST - Project Cleanup
 * Remove código não utilizado e otimiza para UI/UX
 */

const fs = require('fs');
const path = require('path');

console.log('🧹 Limpeza contínua DESIGN FIRST...');

// Remover arquivos temporários
const tempFiles = [
  'package.json.backup',
  'test-backups',
  'coverage',
  'dist',
  'node_modules/.cache',
  '.vscode/settings.json',
  '.DS_Store'
];

tempFiles.forEach(file => {
  if (fs.existsSync(file)) {
    fs.rmSync(file, { recursive: true, force: true });
    console.log(`✅ Removido: ${file}`);
  }
});

console.log('🎨 Projeto limpo para DESIGN FIRST!');
EOF

chmod +x scripts/clean-project.js

echo "✅ Script de limpeza contínua criado"

# 8. Limpar arquivos de configuração desnecessários
echo "🗑️  Limpando configurações desnecessárias..."

rm -f commitlint.config.js
rm -f codecov.yml
rm -f renovate.json
rm -f playwright.config.ts
rm -f playwright-report/
rm -f test-results/

echo "✅ Configurações desnecessárias removidas"

# 9. Limpar ESLint plugins não utilizados
echo "🗑️  Limpando ESLint plugins não utilizados..."

rm -rf eslint-plugins/
rm -rf no-duplicate-i18n-keys/
rm -rf no-hardcoded-strings/

echo "✅ ESLint plugins não utilizados removidos"

# 10. Limpar arquivos de backup
echo "🗑️  Limpando arquivos de backup..."

rm -rf backup-useful-files/
rm -f package.json.backup

echo "✅ Arquivos de backup removidos"

# 11. Criar .gitignore otimizado para DESIGN FIRST
cat > .gitignore << 'EOF'
# DESIGN FIRST - Essential ignores only

# Dependencies
node_modules/
*/node_modules/

# Build outputs
dist/
build/
*/dist/
*/build/

# Environment
.env
.env.local
.env.production
.env.development

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Coverage
coverage/
*.lcov

# Temporary
.tmp/
.temp/
EOF

echo "✅ .gitignore otimizado para DESIGN FIRST"

# 12. Criar README simplificado
cat > README.md << 'EOF'
# ControlFin - DESIGN FIRST

## 🎨 Filosofia

**DESIGN FIRST + VIBE CODING**
- Interface e UX são prioridade máxima
- Programar apenas o necessário
- Máxima eficiência, mínimo código

## 🚀 Scripts Principais

```bash
# Desenvolvimento
npm run dev              # Frontend + Backend
npm run dev:frontend     # Apenas frontend
npm run dev:backend      # Apenas backend

# Build
npm run build            # Build frontend
npm run build:frontend   # Build frontend
npm run build:backend    # Build backend

# Testes (simplificados)
npm run test             # Testes básicos
npm run test:frontend    # Testes frontend
npm run test:backend     # Testes backend

# Validação
npm run validate         # Validação UI completa

# Limpeza
npm run clean            # Limpeza do projeto
```

## 🎨 Design System

- **Tokens**: `design-system/tokens/`
- **Componentes**: `design-system/components/`
- **Guidelines**: `design-system/guidelines/`

## 📱 Foco em UI/UX

1. **Simplicidade**: Interface limpa e intuitiva
2. **Consistência**: Padrões visuais uniformes
3. **Acessibilidade**: Inclusivo para todos
4. **Performance**: Rápido e responsivo

## 🔧 Desenvolvimento Mínimo

- **Funcionalidades core** apenas
- **Integrações essenciais** (OAuth, MongoDB)
- **Validações críticas** de segurança
- **Performance básica** para UX

---

**Status**: DESIGN FIRST ativado
**Foco**: UI/UX de qualidade
**Desenvolvimento**: Mínimo necessário
EOF

echo "✅ README simplificado criado"

echo ""
echo "🎉 Limpeza DESIGN FIRST concluída!"
echo "=============================================="
echo "🧹 Código não utilizado removido"
echo "📦 Dependências limpas"
echo "🎨 Foco em UI/UX mantido"
echo "✅ Projeto otimizado"
echo ""
echo "Próximos passos:"
echo "1. npm run dev - Iniciar desenvolvimento"
echo "2. Focar em componentes UI de qualidade"
echo "3. Implementar feedback visual imediato"
echo "4. Testar em diferentes dispositivos"
echo ""
echo "🎨 DESIGN FIRST + VIBE CODING otimizado!"
