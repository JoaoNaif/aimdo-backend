import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ObjectiveRepository } from '../../_repositories/objective-repository'
import { DeleteObjectiveUseCaseResponse } from '../response/delete-objective-response'
import { DeleteObjectiveUseCaseRequest } from '../request/delete-objective-request'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { Injectable } from '@nestjs/common'

@Injectable()
export class DeleteObjectiveUseCase {
  constructor(private objectiveRepository: ObjectiveRepository) {}

  async execute({
    objectiveId,
    authorId,
  }: DeleteObjectiveUseCaseRequest): Promise<DeleteObjectiveUseCaseResponse> {
    const objective = await this.objectiveRepository.findById(objectiveId)

    if (!objective) {
      return left(new ResourceNotFoundError())
    }

    if (objective.authorId.toString() !== authorId) {
      return left(new UnauthorizedError())
    }

    await this.objectiveRepository.delete(objective)

    return right(null)
  }
}
