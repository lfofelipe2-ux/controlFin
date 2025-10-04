# Security Testing Guide - ControlFin

## 🧪 Comprehensive Security Testing Procedures

This guide provides step-by-step procedures for testing OAuth and authentication security features.

---

## 🔴 Critical Security Tests

### 1. Rate Limiting Tests

#### Test Rate Limiting on OAuth Endpoints

```bash
#!/bin/bash
# Test OAuth rate limiting
echo "Testing OAuth rate limiting..."

# Test /auth/google endpoint
echo "Testing /auth/google rate limiting..."
for i in {1..15}; do
  echo "Request $i:"
  curl -s -o /dev/null -w "%{http_code}\n" \
    -X GET "http://localhost:3000/auth/google"
  sleep 1
done

# Test /auth/google/callback endpoint
echo "Testing /auth/google/callback rate limiting..."
for i in {1..15}; do
  echo "Request $i:"
  curl -s -o /dev/null -w "%{http_code}\n" \
    -X GET "http://localhost:3000/auth/google/callback?code=test&state=test"
  sleep 1
done

# Test POST /auth/google/callback endpoint
echo "Testing POST /auth/google/callback rate limiting..."
for i in {1..15}; do
  echo "Request $i:"
  curl -s -o /dev/null -w "%{http_code}\n" \
    -X POST "http://localhost:3000/auth/google/callback" \
    -H "Content-Type: application/json" \
    -d '{"code": "test"}'
  sleep 1
done
```

**Expected Results**:

- First 10 requests: 200 or 302 (success/redirect)
- Requests 11-15: 429 (Too Many Requests)
- Retry-After header present in 429 responses

---

### 2. Input Validation Tests

#### Test Authorization Code Validation

```bash
#!/bin/bash
# Test authorization code validation

echo "Testing authorization code validation..."

# Test with empty code
echo "1. Testing empty code..."
curl -s -w "Status: %{http_code}\n" \
  -X POST "http://localhost:3000/auth/google/callback" \
  -H "Content-Type: application/json" \
  -d '{"code": ""}'

# Test with null code
echo "2. Testing null code..."
curl -s -w "Status: %{http_code}\n" \
  -X POST "http://localhost:3000/auth/google/callback" \
  -H "Content-Type: application/json" \
  -d '{"code": null}'

# Test with malicious code (XSS attempt)
echo "3. Testing malicious code..."
curl -s -w "Status: %{http_code}\n" \
  -X POST "http://localhost:3000/auth/google/callback" \
  -H "Content-Type: application/json" \
  -d '{"code": "<script>alert(1)</script>"}'

# Test with SQL injection attempt
echo "4. Testing SQL injection attempt..."
curl -s -w "Status: %{http_code}\n" \
  -X POST "http://localhost:3000/auth/google/callback" \
  -H "Content-Type: application/json" \
  -d '{"code": "1; DROP TABLE users;"}'

# Test with extremely long code
echo "5. Testing extremely long code..."
curl -s -w "Status: %{http_code}\n" \
  -X POST "http://localhost:3000/auth/google/callback" \
  -H "Content-Type: application/json" \
  -d "{\"code\": \"$(printf 'a%.0s' {1..2000})\"}"
```

**Expected Results**:

- All tests should return 400 (Bad Request)
- Error messages should not leak sensitive information
- Malicious inputs should be rejected

---

### 3. State Parameter Security Tests

#### Test State Parameter Validation

```bash
#!/bin/bash
# Test state parameter security

echo "Testing state parameter security..."

# Test with invalid state
echo "1. Testing invalid state..."
curl -s -w "Status: %{http_code}\n" \
  "http://localhost:3000/auth/google/callback?code=test&state=invalid"

# Test with expired state
echo "2. Testing expired state..."
# Create a state with old timestamp
expired_state=$(echo '{"timestamp": 1000000000000, "redirectUri": "http://localhost:5173/auth/callback", "nonce": "test", "signature": "invalid"}' | base64)
curl -s -w "Status: %{http_code}\n" \
  "http://localhost:3000/auth/google/callback?code=test&state=$expired_state"

# Test with tampered state
echo "3. Testing tampered state..."
tampered_state=$(echo '{"timestamp": 1640995200000, "redirectUri": "http://localhost:5173/auth/callback", "nonce": "test", "signature": "tampered"}' | base64)
curl -s -w "Status: %{http_code}\n" \
  "http://localhost:3000/auth/google/callback?code=test&state=$tampered_state"
```

**Expected Results**:

- Invalid state: 400 or redirect to error page
- Expired state: 400 or redirect to error page
- Tampered state: 400 or redirect to error page

---

## 🟡 Medium Priority Security Tests

### 4. Frontend Security Tests

#### Test Window.open Security

```javascript
// Test window.open security in browser console
console.log('Testing window.open security...');

// Test with noopener,noreferrer
const secureWindow = window.open(
  'https://console.cloud.google.com/',
  '_blank',
  'noopener,noreferrer'
);
console.log('Secure window opened:', secureWindow);

// Test if opener is null (should be null for security)
console.log('Opener is null:', secureWindow.opener === null);

// Test if referrer is not accessible (should be empty)
console.log('Referrer is empty:', document.referrer === '');
```

**Expected Results**:

- `secureWindow.opener` should be `null`
- `document.referrer` should be empty
- No security warnings in console

---

### 5. Error Handling Tests

#### Test Error Message Security

```bash
#!/bin/bash
# Test error message security

echo "Testing error message security..."

# Test with invalid credentials
echo "1. Testing invalid credentials error..."
curl -s -w "Status: %{http_code}\n" \
  -X POST "http://localhost:3000/auth/google/callback" \
  -H "Content-Type: application/json" \
  -d '{"code": "invalid_code"}'

# Test with malformed request
echo "2. Testing malformed request error..."
curl -s -w "Status: %{http_code}\n" \
  -X POST "http://localhost:3000/auth/google/callback" \
  -H "Content-Type: application/json" \
  -d '{"invalid": "data"}'
```

**Expected Results**:

- Error messages should be generic
- No sensitive information in error responses
- Proper HTTP status codes

---

## 🟢 Low Priority Security Tests

### 6. CORS Security Tests

#### Test CORS Configuration

```bash
#!/bin/bash
# Test CORS security

echo "Testing CORS configuration..."

# Test preflight request
echo "1. Testing preflight request..."
curl -s -w "Status: %{http_code}\n" \
  -X OPTIONS "http://localhost:3000/auth/google/callback" \
  -H "Origin: https://malicious-site.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type"

# Test actual request with different origin
echo "2. Testing request with different origin..."
curl -s -w "Status: %{http_code}\n" \
  -X POST "http://localhost:3000/auth/google/callback" \
  -H "Content-Type: application/json" \
  -H "Origin: https://malicious-site.com" \
  -d '{"code": "test"}'
```

**Expected Results**:

- CORS headers should be properly configured
- Requests from unauthorized origins should be blocked

---

## 🔧 Automated Security Testing

### 7. Security Test Suite

#### Create Security Test File

```typescript
// tests/security/oauth-security.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { build } from '../src/server';

describe('OAuth Security Tests', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = build();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limiting on OAuth endpoints', async () => {
      // Test rate limiting implementation
      const promises = Array.from({ length: 15 }, () =>
        app.inject({
          method: 'GET',
          url: '/auth/google',
        })
      );

      const responses = await Promise.all(promises);

      // First 10 should succeed
      for (let i = 0; i < 10; i++) {
        expect(responses[i].statusCode).toBeLessThan(400);
      }

      // Last 5 should be rate limited
      for (let i = 10; i < 15; i++) {
        expect(responses[i].statusCode).toBe(429);
      }
    });
  });

  describe('Input Validation', () => {
    it('should reject invalid authorization codes', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/google/callback',
        payload: {
          code: '<script>alert(1)</script>',
        },
      });

      expect(response.statusCode).toBe(400);
      expect(response.json()).toHaveProperty('error');
    });
  });

  describe('State Parameter Security', () => {
    it('should reject invalid state parameters', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/auth/google/callback?code=test&state=invalid',
      });

      expect(response.statusCode).toBeGreaterThanOrEqual(400);
    });
  });
});
```

---

## 📊 Security Test Results Template

### Test Results Documentation

```markdown
# Security Test Results - [Date]

## Test Environment

- **Date**: [Date]
- **Tester**: [Name]
- **Environment**: [Development/Staging/Production]
- **Version**: [Version]

## Test Results

### Critical Security Tests

- [ ] Rate Limiting: ✅ PASS / ❌ FAIL
- [ ] Input Validation: ✅ PASS / ❌ FAIL
- [ ] State Parameter Security: ✅ PASS / ❌ FAIL

### Medium Priority Tests

- [ ] Frontend Security: ✅ PASS / ❌ FAIL
- [ ] Error Handling: ✅ PASS / ❌ FAIL

### Low Priority Tests

- [ ] CORS Security: ✅ PASS / ❌ FAIL

## Issues Found

[List any security issues found during testing]

## Recommendations

[List recommendations for improving security]

## Sign-off

- **Security Tester**: [Name] [Date]
- **Development Team**: [Name] [Date]
- **Approved for Production**: [ ] Yes [ ] No
```

---

## 🚨 Security Test Failure Response

### If Security Tests Fail:

1. **Immediate Action**:
   - Stop deployment process
   - Document the failure
   - Notify security team

2. **Investigation**:
   - Analyze the failure
   - Identify root cause
   - Assess impact

3. **Resolution**:
   - Implement fix
   - Re-run security tests
   - Verify fix works

4. **Prevention**:
   - Update security guidelines
   - Improve test coverage
   - Train team on issue

---

**Last Updated**: 2025-01-27  
**Version**: 1.0  
**Next Review**: 2025-02-27
