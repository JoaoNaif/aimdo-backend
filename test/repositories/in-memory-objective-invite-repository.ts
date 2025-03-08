import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DomainEvents } from '@/core/events/domain-events'
import { ObjectiveInviteRepository } from '@/domain/application/main/_repositories/objective-invite-repository'
import { ObjectiveInvite } from '@/domain/enterprise/entities/objective-invite'
import {
  Invites,
  InvitesProps,
} from '@/domain/enterprise/entities/value-objects/invites'

export class InMemoryObjectiveInviteRepository
  implements ObjectiveInviteRepository
{
  public items: ObjectiveInvite[] = []

  async findById(id: string): Promise<ObjectiveInvite | null> {
    const objectiveInvite = this.items.find((item) => item.id.toString() === id)

    if (!objectiveInvite) {
      return null
    }

    return objectiveInvite
  }

  async findPendingInvite(
    objectiveId: string,
    collaboratorId: string
  ): Promise<ObjectiveInvite | null> {
    const objectiveInvite = this.items.find(
      (item) =>
        item.objectiveId.toString() === objectiveId &&
        item.collaboratorId.toString() === collaboratorId &&
        item.status === 'PENDING'
    )

    if (!objectiveInvite) {
      return null
    }

    return objectiveInvite
  }

  async findManyInvites(collaboratorId: string): Promise<Invites[]> {
    const invitesDomain = this.items
      .filter(
        (invite) =>
          invite.collaboratorId.toString() === collaboratorId &&
          invite.status === 'PENDING'
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    const invites: Invites[] = invitesDomain.map((invite) =>
      Invites.create({
        objectiveId: invite.objectiveId,
        collaboratorId: invite.collaboratorId,
        objective: {
          title: 'test description mock',
          description: 'Test description mock',
        },
        status: invite.status,
        createdAt: invite.createdAt,
        updatedAt: invite.updatedAt ?? null,
      })
    )

    return invites
  }

  async create(objectiveInvite: ObjectiveInvite): Promise<void> {
    this.items.push(objectiveInvite)

    DomainEvents.dispatchEventsForAggregate(objectiveInvite.id)
  }

  async save(objectiveInvite: ObjectiveInvite): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === objectiveInvite.id
    )

    this.items[itemIndex] = objectiveInvite

    DomainEvents.dispatchEventsForAggregate(objectiveInvite.id)
  }

  async delete(objectiveInvite: ObjectiveInvite): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === objectiveInvite.id
    )

    this.items.splice(itemIndex, 1)
  }
}
