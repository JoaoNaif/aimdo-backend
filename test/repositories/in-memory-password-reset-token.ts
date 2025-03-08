import { PasswordResetTokenRepository } from '@/domain/application/main/_repositories/password-reset-token-repository'
import { PasswordResetToken } from '@/domain/enterprise/entities/password-reset-token'

export class InMemoryPasswordResetTokenRepository
  implements PasswordResetTokenRepository
{
  public items: PasswordResetToken[] = []

  async findById(id: string): Promise<PasswordResetToken | null> {
    const passwordResetToken = this.items.find(
      (item) => item.id.toString() === id
    )

    if (!passwordResetToken) {
      return null
    }

    return passwordResetToken
  }

  async findByToken(token: string): Promise<PasswordResetToken | null> {
    const passwordResetToken = this.items.find((item) => item.token === token)

    if (!passwordResetToken) {
      return null
    }

    return passwordResetToken
  }

  async findByUserId(userId: string): Promise<PasswordResetToken[]> {
    const passwordResetTokens = this.items.filter(
      (item) => item.userId.toString() === userId
    )

    return passwordResetTokens
  }

  async create(passwordResetToken: PasswordResetToken): Promise<void> {
    this.items.push(passwordResetToken)
  }

  async save(passwordResetToken: PasswordResetToken): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === passwordResetToken.id
    )

    this.items[itemIndex] = passwordResetToken
  }

  async deleteExpiredTokens(): Promise<void> {
    const now = new Date()

    this.items = this.items.filter((item) => item.expiresAt > now)
  }
}
