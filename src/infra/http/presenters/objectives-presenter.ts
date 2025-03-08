import { DTOFetchObjectivesResponse } from '@/domain/application/main/Objective/dtos/dto-fetch-objectives-response'

export class ObjectivesPresenter {
  static toHTTP(objectives: DTOFetchObjectivesResponse) {
    return {
      id: objectives.id.toString(),
      title: objectives.title,
      urgency: objectives.urgency,
      status: objectives.status,
      category: objectives.category,
      createdAt: objectives.createdAt,
    }
  }
}
