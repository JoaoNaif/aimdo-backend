import { left, right } from '@/core/either'
import { UserRepository } from '../../_repositories/user-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ResetPasswordUserUseCaseRequest } from '../request/reset-password-user-request'
import { ResetPasswordUserUseCaseResponse } from '../response/reset-password-user'
import { HashCompare } from '../../_cryptography/hash-compare'
import { OldPasswordCredentialsError } from '../errors/old-password-credentials-error'
import { ConfirmPasswordCredentialsError } from '../errors/confirm-password-credentials-error'
import { HashGenerator } from '../../_cryptography/hash-generator'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ResetPasswordUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashCompare: HashCompare,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    userId,
    confirmNewPassword,
    newPassword,
    oldPassword,
  }: ResetPasswordUserUseCaseRequest): Promise<ResetPasswordUserUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    const isPasswordValid = await this.hashCompare.compare(
      oldPassword,
      user.password
    )

    if (!isPasswordValid) {
      return left(new OldPasswordCredentialsError())
    }

    if (newPassword !== confirmNewPassword) {
      return left(new ConfirmPasswordCredentialsError())
    }

    const hashedNewPassword = await this.hashGenerator.hash(newPassword)

    user.password = hashedNewPassword

    await this.userRepository.save(user)

    return right(null)
  }
}
