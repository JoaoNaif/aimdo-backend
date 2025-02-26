import { InMemoryObjectiveRepository } from '../../../../../../test/repositories/in-memory-objective-repository'
import { DeleteObjectiveUseCase } from './delete-objective'
import { makeObjective } from '../../../../../../test/factories/make-objective'
import { InMemoryUserRepository } from '../../../../../../test/repositories/in-memory-user-repository'
import { makeUser } from '../../../../../../test/factories/make-user'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'

let inMemoryObjectiveRepository: InMemoryObjectiveRepository
let inMemoryUserRepository: InMemoryUserRepository
let sut: DeleteObjectiveUseCase

describe('Delete Objective', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    inMemoryObjectiveRepository = new InMemoryObjectiveRepository()
    sut = new DeleteObjectiveUseCase(inMemoryObjectiveRepository)
  })

  it('should be able to delete a objective', async () => {
    const user = makeUser()

    await inMemoryUserRepository.create(user)

    const objective = makeObjective({
      authorId: user.id,
    })

    await inMemoryObjectiveRepository.create(objective)

    const result = await sut.execute({
      objectiveId: objective.id.toString(),
      authorId: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual(null)
  })

  it('should be able to delete a objective if you are not the creator', async () => {
    const user = makeUser()

    await inMemoryUserRepository.create(user)

    const objective = makeObjective()

    await inMemoryObjectiveRepository.create(objective)

    const result = await sut.execute({
      objectiveId: objective.id.toString(),
      authorId: user.id.toString(),
    })

    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(UnauthorizedError)
  })
})
