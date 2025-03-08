import { InMemoryPasswordResetTokenRepository } from 'test/repositories/in-memory-password-reset-token'
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository'
import { HashGenerator } from '../../_cryptography/hash-generator'
import { ResetForgotPasswordUseCase } from './reset-forgot-password'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeUser } from 'test/factories/make-user'
import { makePasswordResetToken } from 'test/factories/make-password-reset-token'

let inMemoryUserRepository: InMemoryUserRepository
let inMemoryPasswordResetTokenRepository: InMemoryPasswordResetTokenRepository
let hashGenerator: HashGenerator

let sut: ResetForgotPasswordUseCase

describe('Reset Forgot Password', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    inMemoryPasswordResetTokenRepository =
      new InMemoryPasswordResetTokenRepository()
    hashGenerator = new FakeHasher()
    sut = new ResetForgotPasswordUseCase(
      inMemoryUserRepository,
      inMemoryPasswordResetTokenRepository,
      hashGenerator
    )
  })

  it('should be able to reset password', async () => {
    const user = makeUser()

    await inMemoryUserRepository.create(user)

    const passwordResetToken = makePasswordResetToken({
      token: 'test-password-reset-token',
      userId: user.id,
    })

    await inMemoryPasswordResetTokenRepository.create(passwordResetToken)

    const result = await sut.execute({
      confirmPassword: 'teste1234',
      password: 'teste1234',
      email: user.email,
      token: passwordResetToken.token,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryUserRepository.items[0].password).toEqual('teste1234-hashed')
  })
})
