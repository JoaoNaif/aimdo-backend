import { Injectable } from '@nestjs/common'
import { UserRepository } from '../../_repositories/user-repository'
import { HashGenerator } from '../../_cryptography/hash-generator'
import { PasswordResetTokenRepository } from '../../_repositories/password-reset-token-repository'
import { ResetForgotPasswordUseCaseResponse } from '../response/reset-forgot-password-response'
import { ResetForgotPasswordUseCaseRequest } from '../request/reset-forgot-password-request'
import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { ConfirmPasswordCredentialsError } from '../errors/confirm-password-credentials-error'

@Injectable()
export class ResetForgotPasswordUseCase {
  constructor(
    private userRepository: UserRepository,
    private passwordResetToken: PasswordResetTokenRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    confirmPassword,
    password,
    token,
    email,
  }: ResetForgotPasswordUseCaseRequest): Promise<ResetForgotPasswordUseCaseResponse> {
    await this.passwordResetToken.deleteExpiredTokens()

    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    const passwordResetToken = await this.passwordResetToken.findByToken(token)

    if (!passwordResetToken) {
      return left(new ResourceNotFoundError())
    }

    if (user.id.toString() !== passwordResetToken.userId.toString()) {
      return left(new UnauthorizedError())
    }

    if (confirmPassword !== password) {
      return left(new ConfirmPasswordCredentialsError())
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    user.password = hashedPassword

    await this.userRepository.save(user)

    passwordResetToken.use()

    await this.passwordResetToken.save(passwordResetToken)

    return right(null)
  }
}
