import { FakeHasher } from '../../../../../../test/cryptography/fake-hasher'
import { makeUser } from '../../../../../../test/factories/make-user'
import { InMemoryUserRepository } from '../../../../../../test/repositories/in-memory-user-repository'
import { EmailAlreadyExistError } from '../errors/user-email-already-exist-error'
import { UsernameAlreadyExistError } from '../errors/user-username-already.exist'
import { RegisterUserUseCase } from './register-user'

let inMemoryUserRepository: InMemoryUserRepository
let fakeHasher: FakeHasher
let sut: RegisterUserUseCase

describe('Create User', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterUserUseCase(inMemoryUserRepository, fakeHasher)
  })

  it('should be able to register a new user and verify password hash', async () => {
    const result = await sut.execute({
      email: 'johndoe@email.com',
      name: 'John Doe',
      username: 'johndoe',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryUserRepository.items[0].password).toEqual(hashedPassword)
  })

  it('should not be able to register same email', async () => {
    const user = makeUser({
      email: 'johndoe@email.com',
    })

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      email: 'johndoe@email.com',
      name: 'John Doe',
      username: 'johndoe',
      password: '123456',
    })

    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(EmailAlreadyExistError)
  })

  it('should not be able to register same username', async () => {
    const user = makeUser({
      username: 'johndoe',
    })

    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      email: 'johndoe@email.com',
      name: 'John Doe',
      username: 'johndoe',
      password: '123456',
    })

    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(UsernameAlreadyExistError)
  })
})
