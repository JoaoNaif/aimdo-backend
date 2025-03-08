import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ObjectiveRepository } from '../../_repositories/objective-repository'
import { EditObjectiveUseCaseRequest } from '../request/edit-objective-request'
import { EditObjectiveUseCaseResponse } from '../response/edit-objective-response'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { Injectable } from '@nestjs/common'

@Injectable()
export class EditObjectiveUseCase {
  constructor(private objectiveRepository: ObjectiveRepository) {}

  async execute({
    objectiveId,
    authorId,
    category,
    description,
    title,
    urgency,
  }: EditObjectiveUseCaseRequest): Promise<EditObjectiveUseCaseResponse> {
    const objective = await this.objectiveRepository.findById(objectiveId)

    if (!objective) {
      return left(new ResourceNotFoundError())
    }

    if (objective.authorId.toString() !== authorId) {
      return left(new UnauthorizedError())
    }

    objective.title = title ?? objective.title
    objective.description = description ?? objective.description
    objective.urgency = urgency ?? objective.urgency
    objective.category = category ?? objective.category
    objective.status = 'IN_PROGRESS'

    await this.objectiveRepository.save(objective)

    return right(null)
  }
}
