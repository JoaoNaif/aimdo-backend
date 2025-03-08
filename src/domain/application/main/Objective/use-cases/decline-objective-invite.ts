import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { DeclineObjectiveInviteUseCaseRequest } from '../request/decline-objective-invite-request'
import { DeclineObjectiveInviteUseCaseResponse } from '../response/decline-objective-invite-response'
import { ObjectiveInviteRepository } from '../../_repositories/objective-invite-repository'
import { UserRepository } from '../../_repositories/user-repository'
import { Injectable } from '@nestjs/common'

@Injectable()
export class DeclineObjectiveInviteUseCase {
  constructor(
    private objectiveInviteRepository: ObjectiveInviteRepository,
    private userRepository: UserRepository
  ) {}

  async execute({
    objectiveInviteId,
    userId,
  }: DeclineObjectiveInviteUseCaseRequest): Promise<DeclineObjectiveInviteUseCaseResponse> {
    const objectiveInvite =
      await this.objectiveInviteRepository.findById(objectiveInviteId)

    if (!objectiveInvite) {
      return left(new ResourceNotFoundError())
    }

    const user = await this.userRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    if (objectiveInvite.collaboratorId.toString() !== user.id.toString()) {
      return left(new UnauthorizedError())
    }

    objectiveInvite.status = 'REJECTED'

    await this.objectiveInviteRepository.save(objectiveInvite)

    return right(null)
  }
}
