# TASK-020: CI/CD CENTRALIZATION PLAN

## 📋 Task Overview

**Task ID**: TASK-020  
**Title**: CI/CD Configuration Centralization  
**Type**: Infrastructure Optimization  
**Priority**: 🟡 **MEDIUM** - Quality Improvement  
**Complexity**: Level 3 - Intermediate Feature  
**Estimated Effort**: 8-12 hours  
**Dependencies**: TASK-019 (CI/CD fixes completed)

## 🎯 Objectives

### **Primary Goals**
1. **Centralize Configuration**: Single source of truth for all CI/CD settings
2. **Reduce Duplication**: Eliminate ~50% of YAML code duplication
3. **Improve Maintainability**: Easier updates and consistency
4. **Optimize Performance**: Streamline build processes

### **Success Criteria**
- [ ] All Node.js versions defined in one place
- [ ] Workflow count reduced from 16 to ≤8 files
- [ ] YAML lines reduced by ≥40%
- [ ] All existing checks continue passing
- [ ] Documentation updated

## 📊 Current State Analysis

### **Existing Workflows (16 files)**
```
.github/workflows/
├── ci.yml (149 lines) - Main CI pipeline
├── quality-gates.yml (98 lines) - i18n & quality checks
├── codeql.yml (54 lines) - Security scanning
├── super-linter.yml (93 lines) - Code quality
├── auto-label.yml (193 lines) - Auto labeling
├── auto-assign.yml (45 lines) - Auto assignment
├── auto-approve.yml (49 lines) - Auto approval
├── auto-merge.yml (26 lines) - Auto merge
├── auto-merge-bot.yml (30 lines) - Auto merge bot
├── auto-close.yml (102 lines) - Auto close issues
├── cd.yml (95 lines) - Continuous deployment
├── pages.yml (113 lines) - GitHub Pages
├── docs.yml (65 lines) - Documentation
├── code-scanning.yml (95 lines) - Code scanning
├── release.yml (21 lines) - Release management
└── stale.yml (48 lines) - Stale issues
```

**Total**: 1,275 lines of YAML across 16 files

### **Duplication Issues**
- Node.js setup repeated 8+ times
- Project paths hardcoded everywhere
- Cache configurations duplicated
- Coverage uploads repeated
- Security audit steps duplicated

## 🚀 Implementation Plan

### **Phase 1: Foundation (2-3 hours)**

#### **1.1 Create Central Configuration**
- [ ] Create `.github/config/ci-config.yml`
- [ ] Define all Node.js versions
- [ ] Configure project settings
- [ ] Set up cache strategies
- [ ] Document all configurations

#### **1.2 Create Reusable Actions**
- [ ] Create `.github/actions/setup-project/action.yml`
- [ ] Create `.github/actions/run-tests/action.yml`
- [ ] Create `.github/actions/run-lint/action.yml`
- [ ] Create `.github/actions/run-build/action.yml`
- [ ] Create `.github/actions/upload-coverage/action.yml`

#### **1.3 Test Foundation**
- [ ] Test central config loading
- [ ] Validate reusable actions
- [ ] Ensure no breaking changes

### **Phase 2: Consolidation (3-4 hours)**

#### **2.1 Merge Auto Workflows**
- [ ] Combine `auto-*.yml` into `automation.yml`
- [ ] Use central config for all settings
- [ ] Test auto-labeling functionality
- [ ] Test auto-assignment functionality
- [ ] Test auto-approval functionality

#### **2.2 Merge Documentation Workflows**
- [ ] Combine `docs.yml` and `pages.yml` into `documentation.yml`
- [ ] Use central config for Node versions
- [ ] Test documentation deployment
- [ ] Test GitHub Pages functionality

#### **2.3 Merge Quality Workflows**
- [ ] Integrate `super-linter.yml` into main `ci.yml`
- [ ] Keep `quality-gates.yml` separate (specialized)
- [ ] Test all quality checks
- [ ] Ensure i18n compliance still works

### **Phase 3: Optimization (2-3 hours)**

#### **3.1 Optimize Main CI**
- [ ] Update `ci.yml` to use central config
- [ ] Implement project matrix strategy
- [ ] Add conditional logic for efficiency
- [ ] Test all build combinations

#### **3.2 Optimize Security Workflows**
- [ ] Update `codeql.yml` with central config
- [ ] Update `code-scanning.yml` with central config
- [ ] Consolidate security audit steps
- [ ] Test all security checks

#### **3.3 Optimize Deployment**
- [ ] Update `cd.yml` with central config
- [ ] Update `release.yml` with central config
- [ ] Test deployment pipeline
- [ ] Test release process

### **Phase 4: Cleanup & Documentation (1-2 hours)**

#### **4.1 Remove Redundant Files**
- [ ] Delete old workflow files
- [ ] Update workflow references
- [ ] Clean up unused configurations

#### **4.2 Update Documentation**
- [ ] Update `docs/CI_CD_GUIDE.md`
- [ ] Update `memory-bank/ci-cd-control.md`
- [ ] Create migration guide
- [ ] Document new structure

## 📁 New Structure

### **Target Structure**
```
.github/
├── config/
│   └── ci-config.yml (65 lines) - Central configuration
├── actions/
│   ├── setup-project/action.yml
│   ├── run-tests/action.yml
│   ├── run-lint/action.yml
│   ├── run-build/action.yml
│   └── upload-coverage/action.yml
└── workflows/
    ├── ci.yml (120 lines) - Main CI pipeline
    ├── quality-gates.yml (80 lines) - Quality checks
    ├── security.yml (60 lines) - Security scanning
    ├── automation.yml (150 lines) - Auto workflows
    ├── documentation.yml (80 lines) - Docs & Pages
    ├── deployment.yml (70 lines) - CD & Release
    └── maintenance.yml (50 lines) - Stale issues
```

**Total**: ~7 files, ~575 lines (55% reduction)

## 🔧 Technical Implementation

### **Central Configuration Usage**
```yaml
# In any workflow
- name: Setup Project
  uses: ./.github/actions/setup-project
  with:
    project: 'frontend'
    node-version: ${{ fromJSON(needs.config.outputs.node_versions).primary }}
```

### **Matrix Strategy**
```yaml
strategy:
  matrix:
    project: ${{ fromJSON(needs.config.outputs.projects) }}
    node-version: ${{ fromJSON(needs.config.outputs.node_versions).matrix }}
```

### **Conditional Logic**
```yaml
- name: Run Tests
  if: matrix.project == 'frontend' && matrix.node-version == '22'
  uses: ./.github/actions/run-tests
```

## 📈 Expected Benefits

### **Quantitative**
- **55% reduction** in YAML lines (1,275 → 575)
- **56% reduction** in workflow files (16 → 7)
- **100% consistency** in Node.js versions
- **80% reduction** in configuration duplication

### **Qualitative**
- **Easier maintenance** - change once, apply everywhere
- **Better consistency** - same settings across all workflows
- **Clearer structure** - logical grouping of functionality
- **Faster updates** - centralized configuration management

## ⚠️ Risks & Mitigation

### **Risks**
1. **Breaking existing workflows** - Test thoroughly
2. **Complex migration** - Phase-by-phase approach
3. **Team confusion** - Comprehensive documentation

### **Mitigation**
1. **Extensive testing** at each phase
2. **Gradual migration** with rollback capability
3. **Clear documentation** and team communication

## 📅 Timeline

- **Week 1**: Phase 1 (Foundation) - 2-3 hours
- **Week 1**: Phase 2 (Consolidation) - 3-4 hours
- **Week 2**: Phase 3 (Optimization) - 2-3 hours
- **Week 2**: Phase 4 (Cleanup) - 1-2 hours

**Total**: 8-12 hours over 2 weeks

## 🎯 Success Metrics

- [ ] All 26 CI/CD checks still passing
- [ ] YAML lines reduced by ≥40%
- [ ] Workflow files reduced by ≥50%
- [ ] Node.js versions consistent across all workflows
- [ ] Documentation updated and comprehensive
- [ ] Team can easily modify configurations
