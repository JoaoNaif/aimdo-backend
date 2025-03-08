import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { ObjectiveInviteAlreadyExistError } from '../errors/objective-invite-already-exist-error'
import { ObjectiveInvite } from '@/domain/enterprise/entities/objective-invite'
import { CollaboratorAlreadyAcceptInviteError } from '../errors/collaborator-already-accepted-invite-error'

export type InviteCollaboratorObjectiveUseCaseResponse = Either<
  | ResourceNotFoundError
  | UnauthorizedError
  | ObjectiveInviteAlreadyExistError
  | CollaboratorAlreadyAcceptInviteError,
  {
    invite: ObjectiveInvite
  }
>
