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

    const buys: DTOFetchObjectivesResponse[] = objectives.map((obj) => ({
      id: obj.id,
      title: obj.title,
      category: obj.category,
      status: obj.status,
      urgency: obj.urgency,
      createdAt: obj.createdAt,
    }))

    return right({
      buys,
    })
  }
}
