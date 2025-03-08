import { PasswordResetToken } from '@/domain/enterprise/entities/password-reset-token'

export abstract class PasswordResetTokenRepository {
  abstract findById(id: string): Promise<PasswordResetToken | null>
  abstract findByToken(token: string): Promise<PasswordResetToken | null>
  abstract findByUserId(userId: string): Promise<PasswordResetToken[]>
  abstract create(passwordResetToken: PasswordResetToken): Promise<void>
  abstract save(passwordResetToken: PasswordResetToken): Promise<void>
  abstract deleteExpiredTokens(): Promise<void>
}
