import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ObjectiveRepository } from '../../_repositories/objective-repository'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { UncanceledStatusObjectiveUseCaseResponse } from '../response/uncanceled-status-objective-response'
import { UncanceledStatusObjectiveUseCaseRequest } from '../request/uncanceled-status-objective-request'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UncanceledStatusObjectiveUseCase {
  constructor(private objectiveRepository: ObjectiveRepository) {}

  async execute({
    objectiveId,
    authorId,
  }: UncanceledStatusObjectiveUseCaseRequest): Promise<UncanceledStatusObjectiveUseCaseResponse> {
    const objective = await this.objectiveRepository.findById(objectiveId)

    if (!objective) {
      return left(new ResourceNotFoundError())
    }

    if (objective.authorId.toString() !== authorId) {
      return left(new UnauthorizedError())
    }

    objective.status = 'PENDING'

    await this.objectiveRepository.save(objective)

    return right(null)
  }
}
