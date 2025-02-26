import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ObjectiveRepository } from '../../_repositories/objective-repository'
import { ChangeStatusObjectiveUseCaseResponse } from '../response/change-status-objective-response'
import { ChangeStatusObjectiveUseCaseRequest } from '../request/change-status-objective-request'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ChangeStatusObjectiveUseCase {
  constructor(private objectiveRepository: ObjectiveRepository) {}

  async execute({
    objectiveId,
    authorId,
  }: ChangeStatusObjectiveUseCaseRequest): Promise<ChangeStatusObjectiveUseCaseResponse> {
    const objective = await this.objectiveRepository.findById(objectiveId)

    if (!objective) {
      return left(new ResourceNotFoundError())
    }

    if (objective.authorId.toString() !== authorId) {
      return left(new UnauthorizedError())
    }

    if (objective.status === 'PENDING') {
      objective.status = 'IN_PROGRESS'

      await this.objectiveRepository.save(objective)

      const update = await this.objectiveRepository.findById(
        objective.id.toString()
      )

      //  console.log(update)

      return right(null)
    }

    if (objective.status === 'IN_PROGRESS') {
      objective.status = 'COMPLETED'
      objective.completedDate = new Date()

      await this.objectiveRepository.save(objective)
    }

    return right(null)
  }
}
