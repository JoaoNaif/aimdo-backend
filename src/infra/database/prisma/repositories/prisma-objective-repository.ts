import { PaginationParams } from '@/core/repository/pagination-params'
import { ObjectiveRepository } from '@/domain/application/main/_repositories/objective-repository'
import { Objective } from '@/domain/enterprise/entities/objective'
import { User } from '@/domain/enterprise/entities/user'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaObjectiveMapper } from '../mappers/prisma-objective-mapper'

@Injectable()
export class PrismaObjectiveRepository implements ObjectiveRepository {
  constructor(private prisma: PrismaService) {}

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
    collaborators: User[],
    { page }: PaginationParams
  ): Promise<User[]> {
    return collaborators.sort().slice((page - 1) * 20, page * 20)
  }

  async findManyTasks(
    authorId: string,
    { page }: PaginationParams
  ): Promise<Objective[]> {
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

    return tasks.map(PrismaObjectiveMapper.toDomain)
  }

  async findManyGoals(
    authorId: string,
    { page }: PaginationParams
  ): Promise<Objective[]> {
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

    return goals.map(PrismaObjectiveMapper.toDomain)
  }

  async findManyBuys(
    authorId: string,
    { page }: PaginationParams
  ): Promise<Objective[]> {
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

    return buys.map(PrismaObjectiveMapper.toDomain)
  }

  async create(objective: Objective): Promise<void> {
    const data = PrismaObjectiveMapper.toPrisma(objective)

    await this.prisma.objective.create({
      data,
    })
  }
  async save(objective: Objective): Promise<void> {
    const data = PrismaObjectiveMapper.toPrisma(objective)

    await this.prisma.objective.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(objective: Objective): Promise<void> {
    await this.prisma.objective.delete({
      where: {
        id: objective.id.toString(),
      },
    })
  }
}
