import { left, right } from '@/core/either'
import { ObjectiveRepository } from '../../_repositories/objective-repository'
import { FetchObjectivesUseCaseRequest } from '../request/fetch-objectives-request'
import { FetchObjectivesUseCaseResponse } from '../response/fetch-objectives-response'
import { DTOFetchObjectivesResponse } from '../dtos/dto-fetch-objectives-response'
import { UserRepository } from '../../_repositories/user-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FetchObjectivesUseCase {
  constructor(
    private objectiveRepository: ObjectiveRepository,
    private userRepository: UserRepository
  ) {}

  async execute({
    authorId,
    page,
  }: FetchObjectivesUseCaseRequest): Promise<FetchObjectivesUseCaseResponse> {
    const user = await this.userRepository.findById(authorId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    const objective = await this.objectiveRepository.findManyObjectives(
      user.id.toString(),
      { page }
    )

    const objectives: DTOFetchObjectivesResponse[] = objective.map((obj) => ({
      id: obj.id.toString(),
      title: obj.title,
      category: obj.category,
      status: obj.status,
      urgency: obj.urgency,
      dueDate: obj.dueDate,
      createdAt: obj.createdAt,
    }))

    return right({
      objectives,
    })
  }
}
