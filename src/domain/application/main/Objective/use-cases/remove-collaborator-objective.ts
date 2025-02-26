import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ObjectiveRepository } from '../../_repositories/objective-repository'
import { RemoveCollaboratorObjectiveUseCaseRequest } from '../request/remove-collaborator-objective-request'
import { RemoveCollaboratorObjectiveUseCaseResponse } from '../response/remove-collaborator-objective-response'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { Injectable } from '@nestjs/common'

@Injectable()
export class RemoveCollaboratorObjectiveUseCase {
  constructor(private objectiveRepository: ObjectiveRepository) {}

  async execute({
    objectiveId,
    authorId,
    collaboratorId,
  }: RemoveCollaboratorObjectiveUseCaseRequest): Promise<RemoveCollaboratorObjectiveUseCaseResponse> {
    const objective = await this.objectiveRepository.findById(objectiveId)

    if (!objective) {
      return left(new ResourceNotFoundError())
    }

    if (objective.authorId.toString() !== authorId) {
      return left(new UnauthorizedError())
    }

    const collaboratorIndex = objective.collaborators.findIndex(
      (item) => item.id.toString() === collaboratorId
    )

    objective.collaborators.splice(collaboratorIndex, 1)

    await this.objectiveRepository.save(objective)

    return right(null)
  }
}
