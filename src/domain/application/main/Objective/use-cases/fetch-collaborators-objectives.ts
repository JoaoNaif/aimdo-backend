import { left, right } from '@/core/either'
import { ObjectiveRepository } from '../../_repositories/objective-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { FetchCollaboratorsObjectivesUseCaseRequest } from '../request/fetch-collaborators-objectives-request'
import { FetchCollaboratorsObjectivesUseCaseResponse } from '../response/fetch-collaborators-objectives'
import { Collaborator } from '@/core/types/collaborator'

export class FetchCollaboratorsObjectivesUseCase {
  constructor(private objectiveRepository: ObjectiveRepository) {}

  async execute({
    objectiveId,
    page,
  }: FetchCollaboratorsObjectivesUseCaseRequest): Promise<FetchCollaboratorsObjectivesUseCaseResponse> {
    const objective = await this.objectiveRepository.findById(objectiveId)

    if (!objective) {
      return left(new ResourceNotFoundError())
    }

    const users = await this.objectiveRepository.findManyCollaborators(
      objective.collaborators,
      { page }
    )

    const collaborators: Collaborator[] = users.map((i) => ({
      collaboratorId: i.id,
      email: i.email,
      name: i.name,
    }))

    return right({
      collaborators,
    })
  }
}
