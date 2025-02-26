import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeUser } from '../../../../../../test/factories/make-user'
import { InMemoryUserRepository } from '../../../../../../test/repositories/in-memory-user-repository'
import { DeleteUserUseCase } from './delete-user'

let inMemoryUserRepository: InMemoryUserRepository
let sut: DeleteUserUseCase

describe('Delete User', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new DeleteUserUseCase(inMemoryUserRepository)
  })

  it('should be able to delete a user', async () => {
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
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual(null)
  })
})
