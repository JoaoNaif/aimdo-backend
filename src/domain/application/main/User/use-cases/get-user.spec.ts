import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeUser } from '../../../../../../test/factories/make-user'
import { InMemoryUserRepository } from '../../../../../../test/repositories/in-memory-user-repository'
import { GetUserUseCase } from './get-user'

let inMemoryUserRepository: InMemoryUserRepository
let sut: GetUserUseCase

describe('Get User', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new GetUserUseCase(inMemoryUserRepository)
  })

  it('should be able to get a user', async () => {
    const currentDate = new Date()

    const user = makeUser(
      {
        email: 'johndoe@email.com',
        name: 'John Doe',
        username: 'johndoe',
        createdAt: currentDate,
      },
      new UniqueEntityId('user-1')
    )

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      userId: 'user-1',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      user: {
        id: 'user-1',
        email: 'johndoe@email.com',
        name: 'John Doe',
        username: 'johndoe',
        createdAt: currentDate,
      },
    })
  })
})
