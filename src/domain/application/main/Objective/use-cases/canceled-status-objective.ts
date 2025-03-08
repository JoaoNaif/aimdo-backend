import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ObjectiveRepository } from '../../_repositories/objective-repository'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { CanceledStatusObjectiveUseCaseRequest } from '../request/canceled-staus-objective-request'
import { CanceledStatusObjectiveUseCaseResponse } from '../response/canceled-status-objective-response'
import { Injectable } from '@nestjs/common'

@Injectable()
export class CanceledStatusObjectiveUseCase {
  constructor(private objectiveRepository: ObjectiveRepository) {}

  async execute({
    objectiveId,
    authorId,
  }: CanceledStatusObjectiveUseCaseRequest): Promise<CanceledStatusObjectiveUseCaseResponse> {
    const objective = await this.objectiveRepository.findById(objectiveId)

    if (!objective) {
      return left(new ResourceNotFoundError())
    }

    if (objective.authorId.toString() !== authorId) {
      return left(new UnauthorizedError())
    }

    objective.status = 'CANCELED'

    await this.objectiveRepository.save(objective)

    return right(null)
  }
}
