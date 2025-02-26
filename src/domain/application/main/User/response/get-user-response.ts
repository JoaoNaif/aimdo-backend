import { Either } from '@/core/either'
import { EmailAlreadyExistError } from '../errors/user-email-already-exist-error'
import { User } from '@/domain/enterprise/entities/user'
import { UsernameAlreadyExistError } from '../errors/user-username-already.exist'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

export type GetUserUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    user: DTOGetUserResponse
  }
>
