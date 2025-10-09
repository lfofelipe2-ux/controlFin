# Testing Troubleshooting Guide - ControlFin Project

Este guia contém soluções para problemas comuns encontrados durante o desenvolvimento de testes, baseado nas experiências reais do projeto ControlFin.

## 🚨 Problemas Comuns e Soluções

### 1. **Translation Key Errors**

**Problema:** `TestingLibraryElementError: Unable to find an element with the text: auth.register.emailPlaceholder`

**Causa:** Usar chaves de tradução incorretas ou assumidas.

**Solução:**
```typescript
// ❌ ERRADO - Assumir padrões de chaves
expect(screen.getByText('auth.register.emailPlaceholder')).toBeInTheDocument();

// ✅ CORRETO - Verificar arquivo de tradução real
expect(screen.getByText('register.emailPlaceholder')).toBeInTheDocument();
```

**Prevenção:**
- Sempre verificar arquivos de tradução reais (ex: `auth.json`)
- Usar ferramentas de busca para encontrar chaves corretas
- Documentar padrões de nomenclatura de chaves

### 2. **Element Selection Issues**

**Problema:** `Found multiple elements with the role "img" and name "eye-invisible"`

**Causa:** Múltiplos elementos com o mesmo role e name.

**Solução:**
```typescript
// ❌ ERRADO - Tentar selecionar elemento único quando há múltiplos
const toggleButton = screen.getByRole('img', { name: 'eye-invisible' });

// ✅ CORRETO - Usar getAllByRole e selecionar específico
const toggleButtons = screen.getAllByRole('img', { name: 'eye-invisible' });
const toggleButton = toggleButtons[0]; // Primeiro campo de senha
```

**Prevenção:**
- Usar seletores mais específicos (IDs, data attributes)
- Sempre considerar que pode haver múltiplos elementos similares

### 3. **Form Validation Testing**

**Problema:** `Unable to find an element with the text: register.validation.emailInvalid`

**Causa:** Mensagens de validação podem não aparecer no DOM durante testes.

**Solução:**
```typescript
// ❌ ERRADO - Tentar encontrar texto específico de erro
expect(screen.getByText('register.validation.emailInvalid')).toBeInTheDocument();

// ✅ CORRETO - Verificar estado de validação via CSS classes
await waitFor(() => {
    expect(emailInput.closest('.ant-form-item')).toHaveClass('ant-form-item-has-error');
});
```

**Prevenção:**
- Testar estados de validação via CSS classes
- Usar `waitFor()` para operações assíncronas
- Focar no comportamento, não no texto específico

### 4. **Form Submission Failures**

**Problema:** `expected "spy" to be called with arguments: [...] Number of calls: 0`

**Causa:** Validação do formulário impedindo submissão.

**Solução:**
```typescript
// ❌ ERRADO - Não preencher todos os campos obrigatórios
fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
fireEvent.change(passwordInput, { target: { value: 'password123' } });
fireEvent.click(submitButton);

// ✅ CORRETO - Preencher TODOS os campos obrigatórios
fireEvent.change(firstNameInput, { target: { value: 'John' } });
fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
fireEvent.change(confirmPasswordInput, { target: { value: 'Password123!' } });
fireEvent.click(termsCheckbox);
fireEvent.click(submitButton);
```

**Prevenção:**
- Sempre verificar quais campos são obrigatórios
- Usar senhas que atendam aos requisitos de validação
- Testar validação antes de testar submissão

### 5. **Loading State Testing**

**Problema:** `expect(element).toBeDisabled() Received element is not disabled`

**Causa:** Assumir que todos os elementos são desabilitados durante loading.

**Solução:**
```typescript
// ❌ ERRADO - Assumir que inputs são desabilitados
expect(emailInput).toBeDisabled();
expect(passwordInput).toBeDisabled();

// ✅ CORRETO - Testar comportamento real do componente
const submitButton = screen.getByRole('button', { name: 'loadingregister.registering' });
expect(submitButton).toBeDisabled();
// Inputs permanecem habilitados para correção de erros
```

**Prevenção:**
- Testar comportamento real do componente
- Não assumir como o componente deveria funcionar
- Verificar documentação ou código fonte do componente

### 6. **Mock Management Issues**

**Problema:** Mocks interferindo entre testes.

**Causa:** Não limpar mocks entre testes.

**Solução:**
```typescript
// ✅ CORRETO - Sempre limpar mocks
beforeEach(() => {
    vi.clearAllMocks();
});

// ✅ CORRETO - Usar vi.mocked() para TypeScript
const mockRegister = vi.mocked(useAuth).mockReturnValue({
    register: vi.fn(),
    isLoading: false,
    error: null,
    clearError: vi.fn(),
});
```

**Prevenção:**
- Sempre usar `beforeEach` para limpar mocks
- Usar `vi.mocked()` para type safety
- Documentar dependências mockadas

## 🔧 Ferramentas de Debugging

### 1. **Debugging Element Selection**
```typescript
// Imprimir todos os elementos disponíveis
screen.debug();

// Imprimir elemento específico
screen.debug(emailInput);

// Listar todos os roles disponíveis
console.log(screen.getAllByRole('button').map(el => el.textContent));
```

### 2. **Debugging Translation Keys**
```typescript
// Verificar se chave de tradução existe
const translationKey = 'register.title';
expect(screen.getByText(translationKey)).toBeInTheDocument();

// Listar todas as chaves de tradução usadas
const allTexts = screen.getAllByText(/^[a-z]+\.[a-z]+/);
console.log(allTexts.map(el => el.textContent));
```

### 3. **Debugging Form State**
```typescript
// Verificar estado do formulário
const form = document.querySelector('form[id="register"]');
console.log('Form validity:', form?.checkValidity());

// Verificar classes CSS
const formItem = emailInput.closest('.ant-form-item');
console.log('Form item classes:', formItem?.className);
```

## 📋 Checklist de Testes

### Antes de Escrever Testes:
- [ ] Verificar arquivos de tradução para chaves corretas
- [ ] Identificar todos os campos obrigatórios do formulário
- [ ] Verificar comportamento real do componente (não assumir)
- [ ] Documentar dependências externas que precisam ser mockadas

### Durante o Desenvolvimento:
- [ ] Usar seletores específicos (IDs, data attributes)
- [ ] Testar estados via CSS classes quando possível
- [ ] Preencher todos os campos obrigatórios em testes de submissão
- [ ] Usar `waitFor()` para operações assíncronas
- [ ] Limpar mocks em `beforeEach`

### Após Completar Testes:
- [ ] Executar testes múltiplas vezes para garantir estabilidade
- [ ] Verificar se todos os cenários estão cobertos
- [ ] Documentar padrões específicos do componente
- [ ] Atualizar template de testes se necessário

## 🎯 Padrões Recomendados

### 1. **Estrutura de Testes**
```typescript
describe('ComponentName Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Basic Rendering', () => {
        // Testes de renderização básica
    });

    describe('Form Testing Patterns', () => {
        // Testes específicos de formulário
    });

    describe('Translation and i18n', () => {
        // Testes de tradução
    });

    describe('Accessibility', () => {
        // Testes de acessibilidade
    });
});
```

### 2. **Nomenclatura de Testes**
```typescript
// ✅ DESCRITIVO - Explica o que está sendo testado
it('should show validation error when email format is invalid', async () => {
    // teste
});

// ❌ VAGO - Não explica o comportamento esperado
it('should validate email', () => {
    // teste
});
```

### 3. **Organização de Mocks**
```typescript
// Agrupar mocks relacionados
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { changeLanguage: vi.fn() },
    }),
}));

vi.mock('@/hooks/useAuth', () => ({
    useAuth: vi.fn(),
}));
```

## 📚 Recursos Adicionais

- [Testing Library Best Practices](https://testing-library.com/docs/guiding-principles)
- [Vitest Documentation](https://vitest.dev/guide/)
- [React Testing Library Queries](https://testing-library.com/docs/queries/about/)
- [Ant Design Testing Guide](https://ant.design/docs/react/test)

---

**Última atualização:** 2025-01-27  
**Baseado em:** Experiências reais do desenvolvimento de testes do RegisterForm  
**Contribuições:** Equipe ControlFin
