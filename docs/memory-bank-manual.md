# Memory Bank Manual - ControlFin Project

## 📋 Overview

O Memory Bank é um sistema de gerenciamento de tarefas e contexto para projetos complexos. Ele organiza informações em modos específicos para diferentes fases do desenvolvimento.

## 🗂️ Estrutura de Arquivos

```
memory-bank/
├── tasks.md                    # Tarefas ativas e histórico
├── activeContext.md            # Contexto atual do projeto
├── progress.md                 # Progresso geral do projeto
├── projectBrief.md             # Brief completo do projeto
├── systemPatterns.md           # Padrões arquiteturais
├── techContext.md              # Contexto técnico
├── productContext.md           # Contexto do produto
├── style-guide.md              # Guia de estilo
├── custom_modes/               # Modos customizados
│   ├── ui_ux_validation_workflow.md
│   ├── critical_analysis_report.md
│   └── development_standards.md
├── creative/                   # Documentos de fase criativa
├── reflection/                 # Reflexões de tarefas
└── archive/                    # Arquivos arquivados
```

## 🔄 Modos de Operação

### **VAN Mode** - Inicialização

**Quando usar**: Início de projeto ou nova tarefa
**Comando**: `van`
**Função**:

- Detecta complexidade da tarefa
- Inicializa arquivos necessários
- Determina próximo modo

### **PLAN Mode** - Planejamento

**Quando usar**: Após VAN mode para tarefas Level 2+
**Comando**: `plan`
**Função**:

- Cria plano detalhado de implementação
- Valida tecnologia necessária
- Identifica fases criativas necessárias

### **CREATIVE Mode** - Design

**Quando usar**: Para componentes que requerem decisões de design
**Comando**: `creative`
**Função**:

- Analisa múltiplas opções
- Toma decisões arquiteturais
- Documenta escolhas e rationale

### **IMPLEMENT Mode** - Implementação

**Quando usar**: Após PLAN/CREATIVE completos
**Comando**: `implement`
**Função**:

- Executa plano de implementação
- Cria código e componentes
- Testa funcionalidade

### **REFLECT Mode** - Reflexão

**Quando usar**: Após implementação completa
**Comando**: `reflect`
**Função**:

- Revisa implementação
- Documenta lições aprendidas
- Identifica melhorias

### **ARCHIVE Mode** - Arquivamento

**Quando usar**: Após reflexão completa
**Comando**: `archive`
**Função**:

- Documenta tarefa completa
- Move para arquivo permanente
- Limpa arquivos temporários

## 📊 Níveis de Complexidade

### **Level 1** - Quick Bug Fix

- Correções simples
- Tempo: 1-2 horas
- Modos: VAN → IMPLEMENT → REFLECT → ARCHIVE

### **Level 2** - Simple Enhancement

- Melhorias simples
- Tempo: 4-8 horas
- Modos: VAN → PLAN → IMPLEMENT → REFLECT → ARCHIVE

### **Level 3** - Intermediate Feature

- Funcionalidades intermediárias
- Tempo: 1-2 dias
- Modos: VAN → PLAN → CREATIVE → IMPLEMENT → REFLECT → ARCHIVE

### **Level 4** - Complex System

- Sistemas complexos
- Tempo: 1-2 semanas
- Modos: VAN → PLAN → CREATIVE → IMPLEMENT → REFLECT → ARCHIVE

## 🎯 Cenários de Uso

### **Nova Tarefa**

```bash
# 1. Inicializar
van

# 2. Planejar (se Level 2+)
plan

# 3. Design (se necessário)
creative

# 4. Implementar
implement

# 5. Refletir
reflect

# 6. Arquivar
archive
```

### **Bug Fix Rápido**

```bash
# 1. Inicializar
van

# 2. Implementar diretamente
implement

# 3. Refletir
reflect

# 4. Arquivar
archive
```

### **Continuar Tarefa Existente**

```bash
# Verificar status atual
# Continuar do modo apropriado baseado no status
```

## 📝 Comandos Úteis

### **Verificar Status**

- Ler `memory-bank/tasks.md` para status atual
- Ler `memory-bank/activeContext.md` para contexto

### **Atualizar Progresso**

- Modificar `memory-bank/progress.md`
- Atualizar `memory-bank/activeContext.md`

### **Documentar Decisões**

- Usar `memory-bank/custom_modes/` para documentos específicos
- Criar arquivos de reflexão em `memory-bank/reflection/`

## 🚨 Regras Importantes

### **Ordem dos Modos**

- Sempre seguir a sequência: VAN → PLAN → CREATIVE → IMPLEMENT → REFLECT → ARCHIVE
- Não pular modos (exceto CREATIVE para Level 1-2)
- Não voltar para modos anteriores sem justificativa

### **Documentação**

- Sempre atualizar arquivos relevantes em cada modo
- Manter `tasks.md` atualizado com status
- Documentar decisões importantes

### **Qualidade**

- Seguir padrões estabelecidos em `development_standards.md`
- Validar implementação antes de prosseguir
- Testar funcionalidade antes de arquivar

## 🔧 Troubleshooting

### **Modo Incorreto**

- Verificar `activeContext.md` para contexto atual
- Retornar ao modo apropriado baseado no status

### **Arquivos Corrompidos**

- Restaurar de backup em `.git`
- Recriar arquivos baseados em templates

### **Conflitos de Contexto**

- Limpar `activeContext.md`
- Reinicializar com VAN mode

## 📚 Referências

- **Development Standards**: `memory-bank/custom_modes/development_standards.md`
- **UI/UX Validation**: `memory-bank/custom_modes/ui_ux_validation_workflow.md`
- **Critical Analysis**: `memory-bank/custom_modes/critical_analysis_report.md`

---

**Última Atualização**: 2025-01-27  
**Versão**: 1.0
