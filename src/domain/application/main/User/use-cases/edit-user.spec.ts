import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeUser } from '../../../../../../test/factories/make-user'
import { InMemoryUserRepository } from '../../../../../../test/repositories/in-memory-user-repository'
import { EditUserUseCase } from './edit-user'

let inMemoryUserRepository: InMemoryUserRepository
let sut: EditUserUseCase

describe('Edit User', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new EditUserUseCase(inMemoryUserRepository)
  })

  it('should be able to edit a user', async () => {
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
      userId: 'user-1',
      email: 'test@email.com',
      name: 'test',
      username: 'test01',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryUserRepository.items[0]).toMatchObject({
      email: 'test@email.com',
      name: 'test',
      username: 'test01',
    })
  })
})
