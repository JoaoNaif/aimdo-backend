import { UseCaseError } from '@/core/errors/use-case-error'

export class ObjectiveInviteAlreadyExistError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('There is already a pending invitation for this collaborator')
  }
}
