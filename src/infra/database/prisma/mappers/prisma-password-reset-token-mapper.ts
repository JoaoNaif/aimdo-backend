import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { PasswordResetToken } from '@/domain/enterprise/entities/password-reset-token'
import {
  Prisma,
  PasswordResetToken as PrismaPasswordResetToken,
} from '@prisma/client'

export class PrismaPasswordResetTokenMapper {
  static toDomain(raw: PrismaPasswordResetToken): PasswordResetToken {
    return PasswordResetToken.create(
      {
        token: raw.token,
        userId: new UniqueEntityId(raw.userId),
        used: raw.used,
        expiresAt: raw.expiresAt,
        createdAt: raw.createdAt,
      },
      new UniqueEntityId(raw.id)
    )
  }

  static toPrisma(
    passwordResetToken: PasswordResetToken
  ): Prisma.PasswordResetTokenUncheckedCreateInput {
    return {
      id: passwordResetToken.id.toString(),
      userId: passwordResetToken.userId.toString(),
      token: passwordResetToken.token,
      used: passwordResetToken.used,
      expiresAt: passwordResetToken.expiresAt,
      createdAt: passwordResetToken.createdAt,
    }
  }
}
