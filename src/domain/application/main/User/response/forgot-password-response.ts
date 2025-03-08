import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

export type ForgotPasswordResponse = Either<
  ResourceNotFoundError,
  {
    token: string
  }
>
