import { UseCaseError } from '@/core/errors/use-case-error'

export class EmailAlreadyExistError extends Error implements UseCaseError {
  constructor() {
    super('E-mail already exist')
  }
}
