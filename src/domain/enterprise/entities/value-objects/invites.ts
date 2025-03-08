import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

interface ObjectiveResponse {
  title: string
  description: string
}

export interface InvitesProps {
  id: UniqueEntityId
  objectiveId: UniqueEntityId
  collaboratorId: UniqueEntityId
  objective: ObjectiveResponse
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  createdAt: Date
  updatedAt?: Date | null
}

export class Invites extends ValueObject<InvitesProps> {
  get id() {
    return this.props.id
  }

  get objectiveId() {
    return this.props.objectiveId
  }

  get collaboratorId() {
    return this.props.collaboratorId
  }

  get objective() {
    return this.props.objective
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

  static create(props: InvitesProps) {
    return new Invites(props)
  }
}
