import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Collaborator } from '@/core/types/collaborator'

export type FetchCollaboratorsObjectivesUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    collaborators: Collaborator[]
  }
>
