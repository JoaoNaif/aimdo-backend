import { makeObjective } from '../../../../../../test/factories/make-objective'
import { InMemoryUserRepository } from '../../../../../../test/repositories/in-memory-user-repository'
import { makeUser } from '../../../../../../test/factories/make-user'
import { AddCollaboratorsObjectiveUseCase } from './add-collaborators-objective'
import { InMemoryObjectiveInviteRepository } from '../../../../../../test/repositories/in-memory-objective-invite-repository'
import { makeObjectiveInvite } from '../../../../../../test/factories/make-objective-invite'
import { InMemoryObjectiveRepository } from '../../../../../../test/repositories/in-memory-objective-repository'

let inMemoryObjectiveRepository: InMemoryObjectiveRepository
let inMemoryUserRepository: InMemoryUserRepository
let inMemoryObjectiveInviteRepository: InMemoryObjectiveInviteRepository
let sut: AddCollaboratorsObjectiveUseCase

describe('Add Collbarator Objective', () => {
  beforeEach(() => {
    inMemoryObjectiveRepository = new InMemoryObjectiveRepository()
    inMemoryUserRepository = new InMemoryUserRepository()
    inMemoryObjectiveInviteRepository = new InMemoryObjectiveInviteRepository()
    sut = new AddCollaboratorsObjectiveUseCase(
      inMemoryObjectiveRepository,
      inMemoryUserRepository,
      inMemoryObjectiveInviteRepository
    )
  })

  it('should be able to add collaborator in objective', async () => {
    const collaborator = makeUser()

    await inMemoryUserRepository.create(collaborator)

    const objective = makeObjective()

    await inMemoryObjectiveRepository.create(objective)

    const objectiveInvite = makeObjectiveInvite({
      collaboratorId: collaborator.id,
      objectiveId: objective.id,
    })

    await inMemoryObjectiveInviteRepository.create(objectiveInvite)

    const result = await sut.execute({
      inviteId: objectiveInvite.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryObjectiveRepository.items[0].collaborators).toHaveLength(1)
  })
})
