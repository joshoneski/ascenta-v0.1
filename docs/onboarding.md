# Developer Onboarding Guide

## 🎯 Welcome to Little Phil Ignite

This guide will get you productive on the AI-powered fundraising platform in under 2 hours.

## ✅ Setup Checklist

### 1. Prerequisites (15 minutes)
- [ ] Node.js 18+ installed
- [ ] Git access to repository
- [ ] Code editor (VS Code recommended)
- [ ] PostgreSQL access (local or cloud)

### 2. Project Setup (20 minutes)
```bash
# Clone repository
git clone <repository-url>
cd ascenta-plus-development

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
```

### 3. Environment Configuration (30 minutes)
Edit `.env.local` with your credentials:

**Required for Development:**
```bash
APP_ENV=local
POSTGRES_URL=postgresql://user:pass@localhost/db
BETTER_AUTH_SECRET=your-32-char-secret
OPENAI_API_KEY=sk-proj-...
RESEND_API_KEY=re_...
```

**Get API Keys:**
- **OpenAI**: [platform.openai.com](https://platform.openai.com/api-keys)
- **Resend**: [resend.com/api-keys](https://resend.com/api-keys)
- **Apollo** (optional): [apollo.io](https://apollo.io)

### 4. Database Setup (15 minutes)
```bash
# Apply migrations
npm run db:migrate

# Verify setup
npx drizzle-kit studio
```

### 5. Start Development (5 minutes)
```bash
# Start all services
npm run dev

# Open application
open http://localhost:3200
```

## 🏗️ Architecture Overview

### Project Structure
```
ascenta-plus-development/
├── apps/web/           # Main Next.js application
├── packages/
│   ├── emails/         # Email templates
│   ├── types/          # Shared TypeScript types
│   └── ui/            # Shared UI components
└── docs/              # Documentation
```

### Tech Stack Essentials
- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: API Routes, Drizzle ORM
- **Database**: PostgreSQL
- **AI**: OpenAI GPT models
- **Email**: Resend + SendGrid

## 🎯 Core Business Logic

### Campaign Flow
1. **Create Campaign**: User provides brief and target segment
2. **AI Strategy**: OpenAI generates fundraising strategy
3. **AI Content**: OpenAI creates email sequence
4. **Launch**: Background jobs schedule email delivery
5. **Analytics**: Track clicks and engagement

### Key Modules
- **Campaigns**: `src/modules/campaigns/`
- **Contacts**: `src/server/contacts/`
- **Segments**: `src/server/segments/`
- **Email Delivery**: Inngest background jobs

## 📚 Essential Reading

### First Day
1. [Project README](../README.md) - Overall architecture
2. [Environment Setup](./environment-setup.md) - Detailed configuration
3. [API Documentation](./api.md) - REST endpoints

### First Week
4. [Database Schema](./database.md) - Data relationships
5. [Development Workflow](./development.md) - Team processes
6. Code exploration in `src/modules/campaigns/`

## 🎯 First Tasks

### Beginner (Day 1)
1. Set up development environment
2. Create a test campaign through the UI
3. Explore database with Drizzle Studio
4. Read campaign creation code in `src/modules/campaigns/`

### Intermediate (Week 1)
1. Add a new API endpoint
2. Modify campaign email generation logic
3. Create a new UI component
4. Add database migration

### Advanced (Week 2+)
1. Implement new AI prompt optimization
2. Add new third-party integration
3. Optimize background job performance
4. Add comprehensive error handling

## 🆘 Getting Help

### Common First-Day Issues

**Database Connection Fails**
```bash
# Check PostgreSQL is running
pg_ctl status

# Test connection string
psql "$POSTGRES_URL"
```

**OpenAI API Errors**
```bash
# Verify API key format
echo $OPENAI_API_KEY | grep "sk-proj"

# Check billing status at platform.openai.com
```

**Build Errors**
```bash
# Clear all caches
rm -rf node_modules .next
npm install
```

## 🎉 Success Metrics

**Day 1**: Environment running, first campaign created
**Week 1**: First feature contribution merged
**Month 1**: Comfortable with all core modules
**Month 3**: Leading feature development independently

---

**Next Steps**: Start with [Development Workflow](./development.md) once environment is ready.