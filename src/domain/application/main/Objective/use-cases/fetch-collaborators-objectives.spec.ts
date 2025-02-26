import { InMemoryObjectiveRepository } from '../../../../../../test/repositories/in-memory-objective-repository'
import { makeObjective } from '../../../../../../test/factories/make-objective'
import { FetchCollaboratorsObjectivesUseCase } from './fetch-collaborators-objectives'
import { makeUser } from '../../../../../../test/factories/make-user'

let inMemoryObjectiveRepository: InMemoryObjectiveRepository
let sut: FetchCollaboratorsObjectivesUseCase

describe('Fetch Collaborators Objectives', () => {
  beforeEach(() => {
    inMemoryObjectiveRepository = new InMemoryObjectiveRepository()
    sut = new FetchCollaboratorsObjectivesUseCase(inMemoryObjectiveRepository)
  })

  it('should be able to fetch a collaborators', async () => {
    const objective = makeObjective()

    await inMemoryObjectiveRepository.create(objective)

    const collaborator1 = makeUser()

    objective.collaborators.push(collaborator1)

    await inMemoryObjectiveRepository.save(objective)

    const collaborator2 = makeUser()

    objective.collaborators.push(collaborator2)

    await inMemoryObjectiveRepository.save(objective)

    const result = await sut.execute({
      objectiveId: objective.id.toString(),
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.collaborators).toHaveLength(2)
    }
  })

  it('should be able to fetch paginated objectives', async () => {
    const objective = makeObjective()

    await inMemoryObjectiveRepository.create(objective)

    for (let i = 1; i <= 22; i++) {
      const collaborator = makeUser()
      objective.collaborators.push(collaborator)

      await inMemoryObjectiveRepository.save(objective)
    }

    const result = await sut.execute({
      objectiveId: objective.id.toString(),
      page: 2,
    })

    if (result.isRight()) {
      expect(result.value.collaborators).toHaveLength(2)
    }
  })
})
