import { right } from '@/core/either'
import { ObjectiveRepository } from '../../_repositories/objective-repository'
import { DTOFetchObjectivesResponse } from '../dtos/dto-fetch-objectives-response'
import { FetchGoalsObjectivesUseCaseResponse } from '../response/fetch-goals-objectives-response'
import { FetchGoalsObjectivesUseCaseRequest } from '../request/fetch-goals-objectives-request'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FetchGoalsObjectivesUseCase {
  constructor(private objectiveRepository: ObjectiveRepository) {}

  async execute({
    authorId,
    page,
  }: FetchGoalsObjectivesUseCaseRequest): Promise<FetchGoalsObjectivesUseCaseResponse> {
    const objectives = await this.objectiveRepository.findManyGoals(authorId, {
      page,
    })

    const goals: DTOFetchObjectivesResponse[] = objectives.map((obj) => ({
      id: obj.id,
      title: obj.title,
      category: obj.category,
      status: obj.status,
      urgency: obj.urgency,
      dueDate: obj.dueDate,
      createdAt: obj.createdAt,
    }))

    return right({
      goals,
    })
  }
}
