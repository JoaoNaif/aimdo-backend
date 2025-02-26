import { UseCaseError } from '@/core/errors/use-case-error'

export class OldPasswordCredentialsError extends Error implements UseCaseError {
  constructor() {
    super('Error credentials in old password')
  }
}
