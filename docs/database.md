# Database Documentation

## 🏗️ Overview

**Little Phil Ignite** uses PostgreSQL with Drizzle ORM in a multi-tenant architecture.

### Key Design Principles
- **Multi-tenant**: All data scoped by `organisationId`
- **Clean Schema**: Proper foreign keys with cascade deletes
- **Type Safety**: Drizzle provides full TypeScript types

## 🗄️ Database Operations

### Migrations
```bash
# Generate migration from schema changes
npm run db:generate

# Apply migrations to database
npm run db:migrate

# View database in Drizzle Studio
npx drizzle-kit studio
```

### Schema Location
- **Schema Definition**: `apps/web/src/db/schema.ts`
- **Migration Files**: `apps/web/drizzle/`
- **Config**: `apps/web/drizzle.config.ts`

## 📊 Core Tables

### Multi-Tenant Structure
```sql
organisations (id, display_name, slug, type)
├── members (user_id, organisation_id)
├── campaigns (title, status, strategy, cta_url)
├── contacts (email, first_name, last_name)
├── segments (name, criteria)
└── domains (domain, resend_domain_id)
```

### Campaign Flow
```sql
campaigns
├── campaign_emails (content, subject, start_offset_ms)
├── campaign_contacts (links campaigns to contacts)
└── campaign_email_deliveries (tracks individual sends)
```

### Contact Enrichment
```sql
contacts → persons (shared enriched data)
contact_enrichment_jobs → contact_enrichment_tasks
```

## 🔍 Key Relationships

**Campaign System:**
- `campaigns` belong to `organisations`
- `campaigns` can target a `segment`
- `campaigns` contain multiple `campaign_emails`
- `campaign_email_deliveries` track individual sends

**Contact Management:**
- `contacts` are organization-specific
- `persons` provide enriched data across organizations
- `email_verifications` validate email deliverability

**Email Infrastructure:**
- `domains` are verified for sending
- `domain_senders` define from addresses
- `clicks` and `click_events` track engagement

## ⚡ Common Queries

### Get Campaign with Stats
```typescript
const campaign = await db
  .select()
  .from(campaigns)
  .where(eq(campaigns.id, campaignId))
  .where(eq(campaigns.organisationId, orgId))
```

### Contact Enrichment Status
```typescript
const enrichmentJob = await db
  .select()
  .from(contactEnrichmentJobs)
  .where(eq(contactEnrichmentJobs.organisationId, orgId))
  .orderBy(desc(contactEnrichmentJobs.createdAt))
```

## 🛠️ Troubleshooting

**Migration Issues:**
- Check `POSTGRES_URL` is correct
- Ensure database is running
- Verify schema syntax in `schema.ts`

**Connection Problems:**
- Test with `npx drizzle-kit studio`
- Check network connectivity
- Verify SSL requirements for cloud databases

**Performance:**
- All queries filter by `organisationId` first
- Use indexes on frequently queried fields
- Monitor slow queries in production

---

**Next**: See [API Documentation](./api.md) for endpoint details.