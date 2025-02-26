import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Objective,
  ObjectiveProps,
} from '@/domain/enterprise/entities/objective'
import { PrismaObjectiveMapper } from '@/infra/database/prisma/mappers/prisma-objective-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeObjective(
  override: Partial<ObjectiveProps> = {},
  id?: UniqueEntityId
) {
  const objective = Objective.create(
    {
      title: faker.lorem.paragraph(),
      description: faker.lorem.paragraphs(),
      category: 'TASK',
      urgency: 'MEDIUM',
      authorId: new UniqueEntityId('objective-1'),
      ...override,
    },
    id
  )

  return objective
}

@Injectable()
export class ObjectiveFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaObjective(
    data: Partial<ObjectiveProps> = {}
  ): Promise<Objective> {
    const objective = makeObjective(data)

    await this.prisma.objective.create({
      data: PrismaObjectiveMapper.toPrisma(objective),
    })

    return objective
  }
}
