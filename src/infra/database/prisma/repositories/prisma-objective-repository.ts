import { PaginationParams } from '@/core/repository/pagination-params'
import { ObjectiveRepository } from '@/domain/application/main/_repositories/objective-repository'
import { Objective } from '@/domain/enterprise/entities/objective'
import { User } from '@/domain/enterprise/entities/user'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaObjectiveMapper } from '../mappers/prisma-objective-mapper'
import { PrismaUserMapper } from '../mappers/prisma-user-mapper'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { DTOFetchObjectivesResponse } from '@/domain/application/main/Objective/dtos/dto-fetch-objectives-response'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

@Injectable()
export class PrismaObjectiveRepository implements ObjectiveRepository {
  constructor(
    private prisma: PrismaService,
    private cache: CacheRepository
  ) {}

  async findById(id: string): Promise<Objective | null> {
    const objective = await this.prisma.objective.findUnique({
      where: {
        id,
      },
    })

    if (!objective) {
      return null
    }

    return PrismaObjectiveMapper.toDomain(objective)
  }

  async findManyObjectives(
    authorId: string,
    { page }: PaginationParams
  ): Promise<Objective[]> {
    const objectives = await this.prisma.objective.findMany({
      where: {
        authorId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return objectives.map(PrismaObjectiveMapper.toDomain)
  }

  async findManyCollaborators(
    objectiveId: string,
    { page }: PaginationParams
  ): Promise<User[]> {
    const objectiveWithCollaborator = await this.prisma.objective.findUnique({
      where: { id: objectiveId },
      include: { collaborators: true },
    })

    if (!objectiveWithCollaborator) {
      return []
    }

    const collaborators = objectiveWithCollaborator.collaborators
      .sort()
      .slice((page - 1) * 20, page * 20)

    return collaborators.map(PrismaUserMapper.toDomain)
  }

  async deleteCollaborator(
    objectiveId: string,
    collaboratorId: string
  ): Promise<void> {
    const objective = await this.prisma.objective.findUnique({
      where: { id: objectiveId },
      include: { collaborators: true },
    })

    if (!objective) {
      return
    }

    await this.prisma.objective.update({
      where: { id: objectiveId },
      data: {
        collaborators: {
          disconnect: { id: collaboratorId },
        },
      },
    })
  }

  async findManyTasks(
    authorId: string,
    { page }: PaginationParams
  ): Promise<Objective[]> {
    const cacheKey = `objectives:authorId:${authorId}:category:TASK:page:${page}`

    const cacheHit = await this.cache.get(cacheKey)

    if (cacheHit) {
      const cacheData = JSON.parse(cacheHit)

      return cacheData.map((i) =>
        Objective.create(
          {
            title: i.props.title,
            description: i.props.description,
            category: i.props.category,
            urgency: i.props.urgency,
            status: i.props.status,
            dueDate: i.props.dueDate ? new Date(i.props.dueDate) : null,
            completedDate: i.props.completedDate
              ? new Date(i.props.completedDate)
              : null,
            createdAt: new Date(i.props.createdAt),
            authorId: new UniqueEntityId(i.props.authorId.value),
            collaborators: i.props.collaborators ?? [],
          },
          new UniqueEntityId(i._id.value)
        )
      )
    }

    const tasks = await this.prisma.objective.findMany({
      where: {
        authorId,
        category: 'TASK',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    const domainTask = tasks.map(PrismaObjectiveMapper.toDomain)

    await this.cache.set(cacheKey, JSON.stringify(domainTask))

    return domainTask
  }

  async findManyGoals(
    authorId: string,
    { page }: PaginationParams
  ): Promise<Objective[]> {
    const cacheKey = `objectives:authorId:${authorId}:category:GOAL:page:${page}`

    const cacheHit = await this.cache.get(cacheKey)

    if (cacheHit) {
      const cacheData = JSON.parse(cacheHit)

      return cacheData.map((i) =>
        Objective.create(
          {
            title: i.props.title,
            description: i.props.description,
            category: i.props.category,
            urgency: i.props.urgency,
            status: i.props.status,
            dueDate: i.props.dueDate ? new Date(i.props.dueDate) : null,
            completedDate: i.props.completedDate
              ? new Date(i.props.completedDate)
              : null,
            createdAt: new Date(i.props.createdAt),
            authorId: new UniqueEntityId(i.props.authorId.value),
            collaborators: i.props.collaborators ?? [],
          },
          new UniqueEntityId(i._id.value)
        )
      )
    }

    const goals = await this.prisma.objective.findMany({
      where: {
        authorId,
        category: 'GOAL',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    const domainGoal = goals.map(PrismaObjectiveMapper.toDomain)

    await this.cache.set(cacheKey, JSON.stringify(domainGoal))

    return domainGoal
  }

  async findManyBuys(
    authorId: string,
    { page }: PaginationParams
  ): Promise<Objective[]> {
    const cacheKey = `objectives:authorId:${authorId}:category:BUY:page:${page}`

    const cacheHit = await this.cache.get(cacheKey)

    if (cacheHit) {
      const cacheData = JSON.parse(cacheHit)

      return cacheData.map((i) =>
        Objective.create(
          {
            title: i.props.title,
            description: i.props.description,
            category: i.props.category,
            urgency: i.props.urgency,
            status: i.props.status,
            dueDate: i.props.dueDate ? new Date(i.props.dueDate) : null,
            completedDate: i.props.completedDate
              ? new Date(i.props.completedDate)
              : null,
            createdAt: new Date(i.props.createdAt),
            authorId: new UniqueEntityId(i.props.authorId.value),
            collaborators: i.props.collaborators ?? [],
          },
          new UniqueEntityId(i._id.value)
        )
      )
    }

    const buys = await this.prisma.objective.findMany({
      where: {
        authorId,
        category: 'BUY',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    const domainBuys = buys.map(PrismaObjectiveMapper.toDomain)

    await this.cache.set(cacheKey, JSON.stringify(domainBuys))

    return domainBuys
  }

  async create(objective: Objective): Promise<void> {
    const data = PrismaObjectiveMapper.toPrisma(objective)

    await this.prisma.objective.create({
      data,
    })

    await this.cache.deleteMany(
      `objectives:authorId:${objective.authorId}:category:${objective.category}:*`
    )
  }
  async save(objective: Objective): Promise<void> {
    const data = PrismaObjectiveMapper.toPrisma(objective)

    await this.prisma.objective.update({
      where: {
        id: data.id,
      },
      data,
    })

    await this.cache.deleteMany(
      `objectives:authorId:${objective.authorId}:category:${objective.category}:*`
    )
  }

  async delete(objective: Objective): Promise<void> {
    await this.prisma.objective.delete({
      where: {
        id: objective.id.toString(),
      },
    })
  }
}
