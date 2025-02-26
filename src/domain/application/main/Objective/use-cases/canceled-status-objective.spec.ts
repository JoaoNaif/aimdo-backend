import { InMemoryObjectiveRepository } from '../../../../../../test/repositories/in-memory-objective-repository'
import { makeObjective } from '../../../../../../test/factories/make-objective'
import { InMemoryUserRepository } from '../../../../../../test/repositories/in-memory-user-repository'
import { makeUser } from '../../../../../../test/factories/make-user'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { CanceledStatusObjectiveUseCase } from './canceled-status-objective'

let inMemoryObjectiveRepository: InMemoryObjectiveRepository
let inMemoryUserRepository: InMemoryUserRepository
let sut: CanceledStatusObjectiveUseCase

describe('Canceled Status Objective', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    inMemoryObjectiveRepository = new InMemoryObjectiveRepository()
    sut = new CanceledStatusObjectiveUseCase(inMemoryObjectiveRepository)
  })

  it('should be able to canceled a status objective', async () => {
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
    expect(inMemoryObjectiveRepository.items[0].status).toEqual('CANCELED')
    expect(result.value).toEqual(null)
  })

  it('should be able to canceled a status objective if you are not the creator', async () => {
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
