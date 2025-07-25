import { db } from '@/db'
import { createSmartCampaignStrategyUseCase } from '@/modules/campaigns/application/use-cases/create-smart-campaign-strategy.use-case'
import { getCampaignContactsSnapshotUseCase } from '@/modules/campaigns/application/use-cases/get-campaign-contacts-snapshot.use-case'
import {
    CampaignCreateRequest,
    CampaignCreateResult,
} from '@/modules/campaigns/campaigns.types'
import { CampaignContactEntity } from '@/modules/campaigns/domain/campaign-contact.entity'
import { campaignContactsRepository } from '@/modules/campaigns/infrastructure/campaign-contacts-repository'
import { getDomainSenderUseCase } from '@/modules/domains/application/use-cases/get-domain-sender.use-case'
import { RequestContext } from '@/server/_utils/request'
import { getOrganisationUseCase } from '@/server/organisations/use-cases/get-organisation.use-case'
import { checkSegmentAccessUseCase } from '@/server/segments/use-cases/check-segment-access.use-case'
import { NotFoundError } from '@/shared/errors'
import { v4 as uuidv4 } from 'uuid'
import { CampaignEntity } from '../../domain/campaign.entity'
import { campaignRepository } from '../../infrastructure/campaign-repository'

export async function createCampaignController(
    ctx: RequestContext,
    request: CampaignCreateRequest
): Promise<CampaignCreateResult> {
    const organisation = await getOrganisationUseCase(
        request.organisationId,
        request.user
    )

    if (request.segmentId) {
        await checkSegmentAccessUseCase(
            request.segmentId,
            organisation.id.value,
            request.user.id
        )
    }

    const sender = await getDomainSenderUseCase(ctx, request.senderId)
    if (!sender) {
        throw new NotFoundError('Sender not found.')
    }

    // TODO: implement once we have actual domain senders in the DB
    // if (request.domainSenderId) {
    //     await checkDomainSenderAccessUseCase(
    //         request.domainSenderId,
    //         organisation.id.value,
    //         request.user.id
    //     )
    // }

    const smartCampaign = await createSmartCampaignStrategyUseCase(
        request.brief,
        organisation.displayName,
        ''
    )

    const campaignId = uuidv4()
    const campaign = new CampaignEntity({
        id: campaignId,
        createdAt: new Date(),
        title: smartCampaign.title,
        status: 'draft',
        draftStep: 'strategy',
        strategy: smartCampaign.strategy,
        summary: smartCampaign.summary,
        organisationId: organisation.id.value,
        segmentId: request.segmentId ?? null,
        domainSenderId: sender.props.id,
        ctaUrl: request.ctaUrl,
        startedAt: null,
        endedAt: null,
        pausedAt: null,
        totalPausedMs: 0,
    })

    const contactIds = await getCampaignContactsSnapshotUseCase(
        request.segmentId ?? null,
        organisation.id
    )

    await db.transaction(async (tx) => {
        await campaignRepository.save(campaign, tx)
        await campaignContactsRepository.saveMany(
            contactIds.map(
                (contactId) =>
                    new CampaignContactEntity({
                        id: uuidv4(),
                        campaignId,
                        contactId,
                        organisationId: organisation.id.value,
                        createdAt: new Date(),
                    })
            ),
            tx
        )
    })

    return { id: campaign.props.id }
}
