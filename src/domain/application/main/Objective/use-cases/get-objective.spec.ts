import { InMemoryObjectiveRepository } from '../../../../../../test/repositories/in-memory-objective-repository'
import { makeObjective } from '../../../../../../test/factories/make-objective'
import { GetObjectiveUseCase } from './get-objective'

let inMemoryObjectiveRepository: InMemoryObjectiveRepository
let sut: GetObjectiveUseCase

describe('Get Objective', () => {
  beforeEach(() => {
    inMemoryObjectiveRepository = new InMemoryObjectiveRepository()
    sut = new GetObjectiveUseCase(inMemoryObjectiveRepository)
  })

  it('should be able to get a objective', async () => {
    const objective = makeObjective()

    await inMemoryObjectiveRepository.create(objective)

    const result = await sut.execute({
      objectiveId: objective.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.objective).toEqual(expect.objectContaining(objective))
    }
  })
})
