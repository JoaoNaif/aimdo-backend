import { Invites } from '@/domain/enterprise/entities/value-objects/invites'

export class InivitePresenter {
  static toHTTP(invites: Invites) {
    return {
      id: invites.id.toString(),
      objectiveId: invites.objectiveId.toString(),
      collaboratorId: invites.collaboratorId.toString(),
      objective: {
        title: invites.objective.title,
        description: invites.objective.description,
      },
      status: invites.status,
      createdAt: invites.createdAt,
      updatedAt: invites.updatedAt,
    }
  }
}
