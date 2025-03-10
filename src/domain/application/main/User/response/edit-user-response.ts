import { Either } from '@/core/either'
import { EmailAlreadyExistError } from '../errors/user-email-already-exist-error'
import { UsernameAlreadyExistError } from '../errors/user-username-already.exist'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

export type EditUserUseCaseResponse = Either<
  EmailAlreadyExistError | UsernameAlreadyExistError | ResourceNotFoundError,
  null
>
