import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ObjectiveInvite } from '@/domain/enterprise/entities/objective-invite'
import {
  Prisma,
  ObjectiveInvite as PrismaObjectiveInvite,
} from '@prisma/client'

export class PrismaObjectiveInviteMapper {
  static toDomain(raw: PrismaObjectiveInvite): ObjectiveInvite {
    return ObjectiveInvite.create(
      {
        collaboratorId: new UniqueEntityId(raw.collaboratorId),
        objectiveId: new UniqueEntityId(raw.objectiveId),
        status: raw.status,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id)
    )
  }

  static toPrisma(
    objectiveInvite: ObjectiveInvite
  ): Prisma.ObjectiveInviteUncheckedCreateInput {
    return {
      id: objectiveInvite.id.toString(),
      collaboratorId: objectiveInvite.collaboratorId.toString(),
      objectiveId: objectiveInvite.objectiveId.toString(),
      status: objectiveInvite.status,
      createdAt: objectiveInvite.createdAt,
      updatedAt: objectiveInvite.updatedAt,
    }
  }
}
