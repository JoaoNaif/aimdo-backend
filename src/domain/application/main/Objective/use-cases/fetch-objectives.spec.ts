import { InMemoryObjectiveRepository } from '../../../../../../test/repositories/in-memory-objective-repository'
import { makeObjective } from '../../../../../../test/factories/make-objective'
import { InMemoryUserRepository } from '../../../../../../test/repositories/in-memory-user-repository'
import { FetchObjectivesUseCase } from './fetch-objectives'
import { makeUser } from '../../../../../../test/factories/make-user'

let inMemoryObjectiveRepository: InMemoryObjectiveRepository
let inMemoryUserRepository: InMemoryUserRepository
let sut: FetchObjectivesUseCase

describe('Fetch Objectives', () => {
  beforeEach(() => {
    inMemoryObjectiveRepository = new InMemoryObjectiveRepository()
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new FetchObjectivesUseCase(
      inMemoryObjectiveRepository,
      inMemoryUserRepository
    )
  })

  it('should be able to fetch a objectives', async () => {
    const user = makeUser()

    await inMemoryUserRepository.create(user)

    const objective1 = makeObjective({ title: 'title-1', authorId: user.id })

    await inMemoryObjectiveRepository.create(objective1)

    const objective2 = makeObjective({ title: 'title-2', authorId: user.id })

    await inMemoryObjectiveRepository.create(objective2)

    const result = await sut.execute({
      authorId: user.id.toString(),
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.objectives).toHaveLength(2)
    }
  })

  it('should be able to fetch paginated objectives', async () => {
    const user = makeUser()

    await inMemoryUserRepository.create(user)

    for (let i = 1; i <= 22; i++) {
      await inMemoryObjectiveRepository.create(
        makeObjective({
          title: `title-${i}`,
          authorId: user.id,
        })
      )
    }

    const result = await sut.execute({
      authorId: user.id.toString(),
      page: 2,
    })

    if (result.isRight()) {
      expect(result.value.objectives).toHaveLength(2)
    }
  })
})
