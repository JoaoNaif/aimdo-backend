import { ObjectiveInviteRepository } from '@/domain/application/main/_repositories/objective-invite-repository'
import { ObjectiveInvite } from '@/domain/enterprise/entities/objective-invite'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaObjectiveInviteMapper } from '../mappers/prisma-objective-invite-mapper'
import { DomainEvents } from '@/core/events/domain-events'
import { PrismaInvitesMapper } from '../mappers/prisma-invites-mapper'
import { Invites } from '@/domain/enterprise/entities/value-objects/invites'

@Injectable()
export class PrismaObjectiveInviteRepository
  implements ObjectiveInviteRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<ObjectiveInvite | null> {
    const objectiveInvite = await this.prisma.objectiveInvite.findUnique({
      where: {
        id,
      },
    })

    if (!objectiveInvite) {
      return null
    }

    return PrismaObjectiveInviteMapper.toDomain(objectiveInvite)
  }

  async findPendingInvite(
    objectiveId: string,
    collaboratorId: string
  ): Promise<ObjectiveInvite | null> {
    const objectiveInvite = await this.prisma.objectiveInvite.findFirst({
      where: {
        objectiveId,
        collaboratorId,
        status: 'PENDING',
      },
    })

    if (!objectiveInvite) {
      return null
    }

    return PrismaObjectiveInviteMapper.toDomain(objectiveInvite)
  }

  async findManyInvites(collaboratorId: string): Promise<Invites[]> {
    const invites = await this.prisma.objectiveInvite.findMany({
      where: {
        collaboratorId,
        status: 'PENDING',
      },
      include: {
        objective: true,
      },
    })

    return invites.map(PrismaInvitesMapper.toDomain)
  }

  async create(objectiveInvite: ObjectiveInvite): Promise<void> {
    const data = PrismaObjectiveInviteMapper.toPrisma(objectiveInvite)

    await this.prisma.objectiveInvite.create({
      data,
    })

    DomainEvents.dispatchEventsForAggregate(objectiveInvite.id)
  }

  async save(objectiveInvite: ObjectiveInvite): Promise<void> {
    const data = PrismaObjectiveInviteMapper.toPrisma(objectiveInvite)

    await this.prisma.objectiveInvite.update({
      where: {
        id: data.id,
      },
      data,
    })

    DomainEvents.dispatchEventsForAggregate(objectiveInvite.id)
  }

  async delete(objectiveInvite: ObjectiveInvite): Promise<void> {
    await this.prisma.objectiveInvite.delete({
      where: {
        id: objectiveInvite.id.toString(),
      },
    })
  }
}
