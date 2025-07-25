# Monitoring & Logging

## Table of Contents
- [Overview](#overview)
- [Application Logging](#application-logging)
- [Error Tracking](#error-tracking)
- [Performance Monitoring](#performance-monitoring)
- [Database Monitoring](#database-monitoring)
- [Email Delivery Monitoring](#email-delivery-monitoring)
- [Background Job Monitoring](#background-job-monitoring)
- [Security Monitoring](#security-monitoring)
- [Alerting Configuration](#alerting-configuration)
- [Log Management](#log-management)

## Overview

Little Phil Ignite requires comprehensive monitoring and logging to ensure platform reliability, security, and performance. This document outlines the monitoring strategy for a production-ready deployment.

### Key Monitoring Areas
- **Application Performance**: Response times, throughput, errors
- **Database Health**: Query performance, connection pool status
- **Email Delivery**: Success rates, bounce handling
- **Background Jobs**: Queue health, processing times
- **Security Events**: Authentication failures, suspicious activity
- **Infrastructure**: Server health, resource utilization

## Application Logging

### Logging Framework
Use Next.js built-in logging with structured JSON formatting for production:

```typescript
// lib/logger.ts
interface LogContext {
  userId?: string
  organisationId?: string
  requestId?: string
  action?: string
}

export const logger = {
  info: (message: string, context?: LogContext) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...context
    }))
  },
  
  error: (message: string, error?: Error, context?: LogContext) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: error?.message,
      stack: error?.stack,
      timestamp: new Date().toISOString(),
      ...context
    }))
  },
  
  warn: (message: string, context?: LogContext) => {
    console.warn(JSON.stringify({
      level: 'warn',
      message,
      timestamp: new Date().toISOString(),
      ...context
    }))
  }
}
```

### Request Logging Middleware
```typescript
// middleware.ts
import { NextRequest } from 'next/server'
import { logger } from '@/lib/logger'

export function middleware(request: NextRequest) {
  const requestId = crypto.randomUUID()
  const start = Date.now()
  
  // Log incoming request
  logger.info('Request received', {
    requestId,
    method: request.method,
    url: request.url,
    userAgent: request.headers.get('user-agent')
  })
  
  // Add request ID to headers for tracing
  request.headers.set('x-request-id', requestId)
  
  return NextResponse.next()
}
```

### Critical Log Events
Log these events for monitoring and debugging:

1. **Authentication Events**
   - Login attempts (success/failure)
   - Session creation/destruction
   - Password reset requests

2. **Business Logic Events**
   - Campaign creation/modification
   - Email sequence triggers
   - Contact imports/exports
   - Payment processing

3. **System Events**
   - Database connection issues
   - Third-party API failures
   - Background job failures
   - Rate limit hits

## Error Tracking

### Error Boundaries
Implement React error boundaries to catch and log frontend errors:

```typescript
// components/ErrorBoundary.tsx
import { Component, ReactNode } from 'react'
import { logger } from '@/lib/logger'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }
  
  static getDerivedStateFromError(): State {
    return { hasError: true }
  }
  
  componentDidCatch(error: Error, errorInfo: any) {
    logger.error('React error boundary caught error', error, {
      errorInfo: errorInfo.componentStack
    })
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || <h2>Something went wrong.</h2>
    }
    
    return this.props.children
  }
}
```

### API Error Handling
Standardize API error responses:

```typescript
// lib/api-error.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string,
    public context?: Record<string, any>
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// API route error handler
export function handleApiError(error: unknown, context?: Record<string, any>) {
  if (error instanceof ApiError) {
    logger.error('API Error', error, { ...context, code: error.code })
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    )
  }
  
  logger.error('Unexpected API Error', error as Error, context)
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  )
}
```

## Performance Monitoring

### Response Time Tracking
Monitor API response times:

```typescript
// lib/performance.ts
export function withPerformanceTracking(handler: Function) {
  return async (...args: any[]) => {
    const start = performance.now()
    const result = await handler(...args)
    const duration = performance.now() - start
    
    logger.info('Performance metric', {
      handler: handler.name,
      duration: Math.round(duration),
      slow: duration > 1000
    })
    
    return result
  }
}
```

### Database Query Monitoring
Track slow database queries:

```typescript
// lib/db-monitor.ts
import { db } from '@/db'

export function withQueryTracking<T>(
  queryFn: () => Promise<T>,
  queryName: string
) {
  return async (): Promise<T> => {
    const start = Date.now()
    
    try {
      const result = await queryFn()
      const duration = Date.now() - start
      
      if (duration > 500) {
        logger.warn('Slow database query', {
          queryName,
          duration,
          slow: true
        })
      }
      
      return result
    } catch (error) {
      logger.error('Database query failed', error as Error, {
        queryName
      })
      throw error
    }
  }
}
```

## Database Monitoring

### Connection Pool Monitoring
Monitor PostgreSQL connection health:

```typescript
// lib/db-health.ts
export async function checkDatabaseHealth() {
  try {
    const result = await db.execute(sql`SELECT 1 as health`)
    const connectionCount = await db.execute(
      sql`SELECT count(*) as active_connections 
          FROM pg_stat_activity 
          WHERE state = 'active'`
    )
    
    return {
      healthy: true,
      activeConnections: connectionCount.rows[0].active_connections,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    logger.error('Database health check failed', error as Error)
    return {
      healthy: false,
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }
  }
}
```

### Query Performance Metrics
Track key database metrics:

- **Slow Query Threshold**: Log queries > 500ms
- **Connection Pool Usage**: Monitor active/idle connections
- **Lock Contention**: Track long-running locks
- **Index Usage**: Monitor query plans for missing indexes

## Email Delivery Monitoring

### Email Provider Health
Monitor Resend and SendGrid status:

```typescript
// lib/email-monitoring.ts
export async function checkEmailProviderHealth() {
  const providers = ['resend', 'sendgrid']
  const health = {}
  
  for (const provider of providers) {
    try {
      // Test API connectivity
      const response = await testEmailProvider(provider)
      health[provider] = {
        healthy: true,
        responseTime: response.duration,
        lastCheck: new Date().toISOString()
      }
    } catch (error) {
      health[provider] = {
        healthy: false,
        error: (error as Error).message,
        lastCheck: new Date().toISOString()
      }
      
      logger.error(`Email provider ${provider} health check failed`, error as Error)
    }
  }
  
  return health
}
```

### Delivery Rate Tracking
Monitor email delivery metrics:

- **Delivery Rate**: Successful deliveries / total sent
- **Bounce Rate**: Hard bounces / total sent
- **Complaint Rate**: Spam complaints / total sent
- **Open Rate**: Opens / delivered emails
- **Click Rate**: Clicks / delivered emails

## Background Job Monitoring

### Inngest Job Health
Monitor background job processing:

```typescript
// lib/job-monitoring.ts
export const jobMetrics = {
  async trackJobExecution(jobName: string, fn: Function) {
    const start = Date.now()
    
    try {
      const result = await fn()
      const duration = Date.now() - start
      
      logger.info('Job completed', {
        jobName,
        duration,
        status: 'success'
      })
      
      return result
    } catch (error) {
      const duration = Date.now() - start
      
      logger.error('Job failed', error as Error, {
        jobName,
        duration,
        status: 'failed'
      })
      
      throw error
    }
  }
}
```

### Job Queue Metrics
Track queue health:

- **Queue Depth**: Number of pending jobs
- **Processing Rate**: Jobs processed per minute
- **Failure Rate**: Failed jobs / total jobs
- **Retry Count**: Jobs requiring retries
- **Dead Letter Queue**: Failed jobs requiring manual intervention

## Security Monitoring

### Authentication Monitoring
Track security events:

```typescript
// lib/security-monitoring.ts
export const securityLogger = {
  loginAttempt: (email: string, success: boolean, ip: string) => {
    logger.info('Login attempt', {
      email,
      success,
      ip,
      event: 'auth.login'
    })
  },
  
  suspiciousActivity: (userId: string, activity: string, context: any) => {
    logger.warn('Suspicious activity detected', {
      userId,
      activity,
      context,
      event: 'security.suspicious'
    })
  },
  
  dataAccess: (userId: string, resource: string, action: string) => {
    logger.info('Data access', {
      userId,
      resource,
      action,
      event: 'security.data_access'
    })
  }
}
```

### Rate Limiting Monitoring
Track rate limit violations:

```typescript
// middleware/rate-limit.ts
export function trackRateLimitViolation(
  ip: string,
  endpoint: string,
  limit: number
) {
  logger.warn('Rate limit exceeded', {
    ip,
    endpoint,
    limit,
    event: 'security.rate_limit'
  })
}
```

## Alerting Configuration

### Critical Alerts (Immediate Response)
- Database connection failures
- Authentication system down
- Email delivery service failures
- High error rates (>5% of requests)
- Security breaches or suspicious activity

### Warning Alerts (Within 1 Hour)
- Slow database queries (>2s consistently)
- High memory/CPU usage (>80%)
- Email bounce rates above threshold
- Background job failures
- API response times degrading

### Info Alerts (Daily Summary)
- Daily active users
- Email delivery statistics
- Performance summaries
- System health reports

### Alert Channels
Configure alerts through:

```typescript
// lib/alerting.ts
export const alerting = {
  critical: (message: string, context?: any) => {
    // Send to Slack, email, and SMS
    logger.error('CRITICAL ALERT', new Error(message), context)
    // Integrate with alerting service
  },
  
  warning: (message: string, context?: any) => {
    // Send to Slack and email
    logger.warn('WARNING ALERT', { message, ...context })
  },
  
  info: (message: string, context?: any) => {
    // Send daily summary
    logger.info('INFO ALERT', { message, ...context })
  }
}
```

## Log Management

### Log Retention
- **Development**: 7 days
- **Staging**: 30 days
- **Production**: 90 days for general logs, 1 year for security logs

### Log Storage
Configure log aggregation service (recommended):
- **ELK Stack** (Elasticsearch, Logstash, Kibana)
- **Datadog** for comprehensive monitoring
- **LogRocket** for frontend error tracking
- **Sentry** for error aggregation

### Log Analysis
Set up log analysis for:
- Error pattern detection
- Performance trend analysis
- Security incident investigation
- Business intelligence metrics

### Structured Logging Format
Use consistent JSON structure:

```json
{
  "timestamp": "2024-01-01T12:00:00.000Z",
  "level": "info",
  "message": "User login successful",
  "requestId": "req_123",
  "userId": "user_456",
  "organisationId": "org_789",
  "ip": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "context": {
    "action": "auth.login",
    "duration": 150
  }
}
```

This monitoring and logging strategy ensures comprehensive visibility into the Little Phil Ignite platform's health, performance, and security posture.