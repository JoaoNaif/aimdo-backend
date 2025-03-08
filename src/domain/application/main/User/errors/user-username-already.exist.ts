import { UseCaseError } from '@/core/errors/use-case-error'

export class UsernameAlreadyExistError extends Error implements UseCaseError {
  constructor() {
    super('Username already exist')
  }
}
