import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CollaboratorAlreadyExistError } from '../errors/collaborator-already-exist-error'
import { InviteNotPedingError } from '../errors/invite-not-pending-error'

export type AddCollalboratorsObjectiveUseCaseResponse = Either<
  ResourceNotFoundError | InviteNotPedingError | CollaboratorAlreadyExistError,
  null
>
