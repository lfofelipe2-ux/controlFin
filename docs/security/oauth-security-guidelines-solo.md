# OAuth Security Guidelines - Solo Developer (Vibe Coding)

## 🛡️ Security Prevention Guide for Solo Development

This document provides essential security guidelines for OAuth implementation in a solo development environment using vibe coding.

---

## 📋 Critical Security Issues to Prevent

### 1. **Missing Rate Limiting** (CRITICAL)

**Always implement rate limiting on OAuth endpoints:**

```typescript
// Rate limiting configuration
const rateLimitConfig = {
  max: 10, // Maximum 10 requests
  timeWindow: '15 minutes', // Per 15 minutes
  errorResponseBuilder: (request: FastifyRequest, context: any) => {
    return {
      statusCode: 429,
      error: 'Too Many Requests',
      message: 'OAuth rate limit exceeded. Please try again later.',
      retryAfter: Math.round(context.after / 1000) || 15,
    };
  },
};
```

**Vibe Coding Prompt:**

```
@cursor Implement rate limiting on OAuth endpoints using @fastify/rate-limit with 10 requests per 15 minutes
```

---

### 2. **User-Controlled Bypass of Security Check** (CRITICAL)

**Always validate authorization codes strictly:**

```typescript
// Strict validation of authorization code
if (!code || typeof code !== 'string' || code.trim().length === 0) {
  console.error('Invalid or missing authorization code:', { code, state });
  return reply.redirect(
    `${process.env['FRONTEND_URL']}/auth?error=oauth_error&message=Invalid authorization code`
  );
}

// Additional validation: ensure code is not a malicious string
if (code.length > 1000 || !/^[a-zA-Z0-9._-]+$/.test(code)) {
  console.error('Suspicious authorization code format:', { codeLength: code.length });
  return reply.redirect(
    `${process.env['FRONTEND_URL']}/auth?error=oauth_error&message=Invalid authorization code format`
  );
}
```

**Vibe Coding Prompt:**

```
@cursor Add strict validation for OAuth authorization codes with type checking, length limits, and format validation
```

---

### 3. **Weak State Parameter/CSRF Protection** (MEDIUM)

**Always use cryptographically secure state parameters:**

```typescript
// Generate cryptographically secure state parameter for CSRF protection
const stateData = {
  timestamp: Date.now(),
  redirectUri,
  nonce: crypto.randomBytes(16).toString('hex'), // Added nonce
};

// Create HMAC signature for state validation
const stateString = JSON.stringify(stateData);
const signature = crypto
  .createHmac('sha256', process.env['GOOGLE_CLIENT_SECRET'] || 'fallback-secret')
  .update(stateString)
  .digest('hex');

const state = Buffer.from(
  JSON.stringify({
    ...stateData,
    signature, // Added signature to state
  })
).toString('base64');
```

**Vibe Coding Prompt:**

```
@cursor Implement HMAC-signed state parameter for OAuth with nonce and timestamp validation
```

---

### 4. **Reverse Tabnabbing** (MEDIUM)

**Always use secure window.open:**

```typescript
// Secure window.open with noopener and noreferrer
window.open('https://console.cloud.google.com/', '_blank', 'noopener,noreferrer');
```

**Vibe Coding Prompt:**

```
@cursor Fix window.open security by adding noopener,noreferrer attributes
```

---

## 🔒 Quick Security Checklist

### Before Deploying OAuth Features:

- [ ] **Rate Limiting**: Implemented on all OAuth endpoints
- [ ] **Input Validation**: Strict validation of all inputs
- [ ] **State Parameter**: Uses HMAC signature with nonce
- [ ] **Error Handling**: Secure error messages
- [ ] **Window.open Security**: Uses noopener,noreferrer
- [ ] **HTTPS**: Enforced in production
- [ ] **Environment Variables**: Sensitive data in .env

### Vibe Coding Validation:

```
@cursor Review this OAuth implementation for security vulnerabilities and fix any issues found
```

---

## 🧪 Automated Security Testing

### Quick Security Test Commands:

```bash
# Test rate limiting
for i in {1..15}; do curl -X GET "http://localhost:3000/auth/google"; done

# Test input validation
curl -X POST "http://localhost:3000/auth/google/callback" \
  -H "Content-Type: application/json" \
  -d '{"code": "<script>alert(1)</script>"}'

# Test state parameter
curl "http://localhost:3000/auth/google/callback?code=test&state=invalid"
```

### Expected Results:

- Rate limiting: First 10 requests succeed, next 5 return 429
- Input validation: Malicious inputs return 400
- State parameter: Invalid state returns 400 or redirect

---

## 🚨 Quick Incident Response

### If Security Issues Are Found:

1. **Immediate**: Use vibe coding to fix the issue

   ```
   @cursor Fix this security vulnerability: [describe issue]
   ```

2. **Test**: Run quick security tests

   ```bash
   npm run test:security
   ```

3. **Deploy**: Deploy fix immediately
   ```bash
   git add . && git commit -m "fix: security vulnerability" && git push
   ```

---

## 📚 Essential Resources

### OAuth Security:

- [OWASP OAuth Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Cheat_Sheet.html)
- [Google OAuth Security](https://developers.google.com/identity/protocols/oauth2)

### Vibe Coding Security:

- Use `@cursor` prompts for security fixes
- Always review AI-generated security code
- Test security implementations immediately

---

**Last Updated**: 2025-01-27  
**Version**: 1.0 (Solo Developer)  
**Maintainer**: Solo Developer
