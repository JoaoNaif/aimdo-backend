import { InMemoryObjectiveRepository } from '../../../../../../test/repositories/in-memory-objective-repository'
import { makeObjective } from '../../../../../../test/factories/make-objective'
import { InMemoryUserRepository } from '../../../../../../test/repositories/in-memory-user-repository'
import { makeUser } from '../../../../../../test/factories/make-user'
import { FetchGoalsObjectivesUseCase } from './fetch-goals-objectives'

let inMemoryObjectiveRepository: InMemoryObjectiveRepository
let inMemoryUserRepository: InMemoryUserRepository
let sut: FetchGoalsObjectivesUseCase

describe('Fetch Goals Objectives', () => {
  beforeEach(() => {
    inMemoryObjectiveRepository = new InMemoryObjectiveRepository()
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new FetchGoalsObjectivesUseCase(inMemoryObjectiveRepository)
  })

  it('should be able to fetch a goals', async () => {
    const user = makeUser()

    await inMemoryUserRepository.create(user)

    const objective1 = makeObjective({
      category: 'GOAL',
      authorId: user.id,
    })

    await inMemoryObjectiveRepository.create(objective1)

    const objective2 = makeObjective({
      category: 'GOAL',
      authorId: user.id,
    })

    await inMemoryObjectiveRepository.create(objective2)

    const result = await sut.execute({
      authorId: user.id.toString(),
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.goals).toHaveLength(2)
    }
  })

  it('should be able to fetch paginated goals', async () => {
    const user = makeUser()

    await inMemoryUserRepository.create(user)

    for (let i = 1; i <= 22; i++) {
      await inMemoryObjectiveRepository.create(
        makeObjective({
          authorId: user.id,
          category: 'GOAL',
        })
      )
    }

    const result = await sut.execute({
      authorId: user.id.toString(),
      page: 2,
    })

    if (result.isRight()) {
      expect(result.value.goals).toHaveLength(2)
    }
  })
})
