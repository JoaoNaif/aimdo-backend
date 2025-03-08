import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  PasswordResetToken,
  PasswordResetTokenProps,
} from '@/domain/enterprise/entities/password-reset-token'
import { PrismaPasswordResetTokenMapper } from '@/infra/database/prisma/mappers/prisma-password-reset-token-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makePasswordResetToken(
  override: Partial<PasswordResetTokenProps> = {},
  id?: UniqueEntityId
) {
  const passwordResetToken = PasswordResetToken.create(
    {
      token: 'token-1',
      userId: new UniqueEntityId('user-1'),
      ...override,
    },
    id
  )

  return passwordResetToken
}

@Injectable()
export class PasswordResetTokenFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaPasswordResetToken(
    data: Partial<PasswordResetTokenProps> = {}
  ): Promise<PasswordResetToken> {
    const passwordResetToken = makePasswordResetToken(data)

    await this.prisma.passwordResetToken.create({
      data: PrismaPasswordResetTokenMapper.toPrisma(passwordResetToken),
    })

    return passwordResetToken
  }
}
