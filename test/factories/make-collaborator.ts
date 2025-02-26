import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Collaborator } from '@/core/types/collaborator'
import { faker } from '@faker-js/faker'

export function makeCollaborator(override: Partial<Collaborator> = {}) {
  const collaborator: Collaborator = {
    collaboratorId: new UniqueEntityId(faker.lorem.paragraph()),
    email: faker.internet.email(),
    name: faker.internet.username(),
  }

  return collaborator
}
