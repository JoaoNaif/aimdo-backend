import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { User } from './user'

export interface ObjectiveProps {
  title: string
  description: string
  authorId: UniqueEntityId
  urgency: 'HIGH' | 'MEDIUM' | 'LOW'
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED'
  category: 'TASK' | 'BUY' | 'GOAL'
  collaborators: User[]
  dueDate?: Date | null
  completedDate?: Date | null
  createdAt: Date
}

export class Objective extends Entity<ObjectiveProps> {
  get title() {
    return this.props.title
  }

  get description() {
    return this.props.description
  }

  get authorId() {
    return this.props.authorId
  }

  get urgency() {
    return this.props.urgency
  }

  get category() {
    return this.props.category
  }

  get status() {
    return this.props.status
  }

  get collaborators() {
    return this.props.collaborators
  }

  get dueDate() {
    return this.props.dueDate
  }

  get completedDate() {
    return this.props.completedDate
  }

  get createdAt() {
    return this.props.createdAt
  }

  set title(title: string) {
    this.props.title = title
  }

  set description(description: string) {
    this.props.description = description
  }

  set urgency(urgency: 'HIGH' | 'MEDIUM' | 'LOW') {
    this.props.urgency = urgency
  }

  set status(status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED') {
    this.props.status = status
  }

  set category(category: 'TASK' | 'BUY' | 'GOAL') {
    this.props.category = category
  }

  set completedDate(completedDate: Date | null | undefined) {
    this.props.completedDate = completedDate
  }

  static create(
    props: Optional<ObjectiveProps, 'createdAt' | 'status' | 'collaborators'>,
    id?: UniqueEntityId
  ) {
    const objective = new Objective(
      {
        ...props,
        collaborators: props.collaborators ?? [],
        status: props.status ?? 'PENDING',
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )

    return objective
  }
}
