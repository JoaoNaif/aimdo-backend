import { InMemoryObjectiveRepository } from '../../../../../../test/repositories/in-memory-objective-repository'
import { makeObjective } from '../../../../../../test/factories/make-objective'
import { InMemoryUserRepository } from '../../../../../../test/repositories/in-memory-user-repository'
import { makeUser } from '../../../../../../test/factories/make-user'
import { FetchObjectiveInviteUseCase } from './fetch-objective-invite'
import { InMemoryObjectiveInviteRepository } from 'test/repositories/in-memory-objective-invite-repository'
import { makeObjectiveInvite } from 'test/factories/make-objective-invite'

let inMemoryObjectiveInviteRepository: InMemoryObjectiveInviteRepository
let sut: FetchObjectiveInviteUseCase

describe('Fetch Objective Invite', () => {
  beforeEach(() => {
    inMemoryObjectiveInviteRepository = new InMemoryObjectiveInviteRepository()
    sut = new FetchObjectiveInviteUseCase(inMemoryObjectiveInviteRepository)
  })

  it('should be able to fetch a invites', async () => {
    const user = makeUser()

    const objective = makeObjective()

    await inMemoryObjectiveInviteRepository.create(
      makeObjectiveInvite({
        collaboratorId: user.id,
        objectiveId: objective.id,
        status: 'PENDING',
      })
    )

    await inMemoryObjectiveInviteRepository.create(
      makeObjectiveInvite({
        collaboratorId: user.id,
        objectiveId: objective.id,
        status: 'PENDING',
      })
    )

    const result = await sut.execute({
      collaboratorId: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.invites).toHaveLength(2)
    }
  })

  it('should not be able to fetch a invites REJECTED or ACCEPTED', async () => {
    const user = makeUser()

    const objective = makeObjective()

    await inMemoryObjectiveInviteRepository.create(
      makeObjectiveInvite({
        collaboratorId: user.id,
        objectiveId: objective.id,
        status: 'PENDING',
      })
    )

    await inMemoryObjectiveInviteRepository.create(
      makeObjectiveInvite({
        collaboratorId: user.id,
        objectiveId: objective.id,
        status: 'ACCEPTED',
      })
    )

    const result = await sut.execute({
      collaboratorId: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.invites).toHaveLength(1)
    }
  })
})
