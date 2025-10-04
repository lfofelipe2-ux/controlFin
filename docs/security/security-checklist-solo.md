# Security Checklist - Solo Developer (Vibe Coding)

## 🛡️ Pre-Deploy Security Checklist

Quick checklist for solo developers using vibe coding before deploying OAuth or authentication features.

---

## 🔴 Critical Security Requirements

### OAuth Implementation

- [ ] **Rate Limiting**: All OAuth endpoints have rate limiting (10 req/15min)
- [ ] **Input Validation**: Strict validation of authorization codes
- [ ] **State Parameter**: HMAC-signed state with nonce and timestamp
- [ ] **Error Handling**: Secure error messages without sensitive data
- [ ] **Logging**: Security events are logged for monitoring

### Frontend Security

- [ ] **Window.open Security**: All `window.open()` calls use `noopener,noreferrer`
- [ ] **External Links**: All external links are validated
- [ ] **Input Sanitization**: All user inputs are sanitized
- [ ] **Error Boundaries**: Proper error handling implemented

### Backend Security

- [ ] **HTTPS**: HTTPS enforced in production
- [ ] **CORS**: Appropriate CORS policies configured
- [ ] **Environment Variables**: Sensitive data in environment variables
- [ ] **Database Security**: Proper database access controls

---

## 🧪 Quick Security Testing

### Automated Tests

- [ ] **Unit Tests**: Security-related unit tests passing
- [ ] **Integration Tests**: OAuth flow integration tests
- [ ] **Security Tests**: Run `npm run test:security`
- [ ] **Dependency Audit**: Run `npm audit`

### Manual Testing (Quick)

- [ ] **Rate Limiting**: Test with 15 requests to OAuth endpoint
- [ ] **Input Validation**: Test with malicious inputs
- [ ] **Error Handling**: Test error scenarios
- [ ] **Frontend Security**: Test window.open security

---

## 🔧 Vibe Coding Security Prompts

### Before Deploy:

```
@cursor Review this OAuth implementation for security vulnerabilities and fix any issues found
```

### After Deploy:

```
@cursor Test the OAuth security implementation and verify all security measures are working
```

### If Issues Found:

```
@cursor Fix this security vulnerability: [describe issue] and implement proper security measures
```

---

## 📋 Code Review Security Points

### OAuth Code Review

- [ ] **Rate limiting implemented** on all OAuth endpoints
- [ ] **Input validation** for all user inputs
- [ ] **State parameter** uses HMAC signature
- [ ] **Error messages** don't leak sensitive information
- [ ] **Logging** includes security events
- [ ] **External links** use secure window.open
- [ ] **HTTPS** enforced in production
- [ ] **CORS** properly configured

### General Code Review

- [ ] **No hardcoded secrets** in code
- [ ] **Proper error handling** throughout
- [ ] **Input sanitization** on all inputs
- [ ] **XSS prevention** in frontend code
- [ ] **CSRF protection** implemented

---

## 🚨 Quick Incident Response

### If Security Issues Are Found:

1. **Immediate (0-5 minutes)**:
   - Use vibe coding to fix: `@cursor Fix this security issue: [describe]`
   - Test fix: `npm run test:security`
   - Deploy fix: `git add . && git commit -m "fix: security" && git push`

2. **Documentation (5-10 minutes)**:
   - Update security guidelines if needed
   - Document the fix for future reference

---

## 📚 Essential Resources

### Documentation

- [OAuth Security Guidelines (Solo)](./oauth-security-guidelines-solo.md)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP OAuth Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Cheat_Sheet.html)

### Tools

- [ESLint Security Plugin](https://github.com/eslint-community/eslint-plugin-security)
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit)

---

## ✅ Quick Sign-off

**Security Review**: [ ] Self-reviewed via vibe coding  
**Date**: ********\_********  
**Deploy Approved**: [ ] Yes [ ] No  
**Notes**: ********\_********

---

**Last Updated**: 2025-01-27  
**Version**: 1.0 (Solo Developer)  
**Next Review**: As needed
