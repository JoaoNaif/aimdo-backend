import { Collaborator } from '@/core/types/collaborator'

export class CollaboratorPresenter {
  static toHTTP(collaborator: Collaborator) {
    return {
      id: collaborator.collaboratorId.toString(),
      name: collaborator.name,
      email: collaborator.email,
    }
  }
}
