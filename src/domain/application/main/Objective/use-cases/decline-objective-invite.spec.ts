import { InMemoryObjectiveRepository } from '../../../../../../test/repositories/in-memory-objective-repository'
import { DeleteObjectiveUseCase } from './delete-objective'
import { makeObjective } from '../../../../../../test/factories/make-objective'
import { InMemoryUserRepository } from '../../../../../../test/repositories/in-memory-user-repository'
import { makeUser } from '../../../../../../test/factories/make-user'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { DeclineObjectiveInviteUseCase } from './decline-objective-invite'
import { InMemoryObjectiveInviteRepository } from '../../../../../../test/repositories/in-memory-objective-invite-repository'
import { makeObjectiveInvite } from '../../../../../../test/factories/make-objective-invite'

let inMemoryObjectiveRepository: InMemoryObjectiveRepository
let inMemoryObjectiveInviteRepository: InMemoryObjectiveInviteRepository
let inMemoryUserRepository: InMemoryUserRepository
let sut: DeclineObjectiveInviteUseCase

describe('Decline Objective Invite', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    inMemoryObjectiveInviteRepository = new InMemoryObjectiveInviteRepository()
    inMemoryObjectiveRepository = new InMemoryObjectiveRepository()
    sut = new DeclineObjectiveInviteUseCase(
      inMemoryObjectiveInviteRepository,
      inMemoryUserRepository
    )
  })

  it('should be able to decline a objective invite', async () => {
    const user = makeUser()

    await inMemoryUserRepository.create(user)

    const objective = makeObjective()

    await inMemoryObjectiveRepository.create(objective)

    const objectiveInvite = makeObjectiveInvite({
      objectiveId: objective.id,
      collaboratorId: user.id,
    })

    await inMemoryObjectiveInviteRepository.create(objectiveInvite)

    const result = await sut.execute({
      objectiveInviteId: objectiveInvite.id.toString(),
      userId: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual(null)
  })

  it('should be able to delete a objective if you are not the creator', async () => {
    const user = makeUser()

    await inMemoryUserRepository.create(user)

    const objective = makeObjective()

    await inMemoryObjectiveRepository.create(objective)

    const objectiveInvite = makeObjectiveInvite({
      objectiveId: objective.id,
    })

    await inMemoryObjectiveInviteRepository.create(objectiveInvite)

    const result = await sut.execute({
      objectiveInviteId: objectiveInvite.id.toString(),
      userId: user.id.toString(),
    })

    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(UnauthorizedError)
  })
})
