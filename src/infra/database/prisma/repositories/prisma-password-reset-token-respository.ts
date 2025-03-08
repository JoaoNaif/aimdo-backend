import { PasswordResetTokenRepository } from '@/domain/application/main/_repositories/password-reset-token-repository'
import { PasswordResetToken } from '@/domain/enterprise/entities/password-reset-token'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaPasswordResetTokenMapper } from '../mappers/prisma-password-reset-token-mapper'

@Injectable()
export class PrismaPasswordResetTokenRepository
  implements PasswordResetTokenRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<PasswordResetToken | null> {
    const passwordResetToken = await this.prisma.passwordResetToken.findUnique({
      where: {
        id,
      },
    })

    if (!passwordResetToken) {
      return null
    }

    return PrismaPasswordResetTokenMapper.toDomain(passwordResetToken)
  }

  async findByToken(token: string): Promise<PasswordResetToken | null> {
    const now = new Date()

    const passwordResetToken = await this.prisma.passwordResetToken.findUnique({
      where: {
        token,
        used: false,
        expiresAt: {
          gt: now,
        },
      },
    })

    if (!passwordResetToken) {
      return null
    }

    return PrismaPasswordResetTokenMapper.toDomain(passwordResetToken)
  }

  async findByUserId(userId: string): Promise<PasswordResetToken[]> {
    const passwordResetTokens = await this.prisma.passwordResetToken.findMany({
      where: {
        userId,
      },
    })

    return passwordResetTokens.map(PrismaPasswordResetTokenMapper.toDomain)
  }

  async create(passwordResetToken: PasswordResetToken): Promise<void> {
    const data = PrismaPasswordResetTokenMapper.toPrisma(passwordResetToken)

    await this.prisma.passwordResetToken.create({
      data,
    })
  }

  async save(passwordResetToken: PasswordResetToken): Promise<void> {
    const data = PrismaPasswordResetTokenMapper.toPrisma(passwordResetToken)

    await this.prisma.passwordResetToken.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async deleteExpiredTokens(): Promise<void> {
    const now = new Date()

    await this.prisma.passwordResetToken.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    })
  }
}
