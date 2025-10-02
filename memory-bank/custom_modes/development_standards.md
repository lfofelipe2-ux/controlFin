# DEVELOPMENT STANDARDS - ControlFin Project

## 🌍 INTERNATIONALIZATION (i18n) STANDARDS

### **MANDATORY LANGUAGE SUPPORT**

- **English (en)**: Primary language - REQUIRED
- **Portuguese Brazil (pt-BR)**: Secondary language - REQUIRED
- **Future languages**: Spanish (es), French (fr) - Optional

### **i18n IMPLEMENTATION RULES**

#### **1. NO HARDCODED STRINGS**

```typescript
// ❌ FORBIDDEN
<Button>Sign In</Button>
<Input placeholder="Enter your email" />

// ✅ REQUIRED
<Button>{t('auth.login.submit')}</Button>
<Input placeholder={t('auth.login.emailPlaceholder')} />
```

#### **2. TRANSLATION KEY STRUCTURE**

```
src/locales/
  en/
    auth.json          # Authentication strings
    common.json        # Common UI strings
    validation.json    # Validation messages
    errors.json        # Error messages
  pt/
    auth.json          # Portuguese translations
    common.json        # Portuguese common strings
    validation.json    # Portuguese validation
    errors.json        # Portuguese errors
```

#### **3. KEY NAMING CONVENTION**

```typescript
// Pattern: [module].[component].[element].[state]
{
  "auth": {
    "login": {
      "title": "Welcome Back",
      "email": "Email Address",
      "emailPlaceholder": "Enter your email",
      "emailError": "Please enter a valid email",
      "submit": "Sign In",
      "submitLoading": "Signing in..."
    }
  }
}
```

#### **4. COMPONENT i18n INTEGRATION**

```typescript
// Every component MUST use i18n
import { useTranslation } from 'react-i18next';

const LoginForm = () => {
  const { t } = useTranslation('auth');

  return (
    <BaseInput
      label={t('login.email')}
      placeholder={t('login.emailPlaceholder')}
      error={t('login.emailError')}
    />
  );
};
```

## 🎨 DESIGN SYSTEM STANDARDS

### **COMPONENT REUSABILITY RULES**

#### **1. NO CODE DUPLICATION**

- **Forbidden**: Copying component patterns between files
- **Required**: Create reusable base components
- **Pattern**: Extract common patterns to base components

#### **2. BASE COMPONENT REQUIREMENTS**

```typescript
// Required base components
src/components/base/
  Input/
    Input.tsx           # Reusable input component
    Input.types.ts      # TypeScript interfaces
    Input.stories.tsx   # Storybook documentation
  Button/
    Button.tsx          # Reusable button component
    Button.types.ts     # TypeScript interfaces
    Button.stories.tsx  # Storybook documentation
  FormField/
    FormField.tsx       # Input + Label + Error component
    FormField.types.ts  # TypeScript interfaces
    FormField.stories.tsx # Storybook documentation
```

#### **3. DESIGN TOKEN USAGE**

```typescript
// ❌ FORBIDDEN - Hardcoded values
style={{
  padding: '16px',
  margin: '8px',
  color: '#ffffff',
  fontSize: '14px'
}}

// ✅ REQUIRED - Design tokens
style={{
  padding: tokens.spacing.md,
  margin: tokens.spacing.sm,
  color: tokens.colors.textPrimary,
  fontSize: tokens.typography.sizes.desktop.body
}}
```

## 🚫 CSS ARCHITECTURE RULES

### **GLOBAL CSS RESTRICTIONS**

#### **1. NO GLOBAL CSS FIXES**

```css
/* ❌ FORBIDDEN - Global CSS fixes */
.ant-form-item-explain-error {
  margin-top: 8px !important;
}

/* ✅ REQUIRED - Component-specific styles */
.form-field-error {
  margin-top: var(--spacing-sm);
}
```

#### **2. NO !important OVERRIDES**

- **Forbidden**: Using !important in global CSS
- **Required**: Use CSS custom properties and design tokens
- **Exception**: Only in component-specific stylesheets

#### **3. CSS ORGANIZATION**

```
src/styles/
  tokens.css           # CSS custom properties
  components/          # Component-specific styles
    Input.css
    Button.css
    FormField.css
  utilities.css        # Utility classes only
```

## 📝 COMMIT STANDARDS

### **COMMIT MESSAGE FORMAT**

```
type(scope): description

- Detailed explanation of changes
- Reference to related issues
- Breaking changes noted

Closes #issue-number
```

### **COMMIT SIZE LIMITS**

- **Maximum**: 5 files changed per commit
- **Maximum**: 200 lines changed per commit
- **Exception**: Initial feature commits (documented in PR)

### **BRANCH STRATEGY**

```bash
# Feature development
git checkout -b feature/task-007-i18n-standards

# Bug fixes
git checkout -b fix/auth-form-validation

# Hotfixes
git checkout -b hotfix/critical-security-patch
```

## 🔍 CODE QUALITY GATES

### **PRE-COMMIT HOOKS**

```json
// .lintstagedrc.json
{
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md}": ["prettier --write"]
}
```

### **MANDATORY CHECKS**

- [ ] **TypeScript**: No type errors
- [ ] **ESLint**: No linting errors
- [ ] **Prettier**: Code formatted
- [ ] **i18n**: No hardcoded strings
- [ ] **Tests**: All tests passing
- [ ] **Build**: Successful build

### **CODE REVIEW REQUIREMENTS**

- [ ] **i18n Compliance**: All strings externalized
- [ ] **Component Reusability**: No code duplication
- [ ] **Design System**: Uses design tokens
- [ ] **CSS Architecture**: No global CSS fixes
- [ ] **Documentation**: Components documented

## 📚 DOCUMENTATION REQUIREMENTS

### **COMPONENT DOCUMENTATION**

```typescript
/**
 * BaseInput - Reusable input component with i18n support
 *
 * @example
 * <BaseInput
 *   label={t('auth.login.email')}
 *   placeholder={t('auth.login.emailPlaceholder')}
 *   error={t('auth.login.emailError')}
 *   icon={<MailOutlined />}
 * />
 */
interface BaseInputProps {
  /** i18n key for label text */
  label?: string;
  /** i18n key for placeholder text */
  placeholder?: string;
  /** i18n key for error message */
  error?: string;
  /** Icon component to display */
  icon?: ReactNode;
}
```

### **REQUIRED DOCUMENTATION FILES**

- [ ] **Component README**: Usage examples and API
- [ ] **Storybook Stories**: Interactive examples
- [ ] **TypeScript Types**: Complete interface definitions
- [ ] **i18n Keys**: Translation key documentation

## 🚨 VIOLATION CONSEQUENCES

### **AUTOMATIC REJECTIONS**

- **Hardcoded strings**: Automatic PR rejection
- **Global CSS fixes**: Automatic PR rejection
- **Code duplication**: Automatic PR rejection
- **Missing i18n**: Automatic PR rejection

### **MANUAL REVIEW TRIGGERS**

- **Large commits**: Require additional review
- **Design system violations**: Require design review
- **CSS architecture violations**: Require architecture review

## 📊 QUALITY METRICS

### **MANDATORY METRICS**

- **i18n Coverage**: 100% of strings externalized
- **Component Reusability**: 0% code duplication
- **Design Token Usage**: 100% of styling values
- **TypeScript Coverage**: 100% type coverage

### **MONITORING**

- **Automated**: Pre-commit hooks check compliance
- **Manual**: Code review process validates standards
- **Continuous**: CI/CD pipeline enforces rules

---

**Status**: ✅ **ACTIVE STANDARDS**  
**Last Updated**: 2025-01-27  
**Next Review**: 2025-02-27
