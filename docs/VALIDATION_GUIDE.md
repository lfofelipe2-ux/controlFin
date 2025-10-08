# 🔍 Validation Guide

This document explains the validation system implemented to ensure code quality before creating Pull Requests.

## 📋 Overview

The validation system includes:
- **ESLint Rules**: Enforce code quality standards
- **i18n Validation**: Detect duplicate translation keys
- **Build Validation**: Ensure code compiles successfully
- **Test Validation**: Ensure all tests pass (comprehensive execution)
- **Git Validation**: Ensure proper git workflow
- **Dependency Validation**: Check for security vulnerabilities
- **TypeScript Validation**: Type checking with proper types

## 🚀 Quick Start

### Before Creating a PR

Run the validation script:

```bash
# Option 1: Use the shell script
./scripts/pre-pr.sh

# Option 2: Use the Node.js script directly
node scripts/validate-before-pr.js
```

### Automatic Validation

The system automatically runs validations on:
- **Pre-push**: Before pushing to remote repository
- **Pre-commit**: Before committing changes (if configured)

## 📝 ESLint Rules

### 1. No Console Logs (`no-console`)
- **Rule**: `'no-console': 'error'`
- **Purpose**: Enforce use of logger instead of console.log
- **Fix**: Replace `console.log()` with `logger.info()`

```javascript
// ❌ Bad
console.log('User logged in');

// ✅ Good
logger.info('User logged in');
```

### 2. No Explicit Any (`@typescript-eslint/no-explicit-any`)
- **Rule**: `'@typescript-eslint/no-explicit-any': 'error'`
- **Purpose**: Enforce specific TypeScript types
- **Fix**: Replace `any` with specific types

```typescript
// ❌ Bad
function processData(data: any): any {
  return data;
}

// ✅ Good
function processData(data: UserData): ProcessedData {
  return transformData(data);
}
```

### 3. No Hardcoded Strings (`no-hardcoded-strings`)
- **Rule**: `'no-hardcoded-strings/no-hardcoded-strings': 'error'`
- **Purpose**: Enforce i18n for user-facing strings
- **Fix**: Replace hardcoded strings with translation keys

```javascript
// ❌ Bad
<Button>Save Changes</Button>

// ✅ Good
<Button>{t('common.saveChanges')}</Button>
```

### 4. No Duplicate i18n Keys (`no-duplicate-i18n-keys`)
- **Rule**: `'no-duplicate-i18n-keys/no-duplicate-i18n-keys': 'error'`
- **Purpose**: Prevent duplicate translation keys
- **Fix**: Remove or rename duplicate keys

```json
// ❌ Bad
{
  "common": {
    "save": "Save",
    "save": "Save Changes"  // Duplicate key
  }
}

// ✅ Good
{
  "common": {
    "save": "Save",
    "saveChanges": "Save Changes"
  }
}
```

## 🔧 Configuration

### ESLint Configuration

**Frontend** (`controlfin-frontend/eslint.config.js`):
```javascript
rules: {
  'no-console': 'error',
  '@typescript-eslint/no-explicit-any': 'error',
  'no-hardcoded-strings/no-hardcoded-strings': 'error',
  'no-duplicate-i18n-keys/no-duplicate-i18n-keys': [
    'error',
    {
      translationFiles: [
        'src/locales/en/common.json',
        'src/locales/pt/common.json',
      ],
    },
  ],
}
```

**Backend** (`controlfin-backend/eslint.config.js`):
```javascript
rules: {
  'no-console': 'error',
  '@typescript-eslint/no-explicit-any': 'error',
  'no-hardcoded-strings/no-hardcoded-strings': 'error',
}
```

### Translation Files

The i18n validation checks these files:
- `controlfin-frontend/src/locales/en/common.json`
- `controlfin-frontend/src/locales/pt/common.json`

## 🛠️ Troubleshooting

### Common Issues

#### 1. ESLint Errors
```bash
# Run linting to see specific errors
cd controlfin-frontend && npm run lint
cd controlfin-backend && npm run lint
```

#### 2. Build Failures
```bash
# Check build errors
cd controlfin-frontend && npm run build
cd controlfin-backend && npm run build
```

#### 3. Test Failures
```bash
# Run all tests (comprehensive execution - no stopping on first error)
cd controlfin-frontend && npm run test:all
cd controlfin-backend && npm run test:all

# Or run comprehensive validation across both projects
npm run validate:comprehensive
```

### Comprehensive Test Execution (TASK-011)

The test system has been optimized to run all tests without stopping on the first error:

```bash
# Backend comprehensive validation
cd controlfin-backend && npm run validate:all

# Frontend comprehensive validation  
cd controlfin-frontend && npm run validate:all

# Cross-project validation with colored output
npm run validate:comprehensive
```

**Benefits**:
- See all test failures in one execution
- No need to run tests multiple times
- Colored output for better visibility
- Complete error overview

#### 4. i18n Duplicate Keys
```bash
# Check translation files manually
node -e "
const fs = require('fs');
const content = fs.readFileSync('controlfin-frontend/src/locales/en/common.json', 'utf8');
const parsed = JSON.parse(content);
console.log(JSON.stringify(parsed, null, 2));
"
```

### Bypassing Validation (Not Recommended)

If you absolutely need to bypass validation:

```bash
# Skip pre-push hook (NOT RECOMMENDED)
git push --no-verify

# Skip pre-commit hook (NOT RECOMMENDED)
git commit --no-verify
```

## 📊 Validation Checklist

Before creating a PR, ensure:

- [ ] **Backend ESLint**: No errors
- [ ] **Frontend ESLint**: No errors
- [ ] **Backend Tests**: All passing
- [ ] **Frontend Tests**: All passing
- [ ] **Backend Build**: Successful
- [ ] **Frontend Build**: Successful
- [ ] **i18n Keys**: No duplicates
- [ ] **Git Status**: Clean working directory
- [ ] **Dependencies**: No high-severity vulnerabilities

## 🎯 Best Practices

1. **Run validation early**: Don't wait until the end
2. **Fix issues incrementally**: Address one type of error at a time
3. **Use proper types**: Avoid `any` type
4. **Use i18n**: Never hardcode user-facing strings
5. **Use logger**: Never use `console.log` in production code
6. **Keep translations clean**: Avoid duplicate keys

## 🔄 Continuous Integration

The validation system integrates with:
- **Git Hooks**: Automatic validation on push
- **CI/CD Pipeline**: Validation in GitHub Actions
- **IDE Integration**: Real-time validation in editors

## 📞 Support

If you encounter issues with the validation system:

1. Check this guide first
2. Run individual validation commands
3. Check the error messages carefully
4. Ask for help in the team chat
5. Create an issue if it's a bug

---

**Remember**: The validation system is designed to maintain code quality and prevent issues from reaching production. Embrace it as a helpful tool that makes your code better! 🚀
