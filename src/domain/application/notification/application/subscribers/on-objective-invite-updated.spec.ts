import { InMemoryUserRepository } from '../../../../../../test/repositories/in-memory-user-repository'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { InMemoryNotificationsRepository } from '../../../../../../test/repositories/in-memory-notification-repository'
import { InMemoryObjectiveRepository } from '../../../../../../test/repositories/in-memory-objective-repository'
import { makeObjectiveInvite } from '../../../../../../test/factories/make-objective-invite'
import { makeUser } from '../../../../../../test/factories/make-user'
import { makeObjective } from '../../../../../../test/factories/make-objective'
import { InMemoryObjectiveInviteRepository } from '../../../../../../test/repositories/in-memory-objective-invite-repository'
import { MockInstance } from 'vitest'
import { OnObjectiveInviteUpdated } from './on-objective-invite-updated'

let inMemoryUserRepository: InMemoryUserRepository
let inMemoryObjectiveRespository: InMemoryObjectiveRepository
let inMemoryObjectiveInviteRepository: InMemoryObjectiveInviteRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance<
  (
    request: SendNotificationUseCaseRequest
  ) => Promise<SendNotificationUseCaseResponse>
>

describe('On Objective Invite Created', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    inMemoryObjectiveRespository = new InMemoryObjectiveRepository()
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    inMemoryObjectiveInviteRepository = new InMemoryObjectiveInviteRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnObjectiveInviteUpdated(
      inMemoryUserRepository,
      inMemoryObjectiveRespository,
      sendNotificationUseCase
    )
  })

  it('should send a notification when an objective invite is updated', async () => {
    const author = makeUser()

    await inMemoryUserRepository.create(author)

    const collaborator = makeUser()

    await inMemoryUserRepository.create(collaborator)

    const objective = makeObjective({
      authorId: author.id,
    })

    await inMemoryObjectiveRespository.create(objective)

    const objectiveInvite = makeObjectiveInvite({
      objectiveId: objective.id,
      collaboratorId: collaborator.id,
    })

    await inMemoryObjectiveInviteRepository.create(objectiveInvite)

    objectiveInvite.status = 'ACCEPTED'

    await inMemoryObjectiveInviteRepository.save(objectiveInvite)

    await vi.waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })

    expect(inMemoryNotificationsRepository.items).toHaveLength(1)
  })
})
