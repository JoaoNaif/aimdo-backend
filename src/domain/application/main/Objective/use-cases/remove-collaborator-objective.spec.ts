import { InMemoryObjectiveRepository } from '../../../../../../test/repositories/in-memory-objective-repository'
import { makeObjective } from '../../../../../../test/factories/make-objective'
import { InMemoryUserRepository } from '../../../../../../test/repositories/in-memory-user-repository'
import { makeUser } from '../../../../../../test/factories/make-user'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { RemoveCollaboratorObjectiveUseCase } from './remove-collaborator-objective'

let inMemoryObjectiveRepository: InMemoryObjectiveRepository
let inMemoryUserRepository: InMemoryUserRepository
let sut: RemoveCollaboratorObjectiveUseCase

describe('Remove Collaborator Objective', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    inMemoryObjectiveRepository = new InMemoryObjectiveRepository()
    sut = new RemoveCollaboratorObjectiveUseCase(inMemoryObjectiveRepository)
  })

  it('should be able to remove a collaborator in objective', async () => {
    const user = makeUser()

    await inMemoryUserRepository.create(user)

    const collaborator = makeUser()

    await inMemoryUserRepository.create(collaborator)

    const objective = makeObjective({
      authorId: user.id,
      collaborators: [collaborator],
    })

    await inMemoryObjectiveRepository.create(objective)

    const result = await sut.execute({
      objectiveId: objective.id.toString(),
      authorId: objective.authorId.toString(),
      collaboratorId: collaborator.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryObjectiveRepository.items[0].collaborators).toHaveLength(0)
  })

  it('should not be able to remove a collaborator if you are not the creator', async () => {
    const user = makeUser()

    await inMemoryUserRepository.create(user)

    const objective = makeObjective()

    await inMemoryObjectiveRepository.create(objective)

    const result = await sut.execute({
      objectiveId: objective.id.toString(),
      authorId: 'error',
      collaboratorId: 'error',
    })

    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(UnauthorizedError)
  })
})
