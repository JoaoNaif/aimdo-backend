import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Objective } from '@/domain/enterprise/entities/objective'
import { Prisma, Objective as PrismaObjective } from '@prisma/client'

export class PrismaObjectiveMapper {
  static toDomain(raw: PrismaObjective): Objective {
    return Objective.create(
      {
        title: raw.title,
        description: raw.description,
        category: raw.category,
        urgency: raw.urgency,
        status: raw.status,
        dueDate: raw.dueDate,
        completedDate: raw.completedDate,
        createdAt: raw.createdAt,
        authorId: new UniqueEntityId(raw.authorId),
      },
      new UniqueEntityId(raw.id)
    )
  }

  static toPrisma(objective: Objective): Prisma.ObjectiveUncheckedCreateInput {
    return {
      id: objective.id.toString(),
      title: objective.title,
      description: objective.description,
      category: objective.category,
      urgency: objective.urgency,
      status: objective.status,
      authorId: objective.authorId.toString(),
      dueDate: objective.dueDate,
      completedDate: objective.completedDate,
      collaborators: {
        connect:
          objective.collaborators.map((collaborator) => ({
            id: collaborator.id.toString(),
          })) || [],
      },
      createdAt: objective.createdAt,
    }
  }
}
