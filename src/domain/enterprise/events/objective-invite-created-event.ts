import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { ObjectiveInvite } from '../entities/objective-invite'

export class ObjectiveInviteCreatedEvent implements DomainEvent {
  public ocurredAt: Date
  public objectiveInvite: ObjectiveInvite

  constructor(objectiveInvite: ObjectiveInvite) {
    this.objectiveInvite = objectiveInvite
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityId {
    return this.objectiveInvite.id
  }
}
