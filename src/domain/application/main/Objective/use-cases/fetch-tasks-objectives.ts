import { right } from '@/core/either'
import { ObjectiveRepository } from '../../_repositories/objective-repository'
import { FetchTasksObjectivesUseCaseResponse } from '../response/fetch-tasks-objectives-response'
import { DTOFetchObjectivesResponse } from '../dtos/dto-fetch-objectives-response'
import { FetchTasksObjectivesUseCaseRequest } from '../request/fetch-tasks-objectives-request'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FetchTasksObjectivesUseCase {
  constructor(private objectiveRepository: ObjectiveRepository) {}

  async execute({
    authorId,
    page,
  }: FetchTasksObjectivesUseCaseRequest): Promise<FetchTasksObjectivesUseCaseResponse> {
    const objectives = await this.objectiveRepository.findManyTasks(authorId, {
      page,
    })

    const tasks: DTOFetchObjectivesResponse[] = objectives.map((obj) => ({
      id: obj.id.toString(),
      title: obj.title,
      category: obj.category,
      status: obj.status,
      urgency: obj.urgency,
      dueDate: obj.dueDate,
      createdAt: obj.createdAt,
    }))

    return right({
      tasks,
    })
  }
}
