import { Injectable } from '@nestjs/common'
import { ObjectiveInviteRepository } from '../../_repositories/objective-invite-repository'
import { FetchObjectiveInviteUseCaseRequest } from '../request/fetch-objective-invite-request'
import { FetchObjectiveInviteUseCaseResponse } from '../response/fetch-objective-invite-response'
import { right } from '@/core/either'

@Injectable()
export class FetchObjectiveInviteUseCase {
  constructor(private objectiveInviteRepository: ObjectiveInviteRepository) {}

  async execute({
    collaboratorId,
  }: FetchObjectiveInviteUseCaseRequest): Promise<FetchObjectiveInviteUseCaseResponse> {
    const invites =
      await this.objectiveInviteRepository.findManyInvites(collaboratorId)

    return right({
      invites,
    })
  }
}
