import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeUser } from '../../../../../../test/factories/make-user'
import { InMemoryUserRepository } from '../../../../../../test/repositories/in-memory-user-repository'
import { ResetPasswordUserUseCase } from './reset-password-user'
import { HashGenerator } from '../../_cryptography/hash-generator'
import { HashCompare } from '../../_cryptography/hash-compare'
import { FakeHasher } from '../../../../../../test/cryptography/fake-hasher'

let inMemoryUserRepository: InMemoryUserRepository
let hashGenerator: HashGenerator
let hashCompare: HashCompare
let sut: ResetPasswordUserUseCase

describe('Reset Password User', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    hashGenerator = new FakeHasher()
    hashCompare = new FakeHasher()
    sut = new ResetPasswordUserUseCase(
      inMemoryUserRepository,
      hashCompare,
      hashGenerator
    )
  })

  it('should be able to reset password a user', async () => {
    const password = await hashGenerator.hash('123456')

    const user = makeUser(
      {
        email: 'johndoe@email.com',
        name: 'John Doe',
        username: 'johndoe',
        password,
      },
      new UniqueEntityId('user-1')
    )

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      userId: 'user-1',
      confirmNewPassword: '654321',
      newPassword: '654321',
      oldPassword: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual(null)
  })
})
