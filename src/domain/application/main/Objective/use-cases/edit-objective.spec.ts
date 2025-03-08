import { InMemoryObjectiveRepository } from '../../../../../../test/repositories/in-memory-objective-repository'
import { makeObjective } from '../../../../../../test/factories/make-objective'
import { EditObjectiveUseCase } from './edit-objective'
import { InMemoryUserRepository } from '../../../../../../test/repositories/in-memory-user-repository'
import { makeUser } from '../../../../../../test/factories/make-user'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'

let inMemoryObjectiveRepository: InMemoryObjectiveRepository
let inMemoryUserRepository: InMemoryUserRepository
let sut: EditObjectiveUseCase

describe('Edit Objective', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    inMemoryObjectiveRepository = new InMemoryObjectiveRepository()
    sut = new EditObjectiveUseCase(inMemoryObjectiveRepository)
  })

  it('should be able to edit a objective', async () => {
    const user = makeUser()

    await inMemoryUserRepository.create(user)

    const objective = makeObjective({
      authorId: user.id,
    })

    await inMemoryObjectiveRepository.create(objective)

    const result = await sut.execute({
      objectiveId: objective.id.toString(),
      authorId: user.id.toString(),
      title: 'test',
      description: 'desc test',
      category: 'TASK',
      urgency: 'LOW',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryObjectiveRepository.items[0]).toEqual(
      expect.objectContaining({
        title: 'test',
        description: 'desc test',
        category: 'TASK',
        urgency: 'LOW',
      })
    )
  })

  it('should not be able to edit a objective if you are not the creator', async () => {
    const user = makeUser()

    await inMemoryUserRepository.create(user)

    const objective = makeObjective()

    await inMemoryObjectiveRepository.create(objective)

    const result = await sut.execute({
      objectiveId: objective.id.toString(),
      authorId: user.id.toString(),
      title: 'test',
      description: 'desc test',
      category: 'TASK',
      urgency: 'LOW',
    })

    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(UnauthorizedError)
  })
})
