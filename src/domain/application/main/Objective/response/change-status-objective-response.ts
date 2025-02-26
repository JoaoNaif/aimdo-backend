import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'

export type ChangeStatusObjectiveUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  null
>
