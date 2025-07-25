# Environment Setup Guide

This guide covers complete environment configuration for **Little Phil Ignite**.

## 🔧 Local Development Setup

### 1. Prerequisites Installation

```bash
# Check Node.js version (requires 18+)
node --version

# Check npm version (requires 10.9.2+)  
npm --version

# Install dependencies
npm install
```

### 2. Environment Configuration

Create your local environment file:

```bash
cp .env.example .env.local
```

### 3. Required Environment Variables

#### Core Application
```bash
# Application Environment
APP_ENV=local                    # Controls feature flags and logging
HOST_DOMAIN=http://localhost:3200   # Used for email links and callbacks
```

#### Database Configuration
```bash
# PostgreSQL Database
POSTGRES_URL=postgresql://username:password@host:port/database

# Example for local PostgreSQL:
POSTGRES_URL=postgresql://postgres:password@localhost:5432/ascenta_plus

# Example for Supabase:
POSTGRES_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres

# Example for Neon:
POSTGRES_URL=postgresql://[user]:[password]@[endpoint]/[dbname]?sslmode=require
```

#### Authentication
```bash
# Better Auth Configuration
BETTER_AUTH_SECRET=your-secret-key-min-32-chars    # Generate with: openssl rand -hex 32
```

#### AI & Content Generation
```bash
# OpenAI API (Required for campaign generation)
OPENAI_API_KEY=sk-proj-...                        # Get from https://platform.openai.com/api-keys

# Used for:
# - Campaign strategy generation
# - Email content creation
# - Content improvement suggestions
```

#### Email Service Providers
```bash
# Primary Email Provider - Resend (Recommended)
RESEND_API_KEY=re_...                             # Get from https://resend.com/api-keys

# Backup Email Provider - SendGrid
SENDGRID_API_KEY=SG....                           # Get from SendGrid dashboard

# Email providers are used for:
# - Campaign email delivery
# - System notifications
# - User communication
```

#### Contact Enrichment
```bash
# Apollo.io API (For contact data enrichment)
APOLLO_API_KEY=...                                # Get from Apollo.io dashboard

# Used for:
# - Contact data enrichment
# - Email validation
# - Company information lookup
```

#### Notifications
```bash
# Slack Integration (Optional but recommended)
SLACK_SUPPORT_WEBHOOK_URL=https://hooks.slack.com/services/...

# Used for:
# - Error notifications
# - System alerts
# - Support requests
```

#### Background Jobs (Production/Staging Only)
```bash
# Inngest Configuration (Leave empty for local development)
INNGEST_EVENT_KEY=...                            # Production environment only
INNGEST_SIGNING_KEY=...                          # Production environment only
```

## 🗄️ Database Setup

### Option 1: Local PostgreSQL

1. **Install PostgreSQL**:
   ```bash
   # macOS
   brew install postgresql
   
   # Ubuntu/Debian
   sudo apt-get install postgresql
   
   # Windows
   # Download from https://www.postgresql.org/download/
   ```

2. **Create Database**:
   ```bash
   psql postgres
   CREATE DATABASE ascenta_plus;
   CREATE USER ascenta_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE ascenta_plus TO ascenta_user;
   \q
   ```

3. **Update Environment**:
   ```bash
   POSTGRES_URL=postgresql://ascenta_user:your_password@localhost:5432/ascenta_plus
   ```

### Option 2: Supabase (Recommended)

1. **Create Project**: Visit [supabase.com](https://supabase.com)
2. **Get Connection String**: Project Settings → Database → Connection String
3. **Update Environment**:
   ```bash
   POSTGRES_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres
   ```

### Option 3: Neon

1. **Create Project**: Visit [neon.tech](https://neon.tech)
2. **Get Connection String**: Dashboard → Connection Details
3. **Update Environment**:
   ```bash
   POSTGRES_URL=postgresql://[user]:[password]@[endpoint]/[dbname]?sslmode=require
   ```

## 🔄 Database Migrations

After setting up your database:

```bash
# Generate migration files from schema
npm run db:generate

# Apply migrations to database
npm run db:migrate

# Open Drizzle Studio to view data (optional)
npx drizzle-kit studio
```

## 🎯 Service Account Setup

### OpenAI Setup
1. Visit [OpenAI Platform](https://platform.openai.com)
2. Create API key with appropriate limits
3. Add billing method for production usage
4. Monitor usage in OpenAI dashboard

### Resend Setup  
1. Sign up at [resend.com](https://resend.com)
2. Verify your sending domain
3. Create API key with send permissions
4. Configure domain authentication (SPF/DKIM)

### Apollo.io Setup
1. Create account at [apollo.io](https://apollo.io)
2. Generate API key from settings
3. Verify API limits and billing
4. Test with sample contact lookup

### Slack Setup (Optional)
1. Create Slack app or use existing workspace
2. Enable Incoming Webhooks
3. Create webhook URL for notifications
4. Test webhook with sample message

## 🧪 Verification Tests

### 1. Database Connection
```bash
# Test database connection
npm run db:migrate
```

### 2. API Key Validation
```bash
# Start development server
npm run dev

# Visit http://localhost:3200
# Try creating a test campaign to verify all services
```

### 3. Background Jobs (Local)
```bash
# Start Inngest dev server
cd packages/inngest
npm run dev

# Verify it's running at http://localhost:3202
```

## 🌍 Environment-Specific Configurations

### Local Development
- Use local PostgreSQL or free tier cloud database
- Inngest dev mode (no keys required)
- Reduced API rate limits acceptable
- Debug logging enabled

### Staging/Production
- Production database with backups
- Full Inngest configuration required
- Production API keys with proper limits
- Error tracking and monitoring

## 🚨 Security Best Practices

### Environment Variables
- Never commit `.env*` files to version control
- Use different keys for each environment
- Rotate API keys regularly
- Monitor API usage and set alerts

### Database Security
- Use connection pooling in production
- Enable SSL connections
- Regular security updates
- Monitor for suspicious activity

### API Key Management
- Store keys securely (use services like Vercel Environment Variables)
- Implement proper rate limiting
- Monitor API usage patterns
- Have backup providers configured

## 🔍 Troubleshooting

### Common Issues

**Database Connection Failed**
```
Error: connection to server at "localhost", port 5432 failed
```
- Verify PostgreSQL is running
- Check connection string format
- Ensure database exists
- Test network connectivity

**OpenAI API Errors**
```
Error: 401 Unauthorized
```
- Verify API key is correct
- Check billing status
- Ensure sufficient credits
- Test with API playground

**Email Delivery Issues**
```
Error: 403 Forbidden
```
- Verify domain authentication
- Check API key permissions
- Ensure sender email is verified
- Review service provider status

**Background Job Failures**
- Check Inngest dev server is running
- Verify event schemas match
- Review function signatures
- Check environment variables

### Getting Help

1. **Check logs**: Application logs show detailed error messages
2. **Service status**: Check third-party service status pages
3. **API documentation**: Review provider API docs for updates
4. **Community**: Check Next.js, Drizzle, and service-specific communities

---

## ✅ Quick Setup Checklist

- [ ] Node.js 18+ installed
- [ ] Repository cloned and dependencies installed
- [ ] `.env.local` created and configured
- [ ] Database connection established
- [ ] Migrations applied successfully
- [ ] OpenAI API key configured and tested
- [ ] Email provider (Resend) configured
- [ ] Development server starts without errors
- [ ] Can access application at http://localhost:3200
- [ ] Background jobs accessible at http://localhost:3202

**Next Steps**: Continue to [API Documentation](./api.md) to understand the available endpoints.