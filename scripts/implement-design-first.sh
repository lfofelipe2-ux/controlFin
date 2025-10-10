#!/bin/bash

# DESIGN FIRST Implementation Script
# Foco em UI/UX de qualidade, abandonar over-engineering

echo "🎨 Implementando estratégia DESIGN FIRST + VIBE CODING..."
echo "=================================================="

# 1. Remover complexidade desnecessária
echo "🗑️  Removendo complexidade desnecessária..."

# Remover scripts de over-engineering
rm -f scripts/preventive-refactoring.js
rm -f scripts/test-quality-monitor.js
rm -f scripts/validate-testing-standards.js

echo "✅ Scripts complexos removidos"

# 2. Simplificar package.json
echo "📦 Simplificando package.json para foco em UI..."

# Backup do package.json atual
cp package.json package.json.backup

# Criar package.json simplificado
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
    "validate": "npm run test:basic && npm run build",
    "start:production": "concurrently \"npm run start:backend\" \"npm run start:frontend\"",
    "start:backend": "cd controlfin-backend && npm run start:production",
    "start:frontend": "cd controlfin-frontend && npm run preview"
  },
  "devDependencies": {
    "concurrently": "^8.2.2",
    "husky": "^9.0.11"
  }
}
EOF

echo "✅ Package.json simplificado para foco em UI"

# 3. Manter apenas validação essencial
echo "✅ Mantendo apenas validação essencial para UI"

# 4. Focar em design system
echo "🎨 Priorizando Design System e UX..."

# Criar diretório para design system
mkdir -p design-system
mkdir -p design-system/components
mkdir -p design-system/tokens
mkdir -p design-system/guidelines

# Criar arquivo de design tokens
cat > design-system/tokens/colors.ts << 'EOF'
// Design Tokens - ControlFin
// Baseado no tema BlockAI

export const colors = {
  // Cores primárias
  primary: {
    50: '#e6f7ff',
    100: '#bae7ff',
    200: '#91d5ff',
    300: '#69c0ff',
    400: '#40a9ff',
    500: '#1890ff', // Cor principal
    600: '#096dd9',
    700: '#0050b3',
    800: '#003a8c',
    900: '#002766',
  },
  
  // Cores de sucesso
  success: {
    50: '#f6ffed',
    100: '#d9f7be',
    200: '#b7eb8f',
    300: '#95de64',
    400: '#73d13d',
    500: '#52c41a', // Verde principal
    600: '#389e0d',
    700: '#237804',
    800: '#135200',
    900: '#092b00',
  },
  
  // Cores de aviso
  warning: {
    50: '#fffbe6',
    100: '#fff1b8',
    200: '#ffe58f',
    300: '#ffd666',
    400: '#ffc53d',
    500: '#faad14', // Amarelo principal
    600: '#d48806',
    700: '#ad6800',
    800: '#874d00',
    900: '#613400',
  },
  
  // Cores de erro
  error: {
    50: '#fff2f0',
    100: '#ffccc7',
    200: '#ffa39e',
    300: '#ff7875',
    400: '#ff4d4f', // Vermelho principal
    500: '#f5222d',
    600: '#cf1322',
    700: '#a8071a',
    800: '#820014',
    900: '#5c0011',
  },
  
  // Cores neutras
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#f0f0f0',
    300: '#d9d9d9',
    400: '#bfbfbf',
    500: '#8c8c8c',
    600: '#595959',
    700: '#434343',
    800: '#262626',
    900: '#1f1f1f',
  }
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
};

export const typography = {
  fontFamily: {
    primary: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    secondary: 'Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'JetBrains Mono, "Fira Code", Consolas, monospace',
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    xxl: '24px',
    xxxl: '32px',
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const borderRadius = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};
EOF

echo "✅ Design tokens criados"

# Criar guia de design
cat > design-system/guidelines/README.md << 'EOF'
# Design System - ControlFin

## Filosofia: DESIGN FIRST

### Princípios
1. **Simplicidade**: Interface limpa e intuitiva
2. **Consistência**: Padrões visuais uniformes
3. **Acessibilidade**: Inclusivo para todos os usuários
4. **Performance**: Rápido e responsivo

### Cores
- **Primária**: #1890ff (Azul BlockAI)
- **Sucesso**: #52c41a (Verde)
- **Aviso**: #faad14 (Amarelo)
- **Erro**: #ff4d4f (Vermelho)

### Tipografia
- **Primária**: Inter (interface)
- **Secundária**: Poppins (títulos)
- **Monospace**: JetBrains Mono (código)

### Espaçamento
- **Grid**: 8px base
- **Padding**: 16px padrão
- **Margin**: 24px entre seções

### Componentes
- **Ant Design 5** como base
- **Tema personalizado** BlockAI
- **Responsividade** mobile-first
- **Acessibilidade** WCAG 2.1 AA

### Diretrizes de Uso
1. **Sempre** use tokens de design
2. **Mantenha** consistência visual
3. **Teste** em diferentes dispositivos
4. **Priorize** experiência do usuário
EOF

echo "✅ Guia de design criado"

# 5. Criar script de validação simplificada
cat > scripts/validate-ui.js << 'EOF'
#!/usr/bin/env node

/**
 * Validação Simplificada - DESIGN FIRST
 * Foco em UI/UX, validação mínima necessária
 */

const { execSync } = require('child_process');

console.log('🎨 Validação DESIGN FIRST...');

try {
  // Validação TypeScript básica
  console.log('📝 Verificando TypeScript...');
  execSync('cd controlfin-frontend && npx tsc --noEmit', { stdio: 'pipe' });
  console.log('✅ TypeScript OK');

  // ESLint básico
  console.log('🔍 Verificando ESLint...');
  execSync('cd controlfin-frontend && npm run lint', { stdio: 'pipe' });
  console.log('✅ ESLint OK');

  // Testes básicos
  console.log('🧪 Executando testes básicos...');
  execSync('cd controlfin-frontend && npm test -- --run', { stdio: 'pipe' });
  console.log('✅ Testes OK');

  // Build
  console.log('🏗️  Verificando build...');
  execSync('cd controlfin-frontend && npm run build', { stdio: 'pipe' });
  console.log('✅ Build OK');

  console.log('🎉 Validação DESIGN FIRST concluída!');
  console.log('🎨 Foco em UI/UX ativado!');

} catch (error) {
  console.error('❌ Validação falhou:', error.message);
  process.exit(1);
}
EOF

chmod +x scripts/validate-ui.js

echo "✅ Script de validação UI criado"

# 6. Atualizar package.json com script de validação UI
sed -i '' 's/"validate": "npm run test:basic && npm run build"/"validate": "node scripts\/validate-ui.js"/' package.json

echo "✅ Package.json atualizado com validação UI"

# 7. Criar README para design first
cat > DESIGN-FIRST-README.md << 'EOF'
# ControlFin - DESIGN FIRST Approach

## 🎨 Filosofia

**DESIGN FIRST + VIBE CODING**
- Interface e UX são prioridade máxima
- Programar apenas o necessário
- Máxima eficiência, mínimo código
- Foco em resultados, não tecnologia

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

## 📊 Métricas de Sucesso

- **Tempo de carregamento**: < 2 segundos
- **Usabilidade**: Score > 90
- **Acessibilidade**: WCAG 2.1 AA
- **Responsividade**: Perfeita em todos os dispositivos

---

**Status**: DESIGN FIRST ativado
**Foco**: UI/UX de qualidade
**Desenvolvimento**: Mínimo necessário
EOF

echo "✅ README DESIGN FIRST criado"

echo ""
echo "🎉 DESIGN FIRST implementado com sucesso!"
echo "=================================================="
echo "🎨 Foco em UI/UX ativado"
echo "🚀 Desenvolvimento simplificado"
echo "📱 Design System criado"
echo "✅ Validação otimizada"
echo ""
echo "Próximos passos:"
echo "1. npm run dev - Iniciar desenvolvimento"
echo "2. Focar em componentes UI de qualidade"
echo "3. Implementar feedback visual imediato"
echo "4. Testar em diferentes dispositivos"
echo ""
echo "🎨 DESIGN FIRST + VIBE CODING ativado!"
