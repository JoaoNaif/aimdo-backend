import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  ObjectiveInvite,
  ObjectiveInviteProps,
} from '@/domain/enterprise/entities/objective-invite'
import { PrismaObjectiveInviteMapper } from '@/infra/database/prisma/mappers/prisma-objective-invite-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makeObjectiveInvite(
  override: Partial<ObjectiveInviteProps> = {},
  id?: UniqueEntityId
) {
  const objectiveInvite = ObjectiveInvite.create(
    {
      collaboratorId: new UniqueEntityId('collaborator-1'),
      objectiveId: new UniqueEntityId('objective-1'),
      status: 'PENDING',
      ...override,
    },
    id
  )

  return objectiveInvite
}

@Injectable()
export class ObjectiveInviteFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaObjectiveInvite(
    data: Partial<ObjectiveInviteProps> = {}
  ): Promise<ObjectiveInvite> {
    const objectiveInvite = makeObjectiveInvite(data)

    await this.prisma.objectiveInvite.create({
      data: PrismaObjectiveInviteMapper.toPrisma(objectiveInvite),
    })

    return objectiveInvite
  }
}
