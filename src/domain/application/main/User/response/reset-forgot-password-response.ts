import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ConfirmPasswordCredentialsError } from '../errors/confirm-password-credentials-error'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'

export type ResetForgotPasswordUseCaseResponse = Either<
  ResourceNotFoundError | ConfirmPasswordCredentialsError | UnauthorizedError,
  null
>
