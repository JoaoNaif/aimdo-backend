import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Invites } from '@/domain/enterprise/entities/value-objects/invites'
import {
  ObjectiveInvite as PrismaObjectiveInvite,
  Objective as PrismaObjective,
} from '@prisma/client'

type PrismaInvites = PrismaObjectiveInvite & {
  objective: PrismaObjective
}

export class PrismaInvitesMapper {
  static toDomain(raw: PrismaInvites): Invites {
    return Invites.create({
      id: new UniqueEntityId(raw.id),
      collaboratorId: new UniqueEntityId(raw.collaboratorId),
      objectiveId: new UniqueEntityId(raw.objectiveId),
      objective: {
        title: raw.objective.title,
        description: raw.objective.description,
      },
      status: raw.status,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
