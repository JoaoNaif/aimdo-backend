import { InMemoryObjectiveRepository } from '../../../../../../test/repositories/in-memory-objective-repository'
import { makeObjective } from '../../../../../../test/factories/make-objective'
import { ChangeStatusObjectiveUseCase } from './change-status-objective'
import { InMemoryUserRepository } from '../../../../../../test/repositories/in-memory-user-repository'
import { makeUser } from '../../../../../../test/factories/make-user'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'

let inMemoryObjectiveRepository: InMemoryObjectiveRepository
let inMemoryUserRepository: InMemoryUserRepository
let sut: ChangeStatusObjectiveUseCase

describe('Change Status Objective', () => {
  beforeEach(() => {
    inMemoryObjectiveRepository = new InMemoryObjectiveRepository()
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new ChangeStatusObjectiveUseCase(inMemoryObjectiveRepository)
  })

  it('should be able to change status for in-progress', async () => {
    const user = makeUser()

    await inMemoryUserRepository.create(user)

    const objective = makeObjective({
      status: 'PENDING',
      authorId: user.id,
    })

    await inMemoryObjectiveRepository.create(objective)

    const result = await sut.execute({
      objectiveId: objective.id.toString(),
      authorId: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryObjectiveRepository.items[0].status).toEqual('IN_PROGRESS')
  })

  it('should be able to change status for completed', async () => {
    const user = makeUser()

    await inMemoryUserRepository.create(user)

    const objective = makeObjective({
      status: 'IN_PROGRESS',
      authorId: user.id,
    })

    await inMemoryObjectiveRepository.create(objective)

    const result = await sut.execute({
      objectiveId: objective.id.toString(),
      authorId: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryObjectiveRepository.items[0].status).toEqual('COMPLETED')
    expect(inMemoryObjectiveRepository.items[0].completedDate).toEqual(
      expect.any(Date)
    )
  })

  it('should not be able to change status for completed if you are not the creator', async () => {
    const user = makeUser()

    await inMemoryUserRepository.create(user)

    const objective = makeObjective({
      status: 'IN_PROGRESS',
      authorId: new UniqueEntityId('error'),
    })

    await inMemoryObjectiveRepository.create(objective)

    const result = await sut.execute({
      objectiveId: objective.id.toString(),
      authorId: user.id.toString(),
    })

    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(UnauthorizedError)
  })
})
