# 🔍 i18n Validation System

Sistema completo de validação automática para internacionalização (i18n) no ControlFin.

## 🚀 Validação Automática

### **Git Hooks Instalados**

- **pre-commit**: Validação rápida antes de cada commit
- **pre-push**: Validação completa antes de push/PR

### **O que é Validado Automaticamente**

✅ **Arquivos de tradução** existem e são JSON válido  
✅ **Componentes usam funções de tradução** (`t()`)  
✅ **Sem strings hardcoded** óbvias  
✅ **Compilação TypeScript** bem-sucedida  
✅ **Detecção de strings hardcoded** com padrões avançados  
✅ **Status do Git** (working directory limpo)

## 📋 Scripts Disponíveis

### **Validação Manual**

```bash
# Validação rápida de i18n
npm run validate:i18n

# Checklist manual detalhado
npm run validate:manual

# Validação completa pré-PR
npm run validate:pre-pr

# Detectar strings hardcoded
npm run validate:hardcoded
```

### **Configuração de Hooks**

```bash
# Instalar hooks automáticos
npm run setup:hooks

# Remover hooks automáticos
npm run setup:hooks:remove
```

## 🔍 Detecção de Strings Hardcoded

### **Padrões Detectados**

- ✅ Textos em inglês com múltiplas palavras
- ✅ Mensagens de validação ("Please enter...")
- ✅ Textos de botões ("Sign in", "Create Account")
- ✅ Mensagens de erro ("Failed to...")
- ✅ Textos de loading ("Loading...", "Sending...")
- ✅ Links e navegação ("Forgot password?", "Terms of Service")

### **Padrões Ignorados**

- ❌ Palavras únicas
- ❌ URLs e emails
- ❌ Nomes de classes CSS
- ❌ Comentários de código
- ❌ Imports e exports
- ❌ Arquivos de teste
- ❌ Valores CSS (px, rem, etc.)

## 🎯 Fluxo de Validação

### **1. Pre-commit (Rápido)**

```bash
git commit -m "feat: new feature"
# → npm run validate:i18n (automático)
```

### **2. Pre-push (Completo)**

```bash
git push origin feature/branch
# → npm run validate:pre-pr (automático)
```

### **3. Manual (Quando Necessário)**

```bash
npm run validate:pre-pr
```

## 📊 Critérios de Sucesso

### **✅ Validação Passa Se:**

- Arquivos de tradução existem (EN: 97 keys, PT: 97 keys)
- Componentes usam `t()` function (93+ calls detectados)
- Sem strings hardcoded detectadas
- Compilação TypeScript bem-sucedida
- Working directory limpo

### **❌ Validação Falha Se:**

- Arquivos de tradução ausentes ou inválidos
- Strings hardcoded detectadas
- Componentes não usam tradução
- Erros de compilação TypeScript
- Mudanças não commitadas

## 🚫 Bypass Temporário

### **Desabilitar Hooks Temporariamente**

```bash
# Commit sem validação
git commit --no-verify -m "emergency fix"

# Push sem validação
git push --no-verify origin branch
```

### **⚠️ Use com Cuidado**

- Bypass só deve ser usado em emergências
- Sempre execute validação manual depois
- Documente o motivo do bypass

## 🔧 Configuração

### **Arquivos de Configuração**

- `scripts/hardcoded-strings-detector.js` - Detector de strings
- `scripts/pre-pr-validation.js` - Validação completa
- `scripts/setup-git-hooks.js` - Instalador de hooks
- `.git/hooks/pre-commit` - Hook de commit
- `.git/hooks/pre-push` - Hook de push

### **Personalização**

Para adicionar novos padrões de detecção, edite:

```javascript
// scripts/hardcoded-strings-detector.js
const HARDCODED_PATTERNS = [
  // Adicione seus padrões aqui
  /['"`](Seu padrão aqui)['"`]/g,
];
```

## 📈 Estatísticas Atuais

- **Arquivos de tradução**: 4 (EN/PT auth + common)
- **Chaves de tradução**: 151 total (97 auth + 54 common)
- **Chamadas de tradução**: 93+ nos componentes
- **Strings hardcoded**: 0 detectadas
- **Componentes validados**: 9 arquivos .tsx

## 🎉 Benefícios

### **✅ Para Desenvolvedores**

- Validação automática sem esforço manual
- Detecção precoce de problemas de i18n
- Feedback imediato sobre strings hardcoded
- Prevenção de commits quebrados

### **✅ Para o Projeto**

- Qualidade consistente de i18n
- Redução de bugs de tradução
- Manutenibilidade melhorada
- Padrões uniformes

## 🚀 Próximos Passos

1. **Teste manual**: `npm run dev` e teste troca de idioma
2. **Validação contínua**: Hooks automáticos já ativos
3. **Monitoramento**: Acompanhe estatísticas de validação
4. **Melhorias**: Adicione novos padrões conforme necessário

---

**🎯 Sistema de validação i18n ativo e funcionando!**
