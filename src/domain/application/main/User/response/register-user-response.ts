import { Either } from '@/core/either'
import { EmailAlreadyExistError } from '../errors/user-email-already-exist-error'
import { User } from '@/domain/enterprise/entities/user'
import { UsernameAlreadyExistError } from '../errors/user-username-already.exist'

export type RegisterUserUseCaseResponse = Either<
  EmailAlreadyExistError | UsernameAlreadyExistError,
  {
    user: User
  }
>
