import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ObjectiveRepository } from '../../_repositories/objective-repository'
import { AddCollalboratorsObjectiveUseCaseResponse } from '../response/add-collaborators-objective-response'
import { AddCollalboratorsObjectiveUseCaseRequest } from '../request/add-collaborators-objective-request'
import { CollaboratorAlreadyExistError } from '../errors/collaborator-already-exist-error'
import { ObjectiveInviteRepository } from '../../_repositories/objective-invite-repository'
import { InviteNotPedingError } from '../errors/invite-not-pending-error'
import { UserRepository } from '../../_repositories/user-repository'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AddCollaboratorsObjectiveUseCase {
  constructor(
    private objectiveRepository: ObjectiveRepository,
    private userRepository: UserRepository,
    private objectiveInviteRepository: ObjectiveInviteRepository
  ) {}

  async execute({
    inviteId,
  }: AddCollalboratorsObjectiveUseCaseRequest): Promise<AddCollalboratorsObjectiveUseCaseResponse> {
    const invite = await this.objectiveInviteRepository.findById(inviteId)

    if (!invite) {
      return left(new ResourceNotFoundError())
    }

    if (invite.status !== 'PENDING') {
      throw new InviteNotPedingError()
    }

    invite.status = 'ACCEPTED'
    invite.updatedAt = new Date()
    await this.objectiveInviteRepository.save(invite)

    const objective = await this.objectiveRepository.findById(
      invite.objectiveId.toString()
    )

    if (!objective) {
      return left(new ResourceNotFoundError())
    }

    const collaborator = await this.userRepository.findById(
      invite.collaboratorId.toString()
    )
    if (!collaborator) {
      return left(new ResourceNotFoundError())
    }

    const collaboratorExist = objective.collaborators.find(
      (i) => i.id === collaborator.id
    )

    if (collaboratorExist) {
      return left(new CollaboratorAlreadyExistError())
    }

    objective.collaborators.push(collaborator)

    await this.objectiveRepository.save(objective)

    return right(null)
  }
}
