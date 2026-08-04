# Security Policy

The **Foodstore** core team takes the security of our application, API, and user data seriously.

## Supported Versions

Only the latest release version on the `master` branch is supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 2.2.x   | :white_check_mark: |
| 2.1.x   | :x:                |
| < 2.0   | :x:                |

---

## Reporting a Vulnerability

If you discover a security vulnerability within Foodstore, please **do not open a public issue**. Instead, follow these steps:

1. **Email Us**: Send a private report to security@foodstore.vn or contact the repository owner directly via GitHub.
2. **Include Details**:
   - Type of vulnerability (e.g. SQL Injection, XSS, CSRF, Token Leak, Auth Bypass)
   - Detailed step-by-step proof of concept (PoC) to reproduce the issue
   - Affected components (API controller, frontend route, Docker configuration)
3. **Response Time**: We will acknowledge receipt of your report within 24–48 hours and provide an estimated timeline for a patch.

---

## Best Practices & Security Guidelines

- **Environment Secrets**: Never commit `.env` or files containing real passwords, JWT secrets, or S3 credentials. All secrets belong in `.env` (which is gitignored).
- **Authentication**: JWT tokens are signed using HMAC-SHA256 (`JWT_SECRET` must be at least 256 bits).
- **Token Revocation**: Logged-out tokens are immediately added to the Redis 8.10 Blacklist with automatic expiration.
- **Session Security**: Admin webapp uses HttpOnly, SameSite=Lax session cookies via Better Auth BFF.
