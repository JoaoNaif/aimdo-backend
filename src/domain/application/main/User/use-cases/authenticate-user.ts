import { left, right } from '@/core/either'
import { UserRepository } from '../../_repositories/user-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { AuthenticateUserUseCaseRequest } from '../request/authenticate-user-request'
import { AuthenticateUserUseCaseResponse } from '../response/authenticate-user-response'
import { HashCompare } from '../../_cryptography/hash-compare'
import { Encrypter } from '../../_cryptography/encrypter'
import { WrongCredentialsError } from '../errors/wrong-credentials-error'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashCompare: HashCompare,
    private encrypter: Encrypter
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    const isPasswordValid = await this.hashCompare.compare(
      password,
      user.password
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: user.id.toString(),
    })

    return right({
      accessToken,
    })
  }
}
