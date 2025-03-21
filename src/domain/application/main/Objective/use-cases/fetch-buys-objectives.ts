import { right } from '@/core/either'
import { ObjectiveRepository } from '../../_repositories/objective-repository'
import { DTOFetchObjectivesResponse } from '../dtos/dto-fetch-objectives-response'
import { FetchBuysObjectivesUseCaseRequest } from '../request/fetch-buys-objectives-request'
import { FetchBuysObjectivesUseCaseResponse } from '../response/fetch-buys-objectives-response'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FetchBuysObjectivesUseCase {
  constructor(private objectiveRepository: ObjectiveRepository) {}

  async execute({
    authorId,
    page,
  }: FetchBuysObjectivesUseCaseRequest): Promise<FetchBuysObjectivesUseCaseResponse> {
    const objectives = await this.objectiveRepository.findManyBuys(authorId, {
      page,
    })

    console.log('antes do dto: ', objectives)

    objectives.forEach((obj) => {
      console.log('ID:', obj.id)
      console.log('Title:', obj.title)
      console.log('Category:', obj.category)
      console.log('Status:', obj.status)
      console.log('Urgency:', obj.urgency)
      console.log('Due Date:', obj.dueDate)
      console.log('Created At:', obj.createdAt)
    })

    const buys: DTOFetchObjectivesResponse[] = objectives.map((obj) => ({
      id: obj.id.toString(),
      title: obj.title,
      category: obj.category,
      status: obj.status,
      urgency: obj.urgency,
      dueDate: obj.dueDate,
      createdAt: obj.createdAt,
    }))

    console.log('depois do dto', buys)

    return right({
      buys,
    })
  }
}
