import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeUser } from '../../../../../../test/factories/make-user'
import { InMemoryUserRepository } from '../../../../../../test/repositories/in-memory-user-repository'
import { FakeHasher } from '../../../../../../test/cryptography/fake-hasher'
import { FakeEncrypter } from '../../../../../../test/cryptography/fake-encrypter'
import { AuthenticateUserUseCase } from './authenticate-user'

let inMemoryUserRepository: InMemoryUserRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter

let sut: AuthenticateUserUseCase

describe('Authenticate User', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateUserUseCase(
      inMemoryUserRepository,
      fakeHasher,
      fakeEncrypter
    )
  })

  it('should be able to authenticate a user', async () => {
    const user = makeUser(
      {
        email: 'johndoe@email.com',
        name: 'John Doe',
        username: 'johndoe',
        password: await fakeHasher.hash('123456'),
      },
      new UniqueEntityId('user-1')
    )

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      email: 'johndoe@email.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
