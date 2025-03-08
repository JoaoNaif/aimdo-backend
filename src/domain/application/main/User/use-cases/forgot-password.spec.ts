import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository'
import { ForgotPasswordUseCase } from './forgot-password'
import { InMemoryPasswordResetTokenRepository } from 'test/repositories/in-memory-password-reset-token'
import { makeUser } from 'test/factories/make-user'

let inMemoryUserRepository: InMemoryUserRepository
let inMemoryPasswordResetTokenRepository: InMemoryPasswordResetTokenRepository
let fakeEncrypter: FakeEncrypter

let sut: ForgotPasswordUseCase

describe('Forgot Password', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    inMemoryPasswordResetTokenRepository =
      new InMemoryPasswordResetTokenRepository()
    fakeEncrypter = new FakeEncrypter()
    sut = new ForgotPasswordUseCase(
      inMemoryUserRepository,
      inMemoryPasswordResetTokenRepository,
      fakeEncrypter
    )
  })

  it('should be able generate token for forgot password', async () => {
    const user = makeUser()

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      email: user.email,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      token: expect.any(String),
    })
  })
})
