import { left, right } from '@/core/either'
import { HashGenerator } from '../../_cryptography/hash-generator'
import { UserRepository } from '../../_repositories/user-repository'
import { RegisterUserUseCaseRequest } from '../request/register-user-request'
import { RegisterUserUseCaseResponse } from '../response/register-user-response'
import { EmailAlreadyExistError } from '../errors/user-email-already-exist-error'
import { User } from '@/domain/enterprise/entities/user'
import { UsernameAlreadyExistError } from '../errors/user-username-already.exist'
import { Injectable } from '@nestjs/common'

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    name,
    email,
    password,
    username,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const userWithSameEmail = await this.userRepository.findByEmail(email)

    if (userWithSameEmail) {
      return left(new EmailAlreadyExistError())
    }

    const userWithSameUsername =
      await this.userRepository.findByUsername(username)

    if (userWithSameUsername) {
      return left(new UsernameAlreadyExistError())
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const user = User.create({
      username,
      name,
      password: hashedPassword,
      email,
    })

    await this.userRepository.create(user)

    return right({
      user,
    })
  }
}
