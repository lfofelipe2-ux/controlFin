/**
 * TESTING GUIDELINES - ControlFin Project
 * 
 * This document provides comprehensive guidelines for testing in the ControlFin project,
 * following the BlockAI design system and established architectural patterns.
 */

# TESTING GUIDELINES - ControlFin Project

## Overview

This document establishes standardized testing practices for the ControlFin project, ensuring consistency, reliability, and maintainability across all test suites.

## Testing Philosophy

### Core Principles
- **Test Behavior, Not Implementation**: Focus on what the code does, not how it does it
- **Test User Interactions**: Prioritize testing user-facing functionality
- **Maintain Test Independence**: Each test should be able to run in isolation
- **Keep Tests Simple**: Tests should be easy to understand and maintain
- **Follow BlockAI Patterns**: Maintain consistency with the design system

### Testing Pyramid
```
        /\
       /  \
      / E2E \     <- Few, high-level user journey tests
     /______\
    /        \
   /Integration\ <- Some, component interaction tests
  /____________\
 /              \
/    Unit Tests   \ <- Many, isolated function/component tests
/__________________\
```

## Test Types and Guidelines

### 1. Unit Tests

**Purpose**: Test individual functions, methods, or components in isolation.

**When to Use**:
- Testing business logic functions
- Testing utility functions
- Testing individual component rendering
- Testing service methods

**Guidelines**:
- Use `vitest` for unit tests
- Mock external dependencies
- Test edge cases and error conditions
- Aim for 70%+ coverage on critical business logic

**Example Structure**:
```typescript
describe('ComponentName', () => {
  describe('Basic Rendering', () => {
    it('should render with default props', () => {
      // Test implementation
    });
  });

  describe('User Interactions', () => {
    it('should handle click events', () => {
      // Test implementation
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty data gracefully', () => {
      // Test implementation
    });
  });
});
```

### 2. Integration Tests

**Purpose**: Test how multiple components or services work together.

**When to Use**:
- Testing API service integration
- Testing component interactions
- Testing data flow between layers
- Testing authentication flows

**Guidelines**:
- Use real API endpoints (or close mocks)
- Test complete user workflows
- Verify data consistency across layers
- Test error propagation

### 3. End-to-End (E2E) Tests

**Purpose**: Test complete user journeys from start to finish.

**When to Use**:
- Testing critical user flows
- Testing cross-browser compatibility
- Testing responsive design
- Testing accessibility features

**Guidelines**:
- Use Playwright for E2E tests
- Test on multiple browsers/devices
- Use realistic test data
- Include visual regression tests

## Testing Patterns

### 1. Component Testing Pattern

**Setup**:
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ConfigProvider } from 'antd';
import { ComponentName } from '../ComponentName';

// Mock external dependencies
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Test wrapper with theme
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ConfigProvider theme={antdTheme}>
    {children}
  </ConfigProvider>
);

const renderWithTheme = (component: React.ReactElement) => {
  return render(component, { wrapper: TestWrapper });
};
```

**Test Categories**:
- Basic Rendering
- User Interactions
- State Management
- Accessibility
- BlockAI Theme Integration
- Edge Cases
- Performance
- Integration

### 2. Service Testing Pattern

**Setup**:
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ServiceName } from '../ServiceName';
import { apiService } from '@/services/api';

vi.mock('@/services/api');

describe('ServiceName', () => {
  let service: ServiceName;
  let mockApiService: any;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ServiceName();
    mockApiService = vi.mocked(apiService);
  });
});
```

**Test Categories**:
- Basic Functionality
- CRUD Operations
- Business Logic
- Error Handling
- Caching
- Performance
- Integration

### 3. E2E Testing Pattern

**Setup**:
```typescript
import { test, expect, Page } from '@playwright/test';

class TestHelpers {
  constructor(private page: Page) {}

  async login(email: string, password: string) {
    // Helper implementation
  }

  async navigateToSection(section: string) {
    // Helper implementation
  }
}

test.describe('Feature E2E Tests', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    // Setup mocks
  });
});
```

**Test Categories**:
- Authentication Flow
- Navigation
- Feature-Specific Flows
- Responsive Design
- Accessibility
- Performance
- Error Handling
- Visual Regression

## Mocking Guidelines

### 1. API Service Mocking

**For Unit Tests**:
```typescript
vi.mock('@/services/api', () => ({
  apiService: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));
```

**For E2E Tests**:
```typescript
await page.route('**/api/**', async route => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(mockData),
  });
});
```

### 2. External Library Mocking

**React i18next**:
```typescript
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: vi.fn(),
    },
  }),
}));
```

**Zustand Stores**:
```typescript
vi.mock('@/store/storeName', () => ({
  useStoreNameStore: () => ({
    data: [],
    loading: false,
    fetchData: vi.fn(),
  }),
}));
```

### 3. Browser API Mocking

**Local Storage**:
```typescript
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
});
```

**Window Object**:
```typescript
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    pathname: '/',
    search: '',
    hash: '',
  },
});
```

## Test Data Management

### 1. Test Data Constants

**Create centralized test data**:
```typescript
export const TEST_DATA = {
  user: {
    email: 'test@controlfin.com',
    password: 'TestPassword123!',
    name: 'Test User',
  },
  transaction: {
    amount: '150.50',
    description: 'Test Transaction',
    category: 'Food',
    type: 'expense',
  },
  space: {
    name: 'Test Financial Space',
  },
};
```

### 2. Test Data Factories

**Create data factories for complex objects**:
```typescript
export const createTransaction = (overrides: Partial<Transaction> = {}) => ({
  id: '123',
  amount: 15050, // In cents
  description: 'Test Transaction',
  category: 'Food',
  type: 'expense',
  date: new Date().toISOString(),
  ...overrides,
});

export const createUser = (overrides: Partial<User> = {}) => ({
  id: '123',
  email: 'test@controlfin.com',
  name: 'Test User',
  ...overrides,
});
```

## Assertion Patterns

### 1. Component Assertions

**Element Visibility**:
```typescript
expect(screen.getByTestId('component')).toBeInTheDocument();
expect(screen.getByText('Button Text')).toBeVisible();
expect(screen.queryByText('Error Message')).not.toBeInTheDocument();
```

**Element Properties**:
```typescript
expect(element).toHaveClass('expected-class');
expect(element).toHaveAttribute('aria-label', 'Expected Label');
expect(element).toHaveStyle('background-color: rgb(0, 217, 255)');
```

**Element Content**:
```typescript
expect(element).toHaveTextContent('Expected Text');
expect(element).toHaveValue('Expected Value');
```

### 2. Interaction Assertions

**Event Handling**:
```typescript
const handleClick = vi.fn();
render(<Component onClick={handleClick} />);
fireEvent.click(screen.getByRole('button'));
expect(handleClick).toHaveBeenCalledTimes(1);
expect(handleClick).toHaveBeenCalledWith(expectedArgs);
```

**Form Interactions**:
```typescript
fireEvent.change(input, { target: { value: 'new value' } });
expect(input).toHaveValue('new value');
```

### 3. Async Assertions

**Wait for Elements**:
```typescript
await waitFor(() => {
  expect(screen.getByText('Loaded Content')).toBeInTheDocument();
});
```

**Wait for API Calls**:
```typescript
await waitFor(() => {
  expect(mockApiService.get).toHaveBeenCalledWith('/api/endpoint');
});
```

## BlockAI Theme Testing

### 1. Theme Integration Tests

**Color Assertions**:
```typescript
const element = screen.getByTestId('component');
const computedStyle = window.getComputedStyle(element);
expect(computedStyle.backgroundColor).toMatch(/rgb\(54, 61, 101\)|#363d65/);
```

**Typography Assertions**:
```typescript
const heading = screen.getByRole('heading');
const computedStyle = window.getComputedStyle(heading);
expect(computedStyle.fontFamily).toContain('Inter');
expect(computedStyle.fontWeight).toBe('600');
```

### 2. Responsive Design Tests

**Viewport Testing**:
```typescript
test('should work on mobile devices', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  // Test mobile-specific behavior
});
```

## Performance Testing

### 1. Load Time Testing

**E2E Performance**:
```typescript
test('should load within acceptable time', async ({ page }) => {
  const startTime = Date.now();
  await page.goto('/dashboard');
  const endTime = Date.now();
  expect(endTime - startTime).toBeLessThan(3000);
});
```

### 2. Memory Leak Testing

**Component Cleanup**:
```typescript
test('should not cause memory leaks', () => {
  const { unmount } = render(<Component />);
  unmount();
  // Verify cleanup
});
```

## Accessibility Testing

### 1. Keyboard Navigation

**Tab Order Testing**:
```typescript
test('should support keyboard navigation', async ({ page }) => {
  await page.press('[data-testid="button"]', 'Tab');
  await expect(page.locator('[data-testid="next-element"]')).toBeFocused();
});
```

### 2. ARIA Labels

**Accessibility Attributes**:
```typescript
expect(element).toHaveAttribute('aria-label', 'Expected Label');
expect(element).toHaveAttribute('role', 'button');
expect(element).toHaveAttribute('aria-expanded', 'false');
```

### 3. Color Contrast

**Contrast Testing**:
```typescript
test('should have proper color contrast', () => {
  const element = screen.getByText('Text');
  const computedStyle = window.getComputedStyle(element);
  // Use contrast checking utility
  expect(hasSufficientContrast(computedStyle.color, computedStyle.backgroundColor)).toBe(true);
});
```

## Error Handling Testing

### 1. API Error Testing

**Network Errors**:
```typescript
mockApiService.get.mockRejectedValue(new Error('Network error'));
await expect(service.getData()).rejects.toThrow('Network error');
```

**Server Errors**:
```typescript
mockApiService.post.mockRejectedValue({
  response: {
    status: 500,
    data: { message: 'Internal server error' },
  },
});
```

### 2. User Error Testing

**Form Validation**:
```typescript
fireEvent.click(submitButton);
await waitFor(() => {
  expect(screen.getByText('Validation error')).toBeInTheDocument();
});
```

## Test Organization

### 1. File Structure

```
tests/
├── templates/           # Test templates
├── fixtures/            # Test data fixtures
├── helpers/             # Test helper functions
├── unit/                # Unit tests
│   ├── components/      # Component tests
│   ├── services/        # Service tests
│   └── utils/           # Utility tests
├── integration/         # Integration tests
└── e2e/                 # End-to-end tests
    ├── auth.spec.ts
    ├── transactions.spec.ts
    └── dashboard.spec.ts
```

### 2. Naming Conventions

**Test Files**:
- Unit tests: `ComponentName.test.tsx`
- Integration tests: `featureName.integration.test.ts`
- E2E tests: `featureName.spec.ts`

**Test Descriptions**:
- Use descriptive test names
- Start with "should" for behavior tests
- Use "when" for conditional tests
- Be specific about expected outcomes

**Examples**:
```typescript
it('should render login form with all required fields', () => {});
it('should show error message when validation fails', () => {});
it('should redirect to dashboard after successful login', () => {});
```

## Continuous Integration

### 1. Test Scripts

**Package.json Scripts**:
```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run --reporter=verbose",
    "test:integration": "vitest run --config vitest.integration.config.ts",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:coverage": "vitest run --coverage",
    "test:all": "npm run test:unit && npm run test:e2e"
  }
}
```

### 2. CI Configuration

**GitHub Actions**:
```yaml
- name: Run Unit Tests
  run: npm run test:unit

- name: Run E2E Tests
  run: npm run test:e2e

- name: Generate Coverage Report
  run: npm run test:coverage
```

## Best Practices

### 1. Test Maintenance

- Keep tests up to date with code changes
- Refactor tests when refactoring code
- Remove obsolete tests
- Update test data when business logic changes

### 2. Test Performance

- Use `vi.clearAllMocks()` in `beforeEach`
- Avoid unnecessary async operations
- Use `waitFor` sparingly
- Mock expensive operations

### 3. Test Readability

- Use descriptive test names
- Group related tests with `describe`
- Use helper functions for common operations
- Keep test setup minimal

### 4. Test Reliability

- Avoid flaky tests
- Use deterministic test data
- Mock external dependencies
- Test error conditions

## Common Anti-Patterns

### 1. Testing Implementation Details

**❌ Bad**:
```typescript
expect(component.state.isLoading).toBe(true);
```

**✅ Good**:
```typescript
expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
```

### 2. Over-Mocking

**❌ Bad**:
```typescript
vi.mock('react', () => ({
  useState: vi.fn(),
  useEffect: vi.fn(),
}));
```

**✅ Good**:
```typescript
vi.mock('@/services/api', () => ({
  apiService: { get: vi.fn() },
}));
```

### 3. Testing Multiple Things

**❌ Bad**:
```typescript
it('should render, handle click, and update state', () => {
  // Multiple assertions
});
```

**✅ Good**:
```typescript
it('should render with default props', () => {});
it('should handle click events', () => {});
it('should update state correctly', () => {});
```

## Conclusion

These testing guidelines ensure that the ControlFin project maintains high quality, reliability, and maintainability. Follow these patterns consistently across all test suites to create a robust testing foundation.

Remember:
- Test behavior, not implementation
- Keep tests simple and focused
- Use appropriate test types for different scenarios
- Maintain consistency with BlockAI design patterns
- Follow the established testing pyramid structure
