import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ObjectiveRepository } from '../../_repositories/objective-repository'
import { RemoveCollaboratorObjectiveUseCaseRequest } from '../request/remove-collaborator-objective-request'
import { RemoveCollaboratorObjectiveUseCaseResponse } from '../response/remove-collaborator-objective-response'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { Injectable } from '@nestjs/common'
import { UserRepository } from '../../_repositories/user-repository'

@Injectable()
export class RemoveCollaboratorObjectiveUseCase {
  constructor(
    private objectiveRepository: ObjectiveRepository,
    private userRepository: UserRepository
  ) {}

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

    const collaborator = await this.userRepository.findById(collaboratorId)

    if (!collaborator) {
      return left(new ResourceNotFoundError())
    }

    await this.objectiveRepository.deleteCollaborator(
      objective.id.toString(),
      collaborator.id.toString()
    )

    return right(null)
  }
}
