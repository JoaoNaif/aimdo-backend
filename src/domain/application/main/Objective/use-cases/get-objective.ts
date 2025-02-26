import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ObjectiveRepository } from '../../_repositories/objective-repository'
import { GetObjectiveUseCaseRequest } from '../request/get-objective-request'
import { GetObjectiveUseCaseResponse } from '../response/get-objective-response'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GetObjectiveUseCase {
  constructor(private objectiveRepository: ObjectiveRepository) {}

  async execute({
    objectiveId,
  }: GetObjectiveUseCaseRequest): Promise<GetObjectiveUseCaseResponse> {
    const objective = await this.objectiveRepository.findById(objectiveId)

    if (!objective) {
      return left(new ResourceNotFoundError())
    }

    return right({
      objective,
    })
  }
}
