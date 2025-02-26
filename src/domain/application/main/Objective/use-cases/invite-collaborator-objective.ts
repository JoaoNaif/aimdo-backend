import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ObjectiveRepository } from '../../_repositories/objective-repository'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { InviteCollaboratorObjectiveUseCaseRequest } from '../request/invite-collaborator-objective-request'
import { InviteCollaboratorObjectiveUseCaseResponse } from '../response/invite-collaborator-objective-response'
import { UserRepository } from '../../_repositories/user-repository'
import { ObjectiveInviteRepository } from '../../_repositories/objective-invite-repository'
import { ObjectiveInviteAlreadyExistError } from '../errors/objective-invite-already-exist-error'
import { ObjectiveInvite } from '@/domain/enterprise/entities/objective-invite'
import { Injectable } from '@nestjs/common'

@Injectable()
export class InviteCollaboratorObjectiveUseCase {
  constructor(
    private objectiveRepository: ObjectiveRepository,
    private userRepository: UserRepository,
    private objectiveInviteRepository: ObjectiveInviteRepository
  ) {}

  async execute({
    objectiveId,
    authorId,
    collaboratorId,
  }: InviteCollaboratorObjectiveUseCaseRequest): Promise<InviteCollaboratorObjectiveUseCaseResponse> {
    const objective = await this.objectiveRepository.findById(objectiveId)

    if (!objective) {
      return left(new ResourceNotFoundError())
    }

    const collaborator = await this.userRepository.findById(collaboratorId)

    if (!collaborator) {
      return left(new ResourceNotFoundError())
    }

    if (objective.authorId.toString() !== authorId) {
      return left(new UnauthorizedError())
    }

    const existInvite = await this.objectiveInviteRepository.findPendingInvite(
      objective.id.toString(),
      collaborator.id.toString()
    )

    if (existInvite) {
      return left(new ObjectiveInviteAlreadyExistError())
    }

    const invite = ObjectiveInvite.create({
      objectiveId: objective.id,
      collaboratorId: collaborator.id,
      status: 'PENDING',
    })

    await this.objectiveInviteRepository.create(invite)

    return right({
      invite,
    })
  }
}
