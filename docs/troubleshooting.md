# Troubleshooting Guide

## 🚨 Common Issues & Solutions

### Development Environment

#### Database Connection Failed
```
Error: connection to server at "localhost", port 5432 failed
```

**Solutions:**
```bash
# Check PostgreSQL is running
brew services start postgresql  # macOS
sudo systemctl start postgresql # Linux

# Test connection string
psql "$POSTGRES_URL"

# Verify environment variable
echo $POSTGRES_URL
```

#### Migration Errors
```
Error: Cannot run migrations
```

**Solutions:**
```bash
# Reset migrations (development only)
rm -rf apps/web/drizzle/
npm run db:generate
npm run db:migrate

# Check database permissions
psql "$POSTGRES_URL" -c "SELECT current_user;"
```

#### OpenAI API Errors
```
Error: 401 Unauthorized
Error: 429 Too Many Requests
```

**Solutions:**
```bash
# Verify API key format
echo $OPENAI_API_KEY | grep "sk-proj"

# Check billing at platform.openai.com
# Monitor usage and quotas
# Set up usage alerts
```

### Build & Deploy Issues

#### TypeScript Errors
```
Type 'any' is not assignable to type 'string'
```

**Solutions:**
```typescript
// Use proper types instead of 'any'
interface CampaignData {
  title: string
  status: CampaignStatus
}

// Check for missing imports
import type { CampaignStatus } from '@/modules/campaigns'
```

#### Import Resolution Errors
```
Module not found: Can't resolve '@/components'
```

**Solutions:**
```bash
# Check tsconfig.json paths
# Verify file exists at expected location
# Use relative imports if needed
import { Button } from '../components/Button'
```

#### Vercel Deployment Failures
```
Build failed with exit code 1
```

**Solutions:**
1. Check build logs in Vercel dashboard
2. Verify all environment variables are set
3. Test build locally: `npm run build`
4. Check for TypeScript errors: `npm run check-types`

### Runtime Issues

#### Email Delivery Problems
```
Error: 403 Forbidden (Resend)
Error: Domain not verified
```

**Solutions:**
```bash
# Verify domain authentication
# Check sender email is authorized
# Review Resend dashboard for issues
# Test with verified domain first
```

#### Background Job Failures
```
Inngest function failed
```

**Solutions:**
```bash
# Check Inngest dev server is running
cd packages/inngest && npm run dev

# Verify environment variables
echo $INNGEST_EVENT_KEY
echo $INNGEST_SIGNING_KEY

# Review function logs in Inngest dashboard
```

#### Contact Enrichment Issues
```
Apollo API rate limit exceeded
Apollo API key invalid
```

**Solutions:**
```bash
# Check Apollo.io dashboard
# Verify API key permissions
# Monitor usage quotas
# Implement exponential backoff
```

### Performance Issues

#### Slow Database Queries
```sql
-- Check for missing indexes
EXPLAIN ANALYZE SELECT * FROM campaigns WHERE organisation_id = $1;

-- Add indexes for frequent queries
CREATE INDEX idx_campaigns_org_id ON campaigns(organisation_id);
```

#### Memory Issues
```
JavaScript heap out of memory
```

**Solutions:**
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run dev

# Check for memory leaks in components
# Review large data processing functions
```

### Authentication Issues

#### Session Errors
```
Unauthorized: Invalid session
Better Auth session expired
```

**Solutions:**
```bash
# Clear browser cookies
# Check BETTER_AUTH_SECRET is consistent
# Verify session configuration
# Test with incognito/private browser
```

#### Organization Access Denied
```
403 Forbidden: Not member of organization
```

**Solutions:**
```sql
-- Check user membership
SELECT * FROM members WHERE user_id = $1;

-- Verify organization exists
SELECT * FROM organisations WHERE slug = $1;
```

## 🔍 Debugging Tools

### Database Debugging
```bash
# Drizzle Studio - Visual database browser
npx drizzle-kit studio

# Direct database access
psql "$POSTGRES_URL"

# Query analysis
\d+ campaigns  # Describe table structure
```

### API Debugging
```typescript
// Add temporary logging
console.log('Request body:', body)
console.log('User context:', user)
console.log('Query result:', result)

// Use debugging in development
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', debugData)
}
```

### Frontend Debugging
```bash
# React DevTools
# Browser Network tab for API calls
# Console for JavaScript errors
# Lighthouse for performance analysis
```

## 🔧 System Health Checks

### Quick Health Check
```bash
# 1. Database connection
npm run db:migrate

# 2. Build success
npm run build

# 3. Type checking
npm run check-types

# 4. Linting
npm run lint

# 5. API test
curl http://localhost:3200/api/organisations/me
```

### Third-party Services Status
Check these service status pages:
- **OpenAI**: status.openai.com
- **Resend**: status.resend.com
- **Apollo**: apollo.io (support section)
- **Vercel**: vercel-status.com

### Environment Validation
```typescript
// Check all required env vars are present
import { backendConfig } from '@/server/backend-config'
console.log('Config loaded:', Object.keys(backendConfig))
```

## 🆘 Escalation Process

### Level 1: Self-Service
1. Check this troubleshooting guide
2. Review relevant documentation
3. Check service status pages
4. Test in clean environment

### Level 2: Team Support
1. Search existing issues/discussions
2. Ask in team channels with:
   - Clear problem description
   - Steps to reproduce
   - Environment details
   - Error messages/logs

### Level 3: External Support
1. **Vercel**: Support ticket for deployment issues
2. **Database Provider**: For connection/performance issues
3. **API Providers**: For service-specific problems

---

**Need More Help?** Check [API Documentation](./api.md) or [Database Guide](./database.md).