import { UseCaseError } from '@/core/errors/use-case-error'

export class CollaboratorAlreadyAcceptInviteError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('Collaborator already accepted invite')
  }
}
