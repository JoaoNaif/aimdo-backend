import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { ObjectiveInviteCreatedEvent } from '../events/objective-invite-created-event'
import { ObjectiveInviteUpatedEvent } from '../events/objective-invite-updated-event'

export interface ObjectiveInviteProps {
  objectiveId: UniqueEntityId
  collaboratorId: UniqueEntityId
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  createdAt: Date
  updatedAt?: Date | null
}

export class ObjectiveInvite extends AggregateRoot<ObjectiveInviteProps> {
  get objectiveId() {
    return this.props.objectiveId
  }

  get collaboratorId() {
    return this.props.collaboratorId
  }

  get status() {
    return this.props.status
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  set status(status: 'PENDING' | 'ACCEPTED' | 'REJECTED') {
    if (this.props.status === 'PENDING') {
      this.addDomainEvent(new ObjectiveInviteUpatedEvent(this))
    }

    this.props.status = status
  }

  set updatedAt(updatedAt: Date | null | undefined) {
    this.props.updatedAt = updatedAt
  }

  static create(
    props: Optional<ObjectiveInviteProps, 'createdAt'>,
    id?: UniqueEntityId
  ) {
    const objectiveInvite = new ObjectiveInvite(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )

    const isNewObjectiveInvite = !id

    if (isNewObjectiveInvite) {
      objectiveInvite.addDomainEvent(
        new ObjectiveInviteCreatedEvent(objectiveInvite)
      )
    }

    return objectiveInvite
  }
}
