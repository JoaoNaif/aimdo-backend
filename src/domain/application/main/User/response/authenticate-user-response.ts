import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { WrongCredentialsError } from '../errors/wrong-credentials-error'

export type AuthenticateUserUseCaseResponse = Either<
  ResourceNotFoundError | WrongCredentialsError,
  {
    accessToken: string
  }
>
