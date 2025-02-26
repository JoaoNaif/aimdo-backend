import { DomainEvents } from '@/core/events/domain-events'
import { ObjectiveInviteRepository } from '@/domain/application/main/_repositories/objective-invite-repository'
import { ObjectiveInvite } from '@/domain/enterprise/entities/objective-invite'

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
