import { Injectable } from '@nestjs/common'
import { UserRepository } from '../../_repositories/user-repository'
import { Encrypter } from '../../_cryptography/encrypter'
import { PasswordResetTokenRepository } from '../../_repositories/password-reset-token-repository'
import { ForgotPasswordRequest } from '../request/forgot-password-request'
import { ForgotPasswordResponse } from '../response/forgot-password-response'
import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { PasswordResetToken } from '@/domain/enterprise/entities/password-reset-token'

@Injectable()
export class ForgotPasswordUseCase {
  constructor(
    private userRepository: UserRepository,
    private passwordResetToken: PasswordResetTokenRepository,
    private encrypter: Encrypter
  ) {}

  async execute({
    email,
  }: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    const existingTokens = await this.passwordResetToken.findByUserId(
      user.id.toString()
    )
    for (const token of existingTokens) {
      token.use()
      await this.passwordResetToken.save(token)
    }

    const token = await this.encrypter.encrypt({
      sub: user.id.toString(),
    })

    const passwordResetToken = PasswordResetToken.create({
      token,
      userId: user.id,
    })

    await this.passwordResetToken.create(passwordResetToken)

    return right({
      token: passwordResetToken.token,
    })
  }
}
