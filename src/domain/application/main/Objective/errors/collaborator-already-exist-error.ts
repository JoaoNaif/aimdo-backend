import { UseCaseError } from '@/core/errors/use-case-error'

export class CollaboratorAlreadyExistError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('Collaborator already exist in collaborators list')
  }
}
