import { UseCaseError } from '@/core/errors/use-case-error'

export class ConfirmPasswordCredentialsError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('Error credentials in confirm password')
  }
}
