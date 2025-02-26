import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ConfirmPasswordCredentialsError } from '../errors/confirm-password-credentials-error'
import { OldPasswordCredentialsError } from '../errors/old-password-credentials-error'

export type ResetPasswordUserUseCaseResponse = Either<
  | ResourceNotFoundError
  | ConfirmPasswordCredentialsError
  | OldPasswordCredentialsError,
  null
>
