# OAuth Security Guidelines - ControlFin

## 🛡️ Security Vulnerabilities Prevention Guide

This document outlines the security measures implemented to prevent OAuth-related vulnerabilities and serves as a reference for future development.

---

## 📋 Critical Security Issues Resolved

### 1. **Missing Rate Limiting** (CRITICAL)

**Issue**: OAuth endpoints were vulnerable to brute force attacks and abuse.

**Solution Implemented**:

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

**Prevention Rules**:

- ✅ **ALWAYS** implement rate limiting on OAuth endpoints
- ✅ **ALWAYS** use `@fastify/rate-limit` for Fastify applications
- ✅ **ALWAYS** configure appropriate limits (10 requests per 15 minutes)
- ✅ **ALWAYS** provide clear error messages with retry-after headers

---

### 2. **User-Controlled Bypass of Security Check** (CRITICAL)

**Issue**: Authorization codes could be manipulated to bypass security validations.

**Solution Implemented**:

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

**Prevention Rules**:

- ✅ **ALWAYS** validate authorization code type and format
- ✅ **ALWAYS** check code length (max 1000 characters)
- ✅ **ALWAYS** use regex validation for safe character set
- ✅ **ALWAYS** log suspicious attempts for monitoring
- ✅ **ALWAYS** reject invalid codes immediately

---

### 3. **Weak State Parameter/CSRF Protection** (MEDIUM)

**Issue**: State parameter was not cryptographically secure, allowing CSRF attacks.

**Solution Implemented**:

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

**Prevention Rules**:

- ✅ **ALWAYS** use cryptographically secure random nonce
- ✅ **ALWAYS** include timestamp for expiration validation
- ✅ **ALWAYS** create HMAC signature using client secret
- ✅ **ALWAYS** validate signature on callback
- ✅ **ALWAYS** check timestamp expiration (10 minutes max)

---

### 4. **Reverse Tabnabbing** (MEDIUM)

**Issue**: `window.open()` calls were vulnerable to tabnabbing attacks.

**Solution Implemented**:

```typescript
// Secure window.open with noopener and noreferrer
window.open('https://console.cloud.google.com/', '_blank', 'noopener,noreferrer');
```

**Prevention Rules**:

- ✅ **ALWAYS** use `noopener,noreferrer` with `window.open()`
- ✅ **ALWAYS** validate external URLs before opening
- ✅ **ALWAYS** use `_blank` target for external links
- ✅ **NEVER** use `window.open()` without security attributes

---

## 🔒 Security Implementation Checklist

### For OAuth Endpoints:

- [ ] **Rate Limiting**: Implement rate limiting (10 req/15min)
- [ ] **Input Validation**: Strict validation of all inputs
- [ ] **State Parameter**: Use HMAC-signed state with nonce
- [ ] **Error Handling**: Secure error messages without sensitive data
- [ ] **Logging**: Log security events for monitoring
- [ ] **HTTPS**: Enforce HTTPS in production
- [ ] **CORS**: Configure appropriate CORS policies

### For Frontend OAuth:

- [ ] **Secure Redirects**: Validate redirect URLs
- [ ] **Window.open Security**: Use noopener,noreferrer
- [ ] **Token Storage**: Use secure storage methods
- [ ] **Error Boundaries**: Implement proper error handling
- [ ] **Input Sanitization**: Sanitize all user inputs

---

## 🚨 Security Testing Requirements

### Before Deploying OAuth Features:

1. **Rate Limiting Test**:

   ```bash
   # Test rate limiting
   for i in {1..15}; do curl -X GET "http://localhost:3000/auth/google"; done
   ```

2. **State Parameter Test**:

   ```bash
   # Test with invalid state
   curl "http://localhost:3000/auth/google/callback?code=test&state=invalid"
   ```

3. **Input Validation Test**:
   ```bash
   # Test with malicious code
   curl -X POST "http://localhost:3000/auth/google/callback" \
     -H "Content-Type: application/json" \
     -d '{"code": "<script>alert(1)</script>"}'
   ```

---

## 📚 Security Resources

### OAuth 2.0 Security Best Practices:

- [RFC 6749 - OAuth 2.0 Authorization Framework](https://tools.ietf.org/html/rfc6749)
- [OAuth 2.0 Security Best Current Practice](https://tools.ietf.org/html/draft-ietf-oauth-security-topics)
- [OWASP OAuth Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Cheat_Sheet.html)

### Fastify Security:

- [@fastify/rate-limit Documentation](https://github.com/fastify/fastify-rate-limit)
- [@fastify/helmet Documentation](https://github.com/fastify/fastify-helmet)

---

## 🔄 Code Review Checklist

### Security Review Points:

- [ ] **Rate limiting implemented** on all OAuth endpoints
- [ ] **Input validation** for all user inputs
- [ ] **State parameter** uses HMAC signature
- [ ] **Error messages** don't leak sensitive information
- [ ] **Logging** includes security events
- [ ] **External links** use secure window.open
- [ ] **HTTPS** enforced in production
- [ ] **CORS** properly configured

---

## 📝 Incident Response

### If Security Issues Are Found:

1. **Immediate**: Disable affected endpoints
2. **Assessment**: Evaluate impact and scope
3. **Fix**: Implement proper security measures
4. **Test**: Verify fix with security tests
5. **Deploy**: Deploy fix with monitoring
6. **Document**: Update this guide with lessons learned

---

## 🎯 Future Prevention

### Development Process:

1. **Security-First Design**: Consider security from the start
2. **Code Review**: Always include security review
3. **Automated Testing**: Include security tests in CI/CD
4. **Regular Audits**: Periodic security assessments
5. **Training**: Keep team updated on security best practices

---

**Last Updated**: 2025-01-27  
**Version**: 1.0  
**Maintainer**: ControlFin Security Team
