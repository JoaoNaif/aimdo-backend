import { InMemoryObjectiveRepository } from '../../../../../../test/repositories/in-memory-objective-repository'
import { makeObjective } from '../../../../../../test/factories/make-objective'
import { InMemoryUserRepository } from '../../../../../../test/repositories/in-memory-user-repository'
import { makeUser } from '../../../../../../test/factories/make-user'
import { FetchBuysObjectivesUseCase } from './fetch-buys-objectives'

let inMemoryObjectiveRepository: InMemoryObjectiveRepository
let inMemoryUserRepository: InMemoryUserRepository
let sut: FetchBuysObjectivesUseCase

describe('Fetch Buys Objectives', () => {
  beforeEach(() => {
    inMemoryObjectiveRepository = new InMemoryObjectiveRepository()
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new FetchBuysObjectivesUseCase(inMemoryObjectiveRepository)
  })

  it('should be able to fetch a buys', async () => {
    const user = makeUser()

    await inMemoryUserRepository.create(user)

    const objective1 = makeObjective({
      category: 'BUY',
      authorId: user.id,
    })

    await inMemoryObjectiveRepository.create(objective1)

    const objective2 = makeObjective({
      category: 'BUY',
      authorId: user.id,
    })

    await inMemoryObjectiveRepository.create(objective2)

    const result = await sut.execute({
      authorId: user.id.toString(),
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.buys).toHaveLength(2)
    }
  })

  it('should be able to fetch paginated buys', async () => {
    const user = makeUser()

    await inMemoryUserRepository.create(user)

    for (let i = 1; i <= 22; i++) {
      await inMemoryObjectiveRepository.create(
        makeObjective({
          authorId: user.id,
          category: 'BUY',
        })
      )
    }

    const result = await sut.execute({
      authorId: user.id.toString(),
      page: 2,
    })

    if (result.isRight()) {
      expect(result.value.buys).toHaveLength(2)
    }
  })
})
