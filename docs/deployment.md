# Deployment Guide

## 🚀 Vercel Deployment

**Little Phil Ignite** is optimized for Vercel deployment with edge functions and PostgreSQL.

### Prerequisites
- Vercel account connected to your Git repository
- PostgreSQL database (Supabase/Neon recommended)
- All required API keys (see Environment Setup)

## 🔧 Environment Configuration

### Production Environment Variables
```bash
# Application
APP_ENV=production
HOST_DOMAIN=https://your-domain.com

# Database
POSTGRES_URL=postgresql://user:pass@host/db

# Authentication
BETTER_AUTH_SECRET=your-production-secret

# AI & Services
OPENAI_API_KEY=sk-proj-...
RESEND_API_KEY=re_...
SENDGRID_API_KEY=SG....
APOLLO_API_KEY=...

# Background Jobs
INNGEST_EVENT_KEY=...
INNGEST_SIGNING_KEY=...

# Notifications
SLACK_SUPPORT_WEBHOOK_URL=https://hooks.slack...
```

### Environment Setup in Vercel
1. **Project Settings** → **Environment Variables**
2. Add all production variables
3. Set different values for Preview/Development if needed

## 📦 Build Configuration

### Build Commands
```bash
# Production build
npm run build

# Type checking
npm run check-types

# Linting
npm run lint
```

## 🗄️ Database Deployment

### Migration Strategy
```bash
# 1. Apply migrations to production DB
POSTGRES_URL=production_url npm run db:migrate

# 2. Verify schema
npx drizzle-kit studio --config=./drizzle.config.ts
```

### Backup Strategy
- **Automated**: Use database provider's backup features
- **Manual**: Regular exports before major deployments
- **Point-in-time**: Enable continuous backups

## 🔄 CI/CD Pipeline

### Automatic Deployments
- **Main branch** → Production deployment
- **Feature branches** → Preview deployments
- **Pull requests** → Deployment previews

### Pre-deployment Checks
1. TypeScript compilation
2. ESLint checks (max 0 warnings)
3. Build success
4. Environment variable validation

## 🚨 Troubleshooting Deployments

### Build Failures
```bash
# Check build logs in Vercel dashboard
# Common issues:
# - Missing environment variables
# - TypeScript errors
# - Import path issues
```

### Runtime Errors
```bash
# Check function logs in Vercel
# Common issues:
# - Database connection timeouts
# - API key errors
# - Memory limits exceeded
```

### Database Issues
```bash
# Test connection
POSTGRES_URL=your_url npx drizzle-kit studio

# Check migrations
npm run db:generate
npm run db:migrate
```

## 🔄 Rollback Procedures

### Quick Rollback
1. **Vercel Dashboard** → **Deployments**
2. Find previous working deployment
3. **Promote to Production**

### Database Rollback
1. Restore from backup
2. Run previous migration if needed
3. Update application to match schema

---

**Next**: See [Development Workflow](./development.md) for team processes.