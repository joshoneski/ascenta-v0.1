# Security Considerations & Practices

## Table of Contents
- [Security Overview](#security-overview)
- [Authentication & Authorization](#authentication--authorization)
- [Data Protection](#data-protection)
- [Multi-tenant Security](#multi-tenant-security)
- [API Security](#api-security)
- [Database Security](#database-security)
- [Email Security](#email-security)
- [Third-party Integration Security](#third-party-integration-security)
- [Infrastructure Security](#infrastructure-security)
- [Security Monitoring](#security-monitoring)
- [Incident Response](#incident-response)
- [Compliance Requirements](#compliance-requirements)

## Security Overview

Little Phil Ignite handles sensitive donor information and financial data for charitable organizations. This document outlines critical security practices to protect user data and maintain platform integrity.

### Security Principles
- **Zero Trust Architecture**: Verify everything, trust nothing
- **Defense in Depth**: Multiple layers of security controls
- **Principle of Least Privilege**: Minimum necessary access rights
- **Data Minimization**: Collect and retain only necessary data
- **Security by Design**: Built-in security from the ground up

### Threat Model
Primary threats to consider:
- **Data Breaches**: Unauthorized access to donor information
- **Account Takeover**: Compromised user accounts
- **Injection Attacks**: SQL injection, XSS, CSRF
- **API Abuse**: Rate limiting bypass, data scraping
- **Insider Threats**: Malicious or negligent internal access

## Authentication & Authorization

### Better Auth Implementation
The platform uses Better Auth for session-based authentication:

```typescript
// lib/auth.ts
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  rateLimit: {
    enabled: true,
    window: 60, // seconds
    max: 10, // requests per window
  },
  trustedOrigins: [process.env.HOST_DOMAIN!],
})
```

### Password Security
Implement strong password requirements:

```typescript
// lib/password-validation.ts
import { z } from 'zod'

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')
  .regex(/^(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
  .regex(/^(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
  .regex(/^(?=.*\d)/, 'Password must contain at least one number')
  .regex(/^(?=.*[@$!%*?&])/, 'Password must contain at least one special character')

export function validatePasswordStrength(password: string): {
  isValid: boolean
  score: number
  feedback: string[]
} {
  const feedback = []
  let score = 0

  // Length check
  if (password.length >= 12) score += 2
  else if (password.length >= 8) score += 1
  else feedback.push('Use at least 8 characters')

  // Character variety
  if (/[a-z]/.test(password)) score += 1
  else feedback.push('Include lowercase letters')
  
  if (/[A-Z]/.test(password)) score += 1
  else feedback.push('Include uppercase letters')
  
  if (/\d/.test(password)) score += 1
  else feedback.push('Include numbers')
  
  if (/[@$!%*?&]/.test(password)) score += 1
  else feedback.push('Include special characters')

  // Common password check
  if (!isCommonPassword(password)) score += 1
  else feedback.push('Avoid common passwords')

  return {
    isValid: score >= 4,
    score,
    feedback
  }
}
```

### Session Management
Secure session handling:

```typescript
// middleware/auth.ts
export async function requireAuth(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }

  // Check session validity
  if (session.expiresAt < new Date()) {
    await auth.api.signOut({
      headers: request.headers,
    })
    return NextResponse.json(
      { error: 'Session expired' },
      { status: 401 }
    )
  }

  return session
}
```

## Data Protection

### Data Encryption
Implement encryption for sensitive data:

```typescript
// lib/encryption.ts
import crypto from 'crypto'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY! // 32-byte key
const ALGORITHM = 'aes-256-gcm'

export function encrypt(text: string): { encrypted: string; iv: string; tag: string } {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY)
  cipher.setAAD(Buffer.from('ascenta-plus'))
  
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  const tag = cipher.getAuthTag()

  return {
    encrypted,
    iv: iv.toString('hex'),
    tag: tag.toString('hex')
  }
}

export function decrypt(encrypted: string, iv: string, tag: string): string {
  const decipher = crypto.createDecipher(ALGORITHM, ENCRYPTION_KEY)
  decipher.setAAD(Buffer.from('ascenta-plus'))
  decipher.setAuthTag(Buffer.from(tag, 'hex'))
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return decrypted
}
```

### Sensitive Data Handling
Protect sensitive fields in the database:

```typescript
// db/schema.ts
import { encrypt, decrypt } from '@/lib/encryption'

// Encrypt sensitive fields before storage
export async function createContact(data: ContactData) {
  const encryptedData = {
    ...data,
    email: data.email, // Keep searchable
    phone: data.phone ? encrypt(data.phone) : null,
    notes: data.notes ? encrypt(data.notes) : null,
  }
  
  return db.insert(contacts).values(encryptedData)
}

// Decrypt sensitive fields after retrieval
export async function getContact(id: string) {
  const contact = await db.select().from(contacts).where(eq(contacts.id, id))
  
  if (contact.phone) contact.phone = decrypt(contact.phone.encrypted, contact.phone.iv, contact.phone.tag)
  if (contact.notes) contact.notes = decrypt(contact.notes.encrypted, contact.notes.iv, contact.notes.tag)
  
  return contact
}
```

### Data Masking for Logs
Prevent sensitive data from appearing in logs:

```typescript
// lib/logger.ts
const SENSITIVE_FIELDS = ['password', 'email', 'phone', 'ssn', 'creditCard']

function maskSensitiveData(obj: any): any {
  if (typeof obj !== 'object' || obj === null) return obj
  
  const masked = { ...obj }
  
  for (const key in masked) {
    if (SENSITIVE_FIELDS.some(field => key.toLowerCase().includes(field))) {
      masked[key] = '***MASKED***'
    } else if (typeof masked[key] === 'object') {
      masked[key] = maskSensitiveData(masked[key])
    }
  }
  
  return masked
}

export const secureLogger = {
  info: (message: string, context?: any) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      context: context ? maskSensitiveData(context) : undefined,
      timestamp: new Date().toISOString()
    }))
  }
}
```

## Multi-tenant Security

### Organization Data Isolation
Ensure strict data isolation between organizations:

```typescript
// lib/multi-tenant.ts
export async function withOrganizationAccess<T>(
  userId: string,
  organisationId: string,
  operation: () => Promise<T>
): Promise<T> {
  // Verify user belongs to organization
  const membership = await db
    .select()
    .from(organisationMembers)
    .where(
      and(
        eq(organisationMembers.userId, userId),
        eq(organisationMembers.organisationId, organisationId)
      )
    )
    .limit(1)

  if (!membership.length) {
    throw new ApiError('Access denied: Organization not found', 403, 'ORG_ACCESS_DENIED')
  }

  // Execute operation with organization context
  return operation()
}
```

### Row-Level Security Implementation
Add organization context to all queries:

```typescript
// lib/secure-queries.ts
export function createSecureQuery(userId: string) {
  return {
    // All queries automatically include organization filtering
    async getCampaigns(organisationId: string) {
      await withOrganizationAccess(userId, organisationId, async () => {
        return db
          .select()
          .from(campaigns)
          .where(eq(campaigns.organisationId, organisationId))
      })
    },

    async getContacts(organisationId: string) {
      await withOrganizationAccess(userId, organisationId, async () => {
        return db
          .select()
          .from(contacts)
          .where(eq(contacts.organisationId, organisationId))
      })
    }
  }
}
```

## API Security

### Input Validation & Sanitization
Validate all API inputs with Zod schemas:

```typescript
// lib/validation.ts
import { z } from 'zod'
import validator from 'validator'

export const createCampaignSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name too long')
    .transform(str => validator.escape(str)), // Sanitize HTML
  
  description: z.string()
    .max(1000, 'Description too long')
    .transform(str => validator.escape(str))
    .optional(),
    
  organisationId: z.string().uuid('Invalid organization ID'),
})

// API route implementation
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = createCampaignSchema.parse(body)
    
    // Additional security checks
    await verifyOrganizationAccess(userId, validatedData.organisationId)
    
    // Process request...
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    throw error
  }
}
```

### Rate Limiting
Implement comprehensive rate limiting:

```typescript
// middleware/rate-limit.ts
import { rateLimit } from '@/lib/rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // requests per window
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
})

// API-specific rate limits
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts per 15 minutes
  skipSuccessfulRequests: true,
})

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Apply stricter limits to authentication endpoints
  if (pathname.startsWith('/api/auth')) {
    return authLimiter(request)
  }
  
  // Apply general rate limiting
  return limiter(request)
}
```

### CORS Configuration
Configure CORS for secure cross-origin requests:

```typescript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.HOST_DOMAIN || 'https://app.littlephilignite.com'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization'
          },
          {
            key: 'Access-Control-Max-Age',
            value: '86400'
          }
        ]
      }
    ]
  }
}
```

## Database Security

### Connection Security
Secure database connections:

```typescript
// lib/db.ts
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const connectionString = process.env.POSTGRES_URL!

// Ensure SSL connection in production
const sql = postgres(connectionString, {
  ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
  max: 10, // Connection pool size
  idle_timeout: 20,
  connect_timeout: 10,
})

export const db = drizzle(sql)
```

### Query Security
Prevent SQL injection:

```typescript
// ✅ Safe: Using parameterized queries
const campaigns = await db
  .select()
  .from(campaignsTable)
  .where(eq(campaignsTable.organisationId, organisationId))

// ❌ Dangerous: Never use raw SQL with user input
// const campaigns = await db.execute(
//   sql`SELECT * FROM campaigns WHERE organisation_id = ${organisationId}`
// )
```

### Database Access Controls
Implement database-level security:

```sql
-- Create read-only user for analytics
CREATE USER analytics_user WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE ascenta_plus TO analytics_user;
GRANT USAGE ON SCHEMA public TO analytics_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO analytics_user;

-- Revoke unnecessary permissions
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON DATABASE ascenta_plus FROM PUBLIC;
```

## Email Security

### Email Authentication
Implement SPF, DKIM, and DMARC:

```dns
; SPF Record
@ IN TXT "v=spf1 include:_spf.resend.com include:sendgrid.net ~all"

; DKIM Record (provided by email service)
resend._domainkey IN TXT "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3..."

; DMARC Record
_dmarc IN TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@littlephilignite.com"
```

### Email Content Security
Sanitize email content:

```typescript
// lib/email-security.ts
import { sanitizeHtml } from 'sanitize-html'

export function sanitizeEmailContent(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li'],
    allowedAttributes: {
      'a': ['href', 'title']
    },
    allowedSchemes: ['http', 'https', 'mailto']
  })
}

// Validate email addresses
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && validator.isEmail(email)
}
```

## Third-party Integration Security

### API Key Management
Secure third-party API keys:

```typescript
// lib/api-keys.ts
export class ApiKeyManager {
  private static keys = new Map<string, string>()
  
  static getKey(service: string): string {
    if (!this.keys.has(service)) {
      const key = process.env[`${service.toUpperCase()}_API_KEY`]
      if (!key) throw new Error(`Missing API key for ${service}`)
      this.keys.set(service, key)
    }
    return this.keys.get(service)!
  }
  
  static rotateKey(service: string, newKey: string): void {
    this.keys.set(service, newKey)
    // Update environment variable securely
  }
}
```

### Webhook Security
Secure webhook endpoints:

```typescript
// api/webhooks/resend.ts
import crypto from 'crypto'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('resend-signature')
  
  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RESEND_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex')
  
  if (signature !== expectedSignature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }
  
  // Process webhook...
}
```

## Infrastructure Security

### Environment Variables
Secure environment variable management:

```bash
# Development
cp .env.example .env.local

# Production (use secure secret management)
# - Vercel Environment Variables
# - AWS Secrets Manager
# - HashiCorp Vault
```

### Security Headers
Implement security headers:

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  )
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
  )
  
  return response
}
```

## Security Monitoring

### Audit Logging
Log security-relevant events:

```typescript
// lib/audit-log.ts
export async function logSecurityEvent(
  userId: string,
  event: string,
  details: Record<string, any>,
  severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
) {
  await db.insert(auditLogs).values({
    userId,
    event,
    details: JSON.stringify(details),
    severity,
    ipAddress: details.ip,
    userAgent: details.userAgent,
    timestamp: new Date(),
  })

  // Alert on critical events
  if (severity === 'critical') {
    await sendSecurityAlert(event, details)
  }
}
```

### Anomaly Detection
Monitor for suspicious patterns:

```typescript
// lib/anomaly-detection.ts
export async function detectAnomalies(userId: string) {
  const recentActivity = await db
    .select()
    .from(auditLogs)
    .where(
      and(
        eq(auditLogs.userId, userId),
        gte(auditLogs.timestamp, new Date(Date.now() - 24 * 60 * 60 * 1000))
      )
    )

  // Check for unusual patterns
  const loginAttempts = recentActivity.filter(log => log.event === 'login_attempt')
  const failedLogins = loginAttempts.filter(log => !log.details.success)
  
  if (failedLogins.length > 5) {
    await logSecurityEvent(userId, 'suspicious_login_pattern', {
      failedAttempts: failedLogins.length,
      timeWindow: '24h'
    }, 'high')
  }
}
```

## Incident Response

### Security Incident Procedures
1. **Detection**: Monitor logs and alerts
2. **Assessment**: Determine scope and impact
3. **Containment**: Limit damage and prevent spread
4. **Eradication**: Remove threat and vulnerabilities
5. **Recovery**: Restore normal operations
6. **Lessons Learned**: Document and improve

### Incident Response Contacts
```typescript
// lib/incident-response.ts
export const incidentContacts = {
  security: 'security@littlephilignite.com',
  engineering: 'engineering@littlephilignite.com',
  management: 'management@littlephilignite.com',
  legal: 'legal@littlephilignite.com'
}

export async function triggerIncidentResponse(
  severity: 'low' | 'medium' | 'high' | 'critical',
  description: string,
  details: Record<string, any>
) {
  // Log incident
  await logSecurityEvent('system', 'security_incident', {
    severity,
    description,
    ...details
  }, severity as any)
  
  // Notify appropriate teams
  if (severity === 'critical' || severity === 'high') {
    await sendAlert(incidentContacts.security, `Security Incident: ${description}`, details)
    await sendAlert(incidentContacts.engineering, `Security Incident: ${description}`, details)
  }
}
```

## Compliance Requirements

### Data Protection Regulations
- **GDPR**: EU data protection compliance
- **CCPA**: California privacy requirements
- **PIPEDA**: Canadian privacy laws
- **SOX**: Financial reporting controls (if applicable)

### Compliance Implementation
```typescript
// lib/compliance.ts
export async function handleDataDeletionRequest(userId: string) {
  // GDPR Article 17 - Right to erasure
  await db.transaction(async (tx) => {
    // Delete user data across all tables
    await tx.delete(users).where(eq(users.id, userId))
    await tx.delete(contacts).where(eq(contacts.userId, userId))
    await tx.delete(campaigns).where(eq(campaigns.userId, userId))
    
    // Log deletion for audit trail
    await tx.insert(auditLogs).values({
      userId: 'system',
      event: 'data_deletion',
      details: JSON.stringify({ deletedUserId: userId }),
      timestamp: new Date()
    })
  })
}

export async function exportUserData(userId: string) {
  // GDPR Article 20 - Right to data portability
  const userData = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)
  
  const userContacts = await db
    .select()
    .from(contacts)
    .where(eq(contacts.userId, userId))
    
  return {
    user: userData[0],
    contacts: userContacts,
    exportedAt: new Date().toISOString()
  }
}
```

This security documentation provides comprehensive guidance for maintaining the security posture of the Little Phil Ignite platform while ensuring compliance with relevant regulations.