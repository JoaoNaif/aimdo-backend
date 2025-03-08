import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeUser } from '../../../../../../test/factories/make-user'
import { InMemoryUserRepository } from '../../../../../../test/repositories/in-memory-user-repository'
import { CreateObjectiveUseCase } from './create-objective'
import { InMemoryObjectiveRepository } from '../../../../../../test/repositories/in-memory-objective-repository'

let inMemoryUserRepository: InMemoryUserRepository
let inMemoryObjectiveRepository: InMemoryObjectiveRepository
let sut: CreateObjectiveUseCase

describe('Create Objective', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    inMemoryObjectiveRepository = new InMemoryObjectiveRepository()
    sut = new CreateObjectiveUseCase(
      inMemoryObjectiveRepository,
      inMemoryUserRepository
    )
  })

  it('should be able to create a objective', async () => {
    const user = makeUser(
      {
        email: 'johndoe@email.com',
        name: 'John Doe',
        username: 'johndoe',
      },
      new UniqueEntityId('user-1')
    )

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      authorId: 'user-1',
      title: 'test title',
      description: 'test description',
      category: 'TASK',
      urgency: 'LOW',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.objective).toEqual(
        expect.objectContaining({
          authorId: user.id,
          title: 'test title',
          description: 'test description',
          category: 'TASK',
          urgency: 'LOW',
        })
      )
    }
  })
})
