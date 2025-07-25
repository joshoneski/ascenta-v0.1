import { users } from '@/db/auth-schema'
import { coalesce } from '@/db/helpers'
import {
    ContactEnrichmentJobStatus,
    ContactEnrichmentTaskStatus,
} from '@/modules/background-tasks/contact-enrichment-job.type'
import {
    CampaignDraftStep,
    CampaignEmailDeliveryStatus,
    CampaignEmailStatus,
    CampaignStatus,
} from '@/modules/campaigns'
import { ClickTypeValue } from '@/modules/clicks/click.emums'
import { EmailVerificationCheckEnum } from '@/server/email-verification/email-verification.types'
import { eq, getTableColumns } from 'drizzle-orm'
import {
    doublePrecision,
    integer,
    jsonb,
    numeric,
    pgTable,
    pgView,
    text,
    timestamp,
    uuid,
    varchar,
} from 'drizzle-orm/pg-core'

export { accounts, sessions, users, verifications } from './auth-schema'

export const campaigns = pgTable('campaigns', {
    id: uuid('id').primaryKey(),
    organisationId: uuid('organisation_id')
        .notNull()
        .references(() => organisations.id, { onDelete: 'cascade' }),
    segmentId: uuid('segment_id').references(() => segments.id, {
        onDelete: 'set null',
    }),
    domainSenderId: uuid('domain_sender_id').references(
        () => domainSenders.id,
        {
            onDelete: 'set null',
        }
    ),
    title: text('title').notNull(),
    status: text('status').notNull().$type<CampaignStatus>(),
    draftStep: text('draft_step').$type<CampaignDraftStep>(),
    strategy: text('strategy').notNull(),
    summary: text('summary').notNull(),
    totalPausedMs: numeric('total_paused_ms').notNull().$type<number>(),
    ctaUrl: text('cta_url').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    pausedAt: timestamp('paused_at'),
    startedAt: timestamp('started_at'),
    endedAt: timestamp('ended_at'),
})

export const campaignContacts = pgTable('campaign_contacts', {
    id: uuid('id').primaryKey().defaultRandom(),
    campaignId: uuid('campaign_id')
        .notNull()
        .references(() => campaigns.id, { onDelete: 'cascade' }),
    contactId: uuid('contact_id')
        .notNull()
        .references(() => contacts.id, { onDelete: 'cascade' }),
    organisationId: uuid('organisation_id')
        .notNull()
        .references(() => organisations.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const campaignEmails = pgTable('campaign_emails', {
    id: uuid('id').primaryKey(),
    campaignId: uuid('campaign_id')
        .notNull()
        .references(() => campaigns.id, { onDelete: 'cascade' }),
    organisationId: uuid('organisation_id')
        .notNull()
        .references(() => organisations.id, { onDelete: 'cascade' }),
    status: text('status')
        .notNull()
        .$type<CampaignEmailStatus>()
        .default('ready'),
    contentFocus: text('content_focus').notNull(),
    purpose: text('purpose').notNull(),
    startOffsetMs: numeric('start_offset_ms').notNull().$type<number>(),
    sample: text('sample').notNull(),
    subject: text('subject').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    sentAt: timestamp('sent_at'),
})

export const campaignEmailDeliveries = pgTable('campaign_email_deliveries', {
    id: uuid('id').primaryKey(),
    campaignId: uuid('campaign_id')
        .notNull()
        .references(() => campaigns.id, { onDelete: 'cascade' }),
    campaignContactId: uuid('campaign_contact_id')
        .notNull()
        .references(() => campaignContacts.id, { onDelete: 'cascade' }),
    campaignEmailId: uuid('campaign_email_id')
        .notNull()
        .references(() => campaignEmails.id, { onDelete: 'cascade' }),
    organisationId: uuid('organisation_id')
        .notNull()
        .references(() => organisations.id, { onDelete: 'cascade' }),
    error: text('error'),
    status: text('status').notNull().$type<CampaignEmailDeliveryStatus>(),
    statusUpdatedAt: timestamp('status_updated_at').defaultNow().notNull(),
    senderEmail: text('sender_email'),
    senderName: text('sender_name'),
    recipientEmail: text('recipient_email'),
    subject: text('subject'),
    html: text('html'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const clicks = pgTable('clicks', {
    id: uuid('id').primaryKey(),
    token: varchar('token', { length: 64 }).notNull().unique(),
    organisationId: uuid('organisation_id')
        .notNull()
        .references(() => organisations.id, { onDelete: 'cascade' }),
    type: varchar('type').notNull().$type<ClickTypeValue>(),
    destinationUrl: text('destination_url').notNull(),
    metadata: jsonb('metadata').notNull().$type<Record<string, unknown>>(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const clickEvents = pgTable('click_events', {
    id: uuid('id').primaryKey().defaultRandom(),
    clickId: uuid('click_id')
        .references(() => clicks.id, { onDelete: 'cascade' })
        .notNull(),
    organisationId: uuid('organisation_id')
        .notNull()
        .references(() => organisations.id, { onDelete: 'cascade' }),
    metadata: jsonb('metadata').notNull().$type<Record<string, unknown>>(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const contacts = pgTable('contacts', {
    id: uuid('id').primaryKey().defaultRandom(),
    emailVerificationId: uuid('email_verification_id').references(
        () => emailVerifications.id,
        { onDelete: 'set null' }
    ),
    organisationId: uuid('organisation_id')
        .notNull()
        .references(() => organisations.id, { onDelete: 'cascade' }),
    personId: uuid('person_id').references(() => persons.id, {
        onDelete: 'set null',
    }),
    email: varchar('email', { length: 256 }).notNull(),
    firstName: varchar('first_name', { length: 256 }),
    lastName: varchar('last_name', { length: 256 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const contactEnrichmentJobs = pgTable('contact_enrichment_jobs', {
    id: uuid('id').primaryKey().defaultRandom(),
    organisationId: uuid('organisation_id')
        .notNull()
        .references(() => organisations.id, { onDelete: 'cascade' }),
    status: text('status').notNull().$type<ContactEnrichmentJobStatus>(),
    totalCount: integer('total_count').notNull(),
    completedCount: integer('completed_count').notNull().default(0),
    failedCount: integer('failed_count').notNull().default(0),
    startedAt: timestamp('started_at'),
    completedAt: timestamp('completed_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const contactEnrichmentTasks = pgTable('contact_enrichment_items', {
    id: uuid('id').primaryKey().defaultRandom(),
    contactId: uuid('contact_id')
        .notNull()
        .references(() => contacts.id, { onDelete: 'restrict' }),
    jobId: uuid('job_id')
        .notNull()
        .references(() => contactEnrichmentJobs.id, { onDelete: 'cascade' }),
    organisationId: uuid('organisation_id')
        .notNull()
        .references(() => organisations.id, { onDelete: 'cascade' }),
    status: text('status')
        .notNull()
        .default('queued')
        .$type<ContactEnrichmentTaskStatus>(),
    attempts: integer('attempts').notNull().default(0),
    error: text('error'),
    startedAt: timestamp('started_at'),
    completedAt: timestamp('completed_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const domains = pgTable('domains', {
    id: uuid('id').primaryKey().defaultRandom(),
    organisationId: uuid('organisation_id')
        .notNull()
        .references(() => organisations.id, { onDelete: 'cascade' }),
    resendDomainId: varchar('resend_domain_id').notNull(),
    domain: text('domain').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const domainSenders = pgTable('domain_senders', {
    id: uuid('id').primaryKey().defaultRandom(),
    domainId: uuid('domain_id')
        .notNull()
        .references(() => domains.id, { onDelete: 'cascade' }),
    organisationId: uuid('organisation_id')
        .notNull()
        .references(() => organisations.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 256 }).notNull(),
    username: varchar('username', { length: 256 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const emailVerifications = pgTable('email_verifications', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 256 }).notNull(),
    status: varchar('status', {
        enum: ['invalid', 'processing', 'valid', 'unverified'],
        length: 255,
    }).notNull(),
    blacklisted: varchar('blacklisted', {
        enum: EmailVerificationCheckEnum.options,
        length: 256,
    }).notNull(),
    deliverable: varchar('deliverable', {
        enum: EmailVerificationCheckEnum.options,
        length: 256,
    }).notNull(),
    disposable: varchar('disposable', {
        enum: EmailVerificationCheckEnum.options,
        length: 256,
    }).notNull(),
    roleBased: varchar('role_based', {
        enum: EmailVerificationCheckEnum.options,
        length: 256,
    }).notNull(),
    syntax: varchar('syntax', {
        enum: EmailVerificationCheckEnum.options,
        length: 256,
    }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const members = pgTable('members', {
    id: uuid('id').primaryKey().defaultRandom(),
    organisationId: uuid('organisation_id')
        .notNull()
        .references(() => organisations.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const organisations = pgTable('organisations', {
    id: uuid('id').primaryKey().defaultRandom(),
    displayName: varchar('display_name', { length: 256 }).notNull(),
    slug: varchar('slug', { length: 256 }).unique().notNull(),
    primaryColor: varchar('primary_color', { length: 7 }), //e.g."#ffffff"
    type: varchar('type', {
        enum: ['admin', 'charity'],
        length: 256,
    }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const persons = pgTable('persons', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 256 }).unique().notNull(),
    firstName: varchar('first_name', { length: 256 }),
    lastName: varchar('last_name', { length: 256 }),
    city: varchar('city', { length: 256 }),
    country: varchar('country', { length: 256 }),
    region: varchar('region', { length: 256 }),
    company: varchar('company', { length: 256 }),
    profession: varchar('profession', { length: 256 }),
    timezone: varchar('timezone', { length: 256 }),
    enrichmentScore: doublePrecision('enrichment_score').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const personPersonas = pgTable('person_personas', {
    id: uuid('id').primaryKey().defaultRandom(),
    personId: uuid('person_id')
        .references(() => persons.id, { onDelete: 'cascade' })
        .notNull(),
    summary: varchar('summary').notNull(),
    motivations: varchar('motivations').notNull(),
    communicationStyle: varchar('communication_style').notNull(),
    potentialObjections: varchar('potential_objections').notNull(),
    engagementSuggestions: varchar('engagement_suggestions').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const segments = pgTable('segments', {
    id: uuid('id').primaryKey().defaultRandom(),
    organisationId: uuid('organisation_id')
        .references(() => organisations.id, { onDelete: 'cascade' })
        .notNull(),
    name: text('name').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const segmentFilters = pgTable('segment_filters', {
    id: uuid('id').primaryKey().defaultRandom(),
    segmentId: uuid('segment_id')
        .references(() => segments.id, { onDelete: 'cascade' })
        .notNull(),
    field: text('field').notNull(),
    operator: text('operator', {
        enum: ['=', '!=', '>=', '>', '<', '<='],
    }).notNull(),
    value: jsonb('value').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const enrichedContactsView = pgView('enriched_contacts_view').as((qb) =>
    qb
        .select(getEnrichedContactsViewFields())
        .from(contacts)
        .leftJoin(persons, eq(contacts.personId, persons.id))
)

function getEnrichedContactsViewFields() {
    // include all contacts columns
    const contactsColumns = getTableColumns(contacts)

    // exclude updated columns as this related to the person and not the contact
    const { updatedAt, ...personsColumns } = getTableColumns(persons)

    return {
        ...personsColumns,
        ...contactsColumns,
        firstName: coalesce<string | null>('first_name', [
            contacts.firstName,
            persons.firstName,
        ]),
        lastName: coalesce<string | null>('last_name', [
            contacts.lastName,
            persons.lastName,
        ]),
    }
}
