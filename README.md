# Little Phil Ignite

> AI-powered fundraising & marketing suite for charities

**Little Phil Ignite** is an enterprise-grade platform that empowers charities to slash fundraising costs, enrich donor data, and grow impact through AI-automated outreach campaigns.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 10.9.2+
- PostgreSQL database (Supabase/Neon recommended)

### Environment Setup
```bash
# Clone and install dependencies
git clone <repository-url>
cd ascenta-plus-development
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your configuration (see Environment Variables section)

# Setup database
npm run db:generate
npm run db:migrate

# Start development servers
npm run dev
```

The application will be available at:
- **Web App**: http://localhost:3200
- **Inngest Dev Server**: http://localhost:3202

## 🏗️ Architecture Overview

### Monorepo Structure
```
ascenta-plus-development/
├── apps/
│   └── web/                    # Main Next.js application
├── packages/
│   ├── emails/                 # Email templates
│   ├── inngest/               # Background job definitions
│   ├── types/                 # Shared TypeScript types
│   └── ui/                    # Shared UI components
└── docs/                      # Documentation (you are here)
```

### Core Business Domains
- **Campaigns**: AI-generated email sequences for fundraising
- **Contacts**: Donor management with enrichment capabilities
- **Segments**: Dynamic contact grouping and targeting  
- **Organizations**: Multi-tenant architecture
- **Analytics**: Click tracking and performance metrics

### Technology Stack

#### Frontend
- **Framework**: Next.js 15 with App Router
- **UI**: React 19, TypeScript, Tailwind CSS
- **Components**: Radix UI, Lucide Icons
- **State**: TanStack Query, React Hook Form

#### Backend
- **API**: Next.js API Routes
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth
- **Background Jobs**: Inngest
- **Email**: Resend + SendGrid
- **AI**: OpenAI GPT models

#### Infrastructure
- **Deployment**: Vercel
- **Database**: Supabase/Neon PostgreSQL
- **Monitoring**: Built-in Vercel analytics
- **Package Management**: npm workspaces + Turbo

## 🏛️ Clean Architecture

The application follows **Clean Architecture** principles with clear separation of concerns:

```
src/
├── app/                       # Next.js App Router (Presentation)
├── client/                    # Client-side components & hooks
├── server/                    # Server-side utilities & controllers  
├── modules/                   # Business logic modules
│   ├── campaigns/
│   │   ├── domain/           # Business entities & rules
│   │   ├── application/      # Use cases & controllers
│   │   └── infrastructure/   # Data access & external services
│   ├── contacts/
│   └── segments/
├── db/                       # Database schema & migrations
└── shared/                   # Shared utilities & types
```

### Key Design Patterns
- **Domain-Driven Design**: Bounded contexts for each business domain
- **CQRS-like**: Separate read/write repositories
- **Dependency Injection**: Clean separation of concerns
- **Entity-based**: Rich domain models with business logic

## 🔐 Environment Variables

Create `.env.local` with these required variables:

```bash
# Application Environment
APP_ENV=local                                    # local | development | production

# Database
POSTGRES_URL=postgresql://user:pass@host/db      # PostgreSQL connection string

# Authentication
BETTER_AUTH_SECRET=your-auth-secret              # Random string for session encryption
HOST_DOMAIN=http://localhost:3200               # Your application domain

# AI & Content Generation
OPENAI_API_KEY=sk-...                           # OpenAI API key for content generation

# Email Delivery
RESEND_API_KEY=re_...                           # Resend API key (primary email provider)
SENDGRID_API_KEY=SG....                         # SendGrid API key (backup email provider)

# Contact Enrichment
APOLLO_API_KEY=...                              # Apollo.io API key for contact enrichment

# Notifications
SLACK_SUPPORT_WEBHOOK_URL=https://hooks.slack... # Slack webhook for support notifications

# Background Jobs (Production only)
INNGEST_EVENT_KEY=...                           # Inngest event key
INNGEST_SIGNING_KEY=...                         # Inngest signing key
```

## 🗄️ Database

### Schema Overview
The database uses PostgreSQL with Drizzle ORM:

- **Organizations**: Multi-tenant structure
- **Users**: Authentication and user management
- **Campaigns**: AI-generated email sequences
- **Contacts**: Donor database with enrichment data
- **Segments**: Dynamic contact grouping
- **Email Deliveries**: Tracking and analytics
- **Clicks**: Engagement tracking

### Migrations
```bash
# Generate new migration
npm run db:generate

# Apply migrations  
npm run db:migrate

# View current schema
npx drizzle-kit studio
```

## 🚀 Development

### Available Scripts
```bash
# Development
npm run dev              # Start all development servers
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:generate     # Generate Drizzle migrations
npm run db:migrate      # Apply database migrations

# Code Quality
npm run lint            # ESLint with strict rules
npm run check-types     # TypeScript type checking
npm run format          # Prettier code formatting
```

### Code Standards
- **TypeScript**: Strict mode enabled
- **ES Modules**: Use import/export (not require)
- **Imports**: Destructure when possible
- **Components**: Use Lucide React icons
- **Validation**: Zod schemas for all request bodies
- **Access Control**: Check resource ownership in controllers
- **DTOs**: Interface-based API contracts

## 📚 Key Documentation

- **[API Documentation](./docs/api.md)** - Complete REST API reference
- **[Database Schema](./docs/database.md)** - Tables, relationships, and migrations
- **[Deployment Guide](./docs/deployment.md)** - Vercel setup and environment promotion
- **[Development Workflow](./docs/development.md)** - Git flow and testing procedures
- **[Troubleshooting](./docs/troubleshooting.md)** - Common issues and solutions
- **[Team Onboarding](./docs/onboarding.md)** - New developer checklist

## 🏢 Business Logic Flow

### Campaign Creation Process
1. **Strategy Generation**: AI creates fundraising strategy from brief
2. **Content Creation**: AI generates personalized email sequences  
3. **Contact Targeting**: Segment selection and contact enrichment
4. **Delivery Scheduling**: Background jobs handle email timing
5. **Analytics Tracking**: Click tracking and performance metrics

### Key Integrations
- **OpenAI**: Content generation and strategy creation
- **Apollo.io**: Contact enrichment and data validation
- **Resend/SendGrid**: Reliable email delivery with fallback
- **Inngest**: Background job processing and scheduling

## 🆘 Getting Help

### Common Issues
- **Database Connection**: Verify `POSTGRES_URL` is correct
- **API Keys**: Ensure all third-party services are configured
- **Port Conflicts**: Web runs on 3200, Inngest on 3202
- **Migration Errors**: Check database permissions and connection

### Support Resources
- **Architecture Questions**: Review `/docs/architecture.md`
- **API Integration**: Check `/docs/api.md` 
- **Deployment Issues**: See `/docs/deployment.md`
- **Development Setup**: Follow `/docs/onboarding.md`

## 🤝 Contributing

This platform follows clean architecture principles and domain-driven design. When contributing:

1. Understand the business domain first
2. Follow the established module structure  
3. Write comprehensive tests
4. Update documentation
5. Follow TypeScript strict mode
6. Use proper error handling

## 📄 License

Private and proprietary. All rights reserved.

---

**⚡ Built for charities to maximize their fundraising impact through AI automation**
