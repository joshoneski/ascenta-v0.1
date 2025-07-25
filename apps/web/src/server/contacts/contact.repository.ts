import { db } from '@/db'
import {
    contacts as CONTACTS,
    emailVerifications as EMAIL_VERIFICATIONS,
    enrichedContactsView,
} from '@/db/schema'
import { buildConflictUpdateColumns } from '@/server/_utils/database'
import {
    contactAdapters,
    enrichedContactAdapters,
} from '@/server/contacts/contact.adapter'
import { ContactId, EnrichedContactId } from '@/server/contacts/contact.entity'
import {
    ContactCreateParams,
    ContactUpdateParams,
    ContactUpsertManyParams,
    ContactUpsertParams,
} from '@/server/contacts/contact.types'
import { OrganisationId } from '@/server/organisations/organisation.entity'
import { FatalError, NotFoundError } from '@/shared/errors'
import { and, count, eq, inArray, sql } from 'drizzle-orm'
import { z } from 'zod'

const emailStatusCheckEnum = z.enum(['failed', 'passed', 'pending', 'unknown'])

export const contactsRepo = {
    query: {
        countContacts: async (organisationId: OrganisationId) => {
            const [result] = await db
                .select({ count: count() })
                .from(CONTACTS)
                .where(eq(CONTACTS.organisationId, organisationId.value))

            return result ? result.count : 0
        },
        countContactsWithEmailStatus: async (
            organisationId: OrganisationId,
            status: 'invalid' | 'valid'
        ) => {
            const [result] = await db
                .select({
                    count: sql`COUNT(DISTINCT
                    ${CONTACTS.id}
                    )`.mapWith(Number),
                })
                .from(CONTACTS)
                .innerJoin(
                    EMAIL_VERIFICATIONS,
                    and(
                        eq(
                            CONTACTS.emailVerificationId,
                            EMAIL_VERIFICATIONS.id
                        ),
                        eq(EMAIL_VERIFICATIONS.status, status)
                    )
                )
                .where(eq(CONTACTS.organisationId, organisationId.value))

            return result ? result.count : 0
        },
        findById: async (contactId: ContactId) => {
            const [contact] = await db
                .select()
                .from(CONTACTS)
                .where(eq(CONTACTS.id, contactId.value))

            if (!contact) {
                throw new NotFoundError('Contact not found.')
            }

            return contactAdapters.dbToEntity(contact)
        },
        findByOrganisation: async (organisationId: OrganisationId) => {
            const contacts = await db
                .select()
                .from(CONTACTS)
                .where(and(eq(CONTACTS.organisationId, organisationId.value)))

            return contacts.map(contactAdapters.dbToEntity)
        },
        findEnrichedById: async (
            organisationId: OrganisationId,
            contactId: EnrichedContactId
        ) => {
            const [enrichedContact] = await db
                .select()
                .from(enrichedContactsView)
                .where(
                    and(
                        eq(enrichedContactsView.id, contactId.value),
                        eq(
                            enrichedContactsView.organisationId,
                            organisationId.value
                        )
                    )
                )

            if (!enrichedContact) {
                throw new NotFoundError('Contact not found.')
            }

            return enrichedContactAdapters.dbToEntity(enrichedContact)
        },
        findEnrichedByOrganisation: async (organisationId: OrganisationId) => {
            const enrichedContacts = await db
                .select()
                .from(enrichedContactsView)
                .where(
                    and(
                        eq(
                            enrichedContactsView.organisationId,
                            organisationId.value
                        )
                    )
                )

            return enrichedContacts.map(enrichedContactAdapters.dbToEntity)
        },
    },
    mutate: {
        create: async (data: ContactCreateParams) => {
            const [contact] = await db
                .insert(CONTACTS)
                .values([
                    {
                        ...data,
                        organisationId: data.organisationId.value,
                    },
                ])
                .returning()

            if (!contact) {
                throw new FatalError('Failed to create contact.')
            }

            return contactAdapters.dbToEntity(contact)
        },
        updateOne: async (
            organisationId: OrganisationId,
            contactId: ContactId,
            params: ContactUpdateParams
        ) => {
            const [contact] = await db
                .update(CONTACTS)
                .set(params)
                .where(
                    and(
                        eq(CONTACTS.id, contactId.value),
                        eq(CONTACTS.organisationId, organisationId.value)
                    )
                )
                .returning()

            if (!contact) {
                throw new FatalError('Failed to update contact.')
            }

            return contactAdapters.dbToEntity(contact)
        },
        upsertMany: async (
            organisationId: OrganisationId,
            params: ContactUpsertManyParams
        ) => {
            const existingContacts = await db
                .select()
                .from(CONTACTS)
                .where(
                    and(
                        inArray(
                            CONTACTS.email,
                            params.map((value) => value.email)
                        ),
                        eq(CONTACTS.organisationId, organisationId.value)
                    )
                )

            const inserts: ContactUpsertParams[] = []
            const upserts: (ContactUpsertParams & { id: string })[] = []

            params.forEach((value) => {
                const existing = existingContacts.find(
                    (contact) =>
                        contact.email === value.email &&
                        contact.organisationId === organisationId.value
                )

                existing
                    ? upserts.push({ ...value, id: existing.id })
                    : inserts.push(value)
            })

            return db.transaction(async (tx) => {
                if (inserts.length) {
                    await tx.insert(CONTACTS).values(
                        inserts.map((params) => ({
                            ...params,
                            organisationId: organisationId.value,
                        }))
                    )
                }

                if (upserts.length) {
                    await tx
                        .insert(CONTACTS)
                        .values(
                            upserts.map((params) => ({
                                ...params,
                                organisationId: organisationId.value,
                            }))
                        )
                        .onConflictDoUpdate({
                            target: CONTACTS.id,
                            set: buildConflictUpdateColumns(CONTACTS, [
                                'firstName',
                                'lastName',
                            ]),
                        })
                }

                return {
                    created: inserts.length,
                    updated: upserts.length,
                }
            })
        },
    },
}
