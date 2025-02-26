import { UniqueEntityId } from '../entities/unique-entity-id'

export interface Collaborator {
  collaboratorId: UniqueEntityId
  name: string
  email: string
}
